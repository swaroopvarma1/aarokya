export type Lang = 'en' | 'kn';

// Reactive language state synced with sessionStorage
let _lang: Lang = $state(
	(typeof sessionStorage !== 'undefined' && (sessionStorage.getItem('aarokya-lang') as Lang)) || 'en'
);

export function getLang(): Lang {
	return _lang;
}

export function setLang(lang: Lang) {
	_lang = lang;
	if (typeof sessionStorage !== 'undefined') {
		sessionStorage.setItem('aarokya-lang', lang);
	}
}

export function toggleLang() {
	setLang(_lang === 'en' ? 'kn' : 'en');
}

// Translation helper
export function t(key: string): string {
	const entry = translations[key];
	if (!entry) return key;
	return entry[_lang] || entry['en'] || key;
}

// ── All translations (English + Kanglish) ──
const translations: Record<string, Record<Lang, string>> = {
	// ── Homepage ──
	'home.greeting': {
		en: 'Namaste, Chirag.',
		kn: 'ನಮಸ್ಕಾರ, Chirag.'
	},
	'home.subtitle': {
		en: 'Your health is our priority. Aarokya is by your side. Get help in minutes, not hours.',
		kn: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ನಮ್ಮ priority. Aarokya ನಿಮ್ಮ ಜೊತೆಗಿದೆ. ನಿಮಿಷಗಳಲ್ಲಿ ಸಹಾಯ ಪಡೆಯಿರಿ.'
	},
	'home.cta.badge': {
		en: 'File a claim in 2 minutes',
		kn: '2 ನಿಮಿಷದಲ್ಲಿ claim file ಮಾಡಿ'
	},
	'home.cta.title': {
		en: 'Talk to Akshaya',
		kn: 'Akshaya ಜೊತೆ ಮಾತನಾಡಿ'
	},
	'home.cta.desc': {
		en: 'Need to file a claim? Talk to our AI assistant and get it done instantly.',
		kn: 'Claim file ಮಾಡಬೇಕಾ? AI assistant ಜೊತೆ instant ಆಗಿ ಮಾಡಿ.'
	},
	'home.cta.button': {
		en: 'Start Conversation',
		kn: 'ಮಾತನಾಡಿ'
	},
	'home.policy.label': {
		en: 'Active Policy',
		kn: 'Active Policy'
	},
	'home.policy.name': {
		en: 'Comprehensive Health',
		kn: 'Comprehensive Health'
	},
	'home.policy.expiry': {
		en: 'Expiry Date',
		kn: 'Expiry Date'
	},
	'home.policy.view': {
		en: 'View Details',
		kn: 'ವಿವರ ನೋಡಿ'
	},
	'home.quickhelp': {
		en: 'Quick Help',
		kn: 'Quick Help'
	},
	'home.emergency': {
		en: 'Emergency Helpline',
		kn: 'Emergency Helpline'
	},
	'home.claimstatus': {
		en: 'Claim Status',
		kn: 'Claim Status'
	},
	'home.recent': {
		en: 'Recent Claims',
		kn: 'ಇತ್ತೀಚಿನ Claims'
	},
	'home.seeall': {
		en: 'See All',
		kn: 'ಎಲ್ಲಾ ನೋಡಿ'
	},
	'home.opd': {
		en: 'OPD visit at Apollo Clinic',
		kn: 'Apollo Clinic OPD visit'
	},
	'home.profile.title': {
		en: 'Profile Snapshot',
		kn: 'Profile Snapshot'
	},
	'home.profile.role': {
		en: 'Delivery Partner',
		kn: 'Delivery Partner'
	},
	'home.profile.complete': {
		en: 'Profile 75% Complete',
		kn: 'Profile 75% Complete'
	},
	'home.trust.verified': {
		en: 'Verified Claims',
		kn: 'Verified Claims'
	},
	'home.trust.response': {
		en: '2 Min Response',
		kn: '2 Min Response'
	},
	'home.trust.secure': {
		en: '100%\nSecure',
		kn: '100%\nSecure'
	},

	// ── Nav ──
	'nav.home': { en: 'Home', kn: 'ಹೋಮ್' },
	'nav.claims': { en: 'Claims', kn: 'Claims' },
	'nav.support': { en: 'Support', kn: 'ಸಹಾಯ' },
	'nav.profile': { en: 'Profile', kn: 'Profile' },

	// ── Chat page ──
	'chat.greeting': {
		en: 'Need help, Chirag?',
		kn: 'ಸಹಾಯ ಬೇಕಾ, Chirag?'
	},
	'chat.subtitle': {
		en: 'Akshaya is ready to assist you with claims, policy queries, and more.',
		kn: 'Akshaya claims, policy queries ಮತ್ತು ಇನ್ನೂ ಹೆಚ್ಚಿನದಕ್ಕೆ ಸಹಾಯ ಮಾಡಲು ready.'
	},
	'chat.hero.title': {
		en: 'I am Akshaya, your Aarokya assistant.',
		kn: 'ನಾನು Akshaya, ನಿಮ್ಮ Aarokya assistant.'
	},
	'chat.hero.desc': {
		en: "I'm here to help you with your insurance and claims, anytime.",
		kn: 'Insurance ಮತ್ತು claims ಬಗ್ಗೆ ಯಾವಾಗಲೂ ಸಹಾಯ ಮಾಡಲು ನಾನಿದ್ದೇನೆ.'
	},
	'chat.hero.button': {
		en: 'Start Claim Help',
		kn: 'Claim ಸಹಾಯ ಶುರು ಮಾಡಿ'
	},
	'chat.hero.connecting': {
		en: 'Connecting...',
		kn: 'Connect ಆಗುತ್ತಿದೆ...'
	},
	'chat.actions.title': {
		en: 'How can I help you today?',
		kn: 'ಇಂದು ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?'
	},
	'chat.actions.start': {
		en: 'Start a claim',
		kn: 'Claim ಶುರು ಮಾಡಿ'
	},
	'chat.actions.status': {
		en: 'Check claim status',
		kn: 'Claim status ನೋಡಿ'
	},
	'chat.actions.update': {
		en: 'Update details',
		kn: 'Details update ಮಾಡಿ'
	},
	'chat.actions.support': {
		en: 'Talk to support',
		kn: 'Support ಜೊತೆ ಮಾತನಾಡಿ'
	},
	'chat.trust.encrypted.title': {
		en: 'Encrypted Data',
		kn: 'Encrypted Data'
	},
	'chat.trust.encrypted.desc': {
		en: 'Your health data is protected with 256-bit encryption.',
		kn: 'ನಿಮ್ಮ health data 256-bit encryption ನಿಂದ protected.'
	},
	'chat.trust.instant.title': {
		en: 'Instant Processing',
		kn: 'Instant Processing'
	},
	'chat.trust.instant.desc': {
		en: 'Most claim inquiries are resolved within minutes.',
		kn: 'ಹೆಚ್ಚಿನ claim inquiries ನಿಮಿಷಗಳಲ್ಲಿ resolve ಆಗುತ್ತವೆ.'
	},
	'chat.trust.banner': {
		en: 'Your data is 100% secure. Information is used only for claim assistance.',
		kn: 'ನಿಮ್ಮ data 100% secure. Claim assistance ಗೆ ಮಾತ್ರ use ಆಗುತ್ತದೆ.'
	},

	// ── Assist page ──
	'assist.status.progress': {
		en: 'Claim assistance in progress',
		kn: 'Claim assistance ನಡೆಯುತ್ತಿದೆ'
	},
	'assist.status.connecting': {
		en: 'Connecting...',
		kn: 'Connect ಆಗುತ್ತಿದೆ...'
	},
	'assist.status.error': {
		en: 'Connection failed',
		kn: 'Connection fail ಆಯಿತು'
	},
	'assist.status.ended': {
		en: 'Call ended',
		kn: 'Call ಮುಗಿಯಿತು'
	},
	'assist.speaking': {
		en: 'Speaking',
		kn: 'ಮಾತನಾಡುತ್ತಿದೆ'
	},
	'assist.listening': {
		en: 'Listening',
		kn: 'ಕೇಳುತ್ತಿದೆ'
	},
	'assist.transcript': {
		en: 'Live Transcript',
		kn: 'Live Transcript'
	},
	'assist.connecting.bot': {
		en: 'Connecting...',
		kn: 'Connect ಆಗುತ್ತಿದೆ...'
	},
	'assist.thinking': {
		en: 'Thinking...',
		kn: 'ಯೋಚಿಸುತ್ತಿದೆ...'
	},
	'assist.incident': {
		en: 'Incident Details',
		kn: 'Incident Details'
	},
	'assist.syncing': {
		en: 'Syncing live...',
		kn: 'Live sync ಆಗುತ್ತಿದೆ...'
	},
	'assist.fullname': {
		en: 'Full Name',
		kn: 'ಹೆಸರು'
	},
	'assist.issue': {
		en: 'Issue',
		kn: 'Issue'
	},
	'assist.hospital': {
		en: 'Hospital',
		kn: 'Hospital'
	},
	'assist.mute': { en: 'Mute', kn: 'Mute' },
	'assist.unmute': { en: 'Unmute', kn: 'Unmute' },
	'assist.upload': { en: 'Upload', kn: 'Upload' },
	'assist.endcall': { en: 'End Call', kn: 'End Call' },
	'assist.type': { en: 'Type', kn: 'Type' },
	'assist.more': { en: 'More', kn: 'More' },

	// ── Claims page ──
	'claims.subtitle': {
		en: 'Your claim history and active requests.',
		kn: 'ನಿಮ್ಮ claim history ಮತ್ತು active requests.'
	},

	// ── Success page ──
	'success.title': {
		en: 'Claim is generated',
		kn: 'Claim generate ಆಗಿದೆ'
	},
	'success.desc': {
		en: "Rest easy, Chirag. We've received everything. We will get back to you within 2 hours.",
		kn: 'ನಿಶ್ಚಿಂತೆಯಾಗಿರಿ, Chirag. ಎಲ್ಲವೂ ಸಿಕ್ಕಿದೆ. 2 ಗಂಟೆಯಲ್ಲಿ ನಿಮಗೆ ತಿಳಿಸುತ್ತೇವೆ.'
	},
	'success.ref': {
		en: 'Ref Number',
		kn: 'Ref Number'
	},
	'success.new': {
		en: 'New',
		kn: 'New'
	},
	'success.claim_title': {
		en: 'Accident claim at Apollo Clinic',
		kn: 'Apollo Clinic ನಲ್ಲಿ accident claim'
	},
	'success.progress': {
		en: 'Live Progress',
		kn: 'Live Progress'
	},
	'success.step1': {
		en: 'Claim Received',
		kn: 'Claim ಸ್ವೀಕರಿಸಲಾಗಿದೆ'
	},
	'success.step1_sub': {
		en: 'Now',
		kn: 'ಈಗ'
	},
	'success.step2': {
		en: 'Under Review',
		kn: 'Review ನಡೆಯುತ್ತಿದೆ'
	},
	'success.step2_sub': {
		en: 'Estimated 1 hour',
		kn: 'ಅಂದಾಜು 1 ಗಂಟೆ'
	},
	'success.step3': {
		en: 'Team will contact you.',
		kn: 'Team ನಿಮ್ಮನ್ನು contact ಮಾಡುತ್ತದೆ.'
	},
	'success.step3_sub': {
		en: 'Final Verification',
		kn: 'Final Verification'
	},
	'success.track': {
		en: 'Track Claim',
		kn: 'Claim Track ಮಾಡಿ'
	},
	'priya.success.track': {
		en: 'Track Consultation',
		kn: 'Consultation Track ಮಾಡಿ'
	},
	'priya.success.claim_title': {
		en: 'Health consultation with Priya',
		kn: 'Priya ಜೊತೆ Health consultation'
	},
	'priya.success.step1': {
		en: 'Consultation Recorded',
		kn: 'Consultation record ಆಗಿದೆ'
	},
	'priya.success.step2': {
		en: 'Doctor Review',
		kn: 'Doctor Review'
	},
	'priya.success.step3': {
		en: 'Doctor will contact you.',
		kn: 'Doctor ನಿಮ್ಮನ್ನು contact ಮಾಡುತ್ತಾರೆ.'
	},
	'priya.success.step3_sub': {
		en: 'Follow-up Call',
		kn: 'Follow-up Call'
	},
	'success.home': {
		en: 'Back to Home',
		kn: 'ಹೋಮ್ ಗೆ ಹಿಂತಿರುಗಿ'
	},

	// ── Priya (Health Advisor) ──
	'priya.cta.badge': {
		en: 'Free health consultation',
		kn: 'ಉಚಿತ health consultation'
	},
	'priya.cta.title': {
		en: 'Talk to Priya',
		kn: 'Priya ಜೊತೆ ಮಾತನಾಡಿ'
	},
	'priya.cta.desc': {
		en: 'Get a preliminary health consultation with our AI health advisor.',
		kn: 'AI health advisor ಜೊತೆ preliminary health consultation ಪಡೆಯಿರಿ.'
	},
	'priya.cta.button': {
		en: 'Start Consultation',
		kn: 'Consultation ಶುರು ಮಾಡಿ'
	},
	'priya.hero.title': {
		en: 'I am Priya, your Health Advisor.',
		kn: 'ನಾನು Priya, ನಿಮ್ಮ Health Advisor.'
	},
	'priya.hero.desc': {
		en: 'As a Narayana Aditi member, get a free preliminary consultation. A doctor will follow up.',
		kn: 'Narayana Aditi member ಆಗಿ, ಉಚಿತ preliminary consultation ಪಡೆಯಿರಿ. Doctor follow up ಮಾಡುತ್ತಾರೆ.'
	},
	'priya.assist.status': {
		en: 'Health consultation in progress',
		kn: 'Health consultation ನಡೆಯುತ್ತಿದೆ'
	},
	'priya.assist.incident': {
		en: 'Consultation Summary',
		kn: 'Consultation Summary'
	},
	'priya.success.title': {
		en: 'Consultation recorded',
		kn: 'Consultation record ಆಗಿದೆ'
	},
	'priya.success.desc': {
		en: "Rest easy, Chirag. Your consultation is recorded. A doctor will call you back within 2 hours.",
		kn: 'ನಿಶ್ಚಿಂತೆಯಾಗಿರಿ, Chirag. Consultation record ಆಗಿದೆ. 2 ಗಂಟೆಯಲ್ಲಿ doctor call ಮಾಡುತ್ತಾರೆ.'
	},
};
