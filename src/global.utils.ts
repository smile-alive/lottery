export interface Data {
	name: string;
	phone: string;
}

const WINNERS_SESSION_KEY = 'lottery_winners';

export function getWinnersFromSession(): Data[] {
	try {
		const str = sessionStorage.getItem(WINNERS_SESSION_KEY);
		return str ? JSON.parse(str) : [];
	} catch {
		return [];
	}
}

export function saveWinnersToSession(winners: Data[]) {
	sessionStorage.setItem(WINNERS_SESSION_KEY, JSON.stringify(winners));
}
