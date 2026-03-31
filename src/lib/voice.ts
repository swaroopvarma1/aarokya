import { PipecatClient } from '@pipecat-ai/client-js';
import { DailyTransport } from '@pipecat-ai/daily-transport';

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error' | 'disconnected';

export interface TranscriptEntry {
	role: 'user' | 'assistant';
	text: string;
	timestamp: string;
	final: boolean;
}

export interface FunctionCallData {
	functionName: string;
	args: Record<string, unknown>;
}

export interface ServerMessage {
	type: string;
	data?: Record<string, unknown>;
	[key: string]: unknown;
}

export interface VoiceCallbacks {
	onStatusChange: (status: ConnectionStatus) => void;
	onTranscript: (entry: TranscriptEntry) => void;
	onBotReady: () => void;
	onBotStartedSpeaking: () => void;
	onBotStoppedSpeaking: () => void;
	onUserStartedSpeaking: () => void;
	onUserStoppedSpeaking: () => void;
	onFunctionCall?: (data: FunctionCallData) => void;
	onServerMessage?: (message: ServerMessage) => void;
	onError: (error: string) => void;
}

let client: PipecatClient | null = null;
let audioElement: HTMLAudioElement | null = null;

function now(): string {
	return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export async function startVoiceSession(callbacks: VoiceCallbacks, agentType?: string): Promise<void> {
	if (client) {
		await stopVoiceSession();
	}

	callbacks.onStatusChange('connecting');

	// Track bot LLM text accumulation
	let currentBotText = '';
	let hasLlmText = false; // true when we got LLM text, so we skip onBotTranscript duplicates

	try {
		client = new PipecatClient({
			transport: new DailyTransport({
				inputSettings: {
					audio: {
						processor: { type: 'noise-cancellation' },
						settings: {
							echoCancellation: { ideal: true },
							noiseSuppression: { ideal: true },
							autoGainControl: { ideal: true },
						}
					}
				}
			}),
			params: {
				baseUrl: '',
			},
			enableMic: false,
			enableCam: false,
			callbacks: {
				onConnected: () => {
					callbacks.onStatusChange('connected');
					// Enable mic after connection (matches loom pattern)
					client?.enableMic(true);
				},
				onDisconnected: () => {
					callbacks.onStatusChange('disconnected');
				},
				onBotDisconnected: () => {
					callbacks.onStatusChange('disconnected');
				},
				onTransportStateChanged: (state: string) => {
					if (state === 'error') {
						callbacks.onStatusChange('error');
						callbacks.onError('Transport connection error');
					}
				},
				onBotStartedSpeaking: () => {
					callbacks.onBotStartedSpeaking();
				},
				onBotStoppedSpeaking: () => {
					callbacks.onBotStoppedSpeaking();
				},
				onUserStartedSpeaking: () => {
					callbacks.onUserStartedSpeaking();
				},
				onUserStoppedSpeaking: () => {
					callbacks.onUserStoppedSpeaking();
				},
				// Audio track management (matches Lighthouse v2 pattern)
				onTrackStarted: (track: MediaStreamTrack, participant?: { local: boolean }) => {
					if (track.kind === 'audio' && participant && !participant.local) {
						if (!audioElement) {
							audioElement = document.createElement('audio');
							audioElement.autoplay = true;
							audioElement.setAttribute('playsinline', '');
						}
						// Dedup: skip if same track is already playing
						if (audioElement.srcObject) {
							const existing = (audioElement.srcObject as MediaStream).getAudioTracks()[0];
							if (existing?.id === track.id) return;
						}
						audioElement.srcObject = new MediaStream([track]);
					}
				},
				onTrackStopped: (track: MediaStreamTrack, participant?: { local: boolean }) => {
					if (track.kind === 'audio' && participant && !participant.local) {
						if (audioElement) {
							audioElement.srcObject = null;
						}
					}
				},
				// User transcript (STT result)
				onUserTranscript: (data: unknown) => {
					const obj = data as { text?: string; final?: boolean };
					const text = typeof data === 'string' ? data : obj?.text ?? '';
					const final = typeof data === 'string' ? true : obj?.final ?? true;
					if (text) {
						callbacks.onTranscript({
							role: 'user',
							text,
							timestamp: now(),
							final
						});
					}
				},
				// Bot LLM streaming: started -> text chunks -> stopped
				onBotLlmStarted: () => {
					currentBotText = '';
					hasLlmText = false;
				},
				onBotLlmText: (data: unknown) => {
					const text = typeof data === 'string' ? data : (data as { text?: string })?.text ?? '';
					currentBotText += text;
					hasLlmText = true;
					callbacks.onTranscript({
						role: 'assistant',
						text: currentBotText,
						timestamp: now(),
						final: false
					});
				},
				onBotLlmStopped: () => {
					if (currentBotText) {
						callbacks.onTranscript({
							role: 'assistant',
							text: currentBotText,
							timestamp: now(),
							final: true
						});
					}
					currentBotText = '';
				},
				// Bot transcript (TTS-based) — skip if we already have LLM text
				onBotTranscript: (data: unknown) => {
					if (hasLlmText) return;
					const text = typeof data === 'string' ? data : (data as { text?: string })?.text ?? '';
					if (text) {
						callbacks.onTranscript({
							role: 'assistant',
							text,
							timestamp: now(),
							final: true
						});
					}
				},
				// Function call interception (new API)
				onLLMFunctionCallStarted: (data: unknown) => {
					console.log('[FunctionCall:Started]', JSON.stringify(data, null, 2));
				},
				onLLMFunctionCallInProgress: (data: unknown) => {
					console.log('[FunctionCall:InProgress]', JSON.stringify(data, null, 2));
					const obj = data as { function_name?: string; arguments?: Record<string, unknown> };
					if (callbacks.onFunctionCall && obj?.function_name) {
						callbacks.onFunctionCall({
							functionName: obj.function_name,
							args: obj.arguments ?? {}
						});
					}
				},
				onLLMFunctionCallStopped: (data: unknown) => {
					console.log('[FunctionCall:Stopped]', JSON.stringify(data, null, 2));
				},
				// Function call interception (deprecated fallback)
				onLLMFunctionCall: (data: unknown) => {
					console.log('[FunctionCall:Legacy]', JSON.stringify(data, null, 2));
					const obj = data as { function_name?: string; arguments?: Record<string, unknown> };
					if (callbacks.onFunctionCall && obj?.function_name) {
						callbacks.onFunctionCall({
							functionName: obj.function_name,
							args: obj.arguments ?? {}
						});
					}
				},
				onServerMessage: (message: unknown) => {
					const msg = message as ServerMessage;
					if (msg?.type === 'bot-ready') {
						callbacks.onBotReady();
					}
					callbacks.onServerMessage?.(msg);
				}
			}
		});

		// Request mic permission
		await client.initDevices();

		// Connect: calls our proxy which creates lead + gets room credentials
		await client.startBotAndConnect({
			endpoint: `${window.location.origin}/api/voice/start`,
			requestData: { agent_type: agentType }
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		callbacks.onError(message);
		callbacks.onStatusChange('error');
	}
}

export async function stopVoiceSession(): Promise<void> {
	if (client) {
		try {
			await client.disconnect();
		} catch {
			// Ignore disconnect errors
		}
		client = null;
	}
	if (audioElement) {
		// Stop all tracks before clearing (prevents lingering audio)
		if (audioElement.srcObject) {
			(audioElement.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
		}
		audioElement.srcObject = null;
		audioElement = null;
	}
}

export function toggleMic(enabled: boolean): void {
	// Direct track manipulation preferred (Lighthouse v2 pattern)
	const track = client?.tracks()?.local?.audio;
	if (track) {
		track.enabled = enabled;
	} else {
		client?.enableMic(enabled);
	}
}

export function sendMessage(type: string, data?: Record<string, unknown>): void {
	client?.sendMessage({ type, ...data });
}
