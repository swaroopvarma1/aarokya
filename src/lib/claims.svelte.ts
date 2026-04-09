export interface Claim {
	id: string;
	title: string;
	amount: string;
	status: 'new' | 'review' | 'resolved';
	date: string;
	hospital_name?: string;
	incident?: string;
}

function loadClaims(): Claim[] {
	if (typeof sessionStorage === 'undefined') return [];
	const raw = sessionStorage.getItem('aarokya-claims');
	return raw ? JSON.parse(raw) : [];
}

let _claims: Claim[] = $state(loadClaims());

export function getClaims(): Claim[] {
	return _claims;
}

export function addClaim(claim: Claim) {
	_claims = [claim, ..._claims];
	if (typeof sessionStorage !== 'undefined') {
		sessionStorage.setItem('aarokya-claims', JSON.stringify(_claims));
	}
}
