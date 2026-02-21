export interface CreateTransactionPayload {
	owner_id: string;
	account_id: string;
	title: string;
	description?: string;
	type: string;
	price: number;
	day: number;
	month: number;
	year: number;
}

export interface UpdateTransactionPayload {
	owner_id?: string;
	account_id?: string;
	title?: string;
	description?: string;
	type?: string;
	price?: number;
	day?: number;
	month?: number;
	year?: number;
}
