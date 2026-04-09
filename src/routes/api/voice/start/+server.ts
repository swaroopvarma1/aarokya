import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAgent } from '$lib/agents';

// ── Hardcoded config ──
const BACKEND_URL = 'https://clairvoyance.breezelabs.app';
const JWT_TOKEN =
	'REDACTED';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => ({}));
	const agent = getAgent(body.agent_type);

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${JWT_TOKEN}`
	};

	try {
		// Step 1: Create a lead
		const requestId = crypto.randomUUID();
		const leadRes = await fetch(`${BACKEND_URL}/agent/voice/breeze-buddy/leads`, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				reseller_id: 'breeze',
				merchant_id: 'aarokya',
				reporting_webhook_url: '',
				template: agent.template,
				request_id: requestId,
				payload: agent.payload,
				execution_mode: 'DAILY_TEST'
			})
		});

		if (!leadRes.ok) {
			const err = await leadRes.text();
			console.error('Lead creation failed:', leadRes.status, err);
			return json({ error: 'Failed to create lead', details: err }, { status: leadRes.status });
		}

		const leadData = await leadRes.json();
		const leadId = leadData.lead_call_tracker_id;
		console.log('Lead created:', leadId);

		// Step 2: Connect to Daily session
		const connectRes = await fetch(`${BACKEND_URL}/agent/voice/breeze-buddy/connect`, {
			method: 'POST',
			headers,
			body: JSON.stringify({ lead_id: leadId })
		});

		if (!connectRes.ok) {
			const err = await connectRes.text();
			console.error('Connect failed:', connectRes.status, err);
			return json(
				{ error: 'Failed to connect to voice session', details: err },
				{ status: connectRes.status }
			);
		}

		const connectData = await connectRes.json();
		console.log('Connected to room:', connectData.room_url);

		return json({
			room_url: connectData.room_url,
			token: connectData.token,
			session_id: connectData.session_id,
			lead_id: leadId
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		console.error('Voice session setup failed:', message);
		return json({ error: 'Voice session setup failed', details: message }, { status: 500 });
	}
};
