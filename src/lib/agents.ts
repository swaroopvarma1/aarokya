export type AgentKey = 'akshaya' | 'priya';

export interface CardField {
	key: string;
	label: string;
	icon: string;
	format?: 'currency';
}

export interface AgentConfig {
	key: AgentKey;
	name: string;
	role: string;
	avatarLetter: string;
	accentColor: string;
	// Backend
	template: string;
	payload: Record<string, unknown>;
	// Function call
	functionCallName: string;
	// Incident card
	cardFields: CardField[];
	// Success
	idPrefix: string;
	successTitleKey: string;
	successDescKey: string;
}

const AGENTS: Record<AgentKey, AgentConfig> = {
	akshaya: {
		key: 'akshaya',
		name: 'Akshaya',
		role: 'Claims Assistant',
		avatarLetter: 'A',
		accentColor: '#006565',
		template: 'aarokya-testing-template',
		payload: { customer_name: 'Chirag', insurance_limit: 500000 },
		functionCallName: 'finish_claim',
		cardFields: [
			{ key: 'claim_amount', label: 'Claim Amount', icon: 'payments', format: 'currency' },
			{ key: 'incident', label: 'Issue', icon: 'report' },
			{ key: 'hospital_name', label: 'Hospital', icon: 'local_hospital' }
		],
		idPrefix: 'AR-CLM-',
		successTitleKey: 'success.title',
		successDescKey: 'success.desc'
	},
	priya: {
		key: 'priya',
		name: 'Priya',
		role: 'Health Advisor',
		avatarLetter: 'P',
		accentColor: '#5B3E96',
		template: 'priya-health-advisor-template',
		payload: {
			policy_holder_name: 'Chirag',
			policy_holder_dob: '1992-06-15',
			policy_number: 'NADH-2024-087341',
			family_members: 'Chirag (Self, 33 yrs), Meghana (Wife, 30 yrs), Aarav (Son, 5 yrs), Kamala (Mother, 61 yrs)',
			known_conditions: 'Mild Asthma',
			known_allergies: 'Dust allergy',
			current_medications: 'Asthalin inhaler (as needed)'
		},
		functionCallName: 'record_findings',
		cardFields: [
			{ key: 'patient_name', label: 'Patient', icon: 'person' },
			{ key: 'chief_complaint', label: 'Complaint', icon: 'sick' },
			{ key: 'severity_score', label: 'Severity (0-10)', icon: 'priority_high' },
			{ key: 'callback_priority', label: 'Priority', icon: 'schedule' }
		],
		idPrefix: 'AR-CON-',
		successTitleKey: 'priya.success.title',
		successDescKey: 'priya.success.desc'
	}
};

export function getAgent(key?: string | null): AgentConfig {
	if (key && key in AGENTS) return AGENTS[key as AgentKey];
	return AGENTS.akshaya;
}
