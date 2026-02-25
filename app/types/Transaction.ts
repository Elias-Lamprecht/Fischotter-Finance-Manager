export interface Transaction {
	id: string;
	owner_id: string;
	account_id: string;
	title: string;
	description?: string;
	year: number;
	month: number;
	day: number;
	type: string;
	price: number;
	created_at: Date;
}
