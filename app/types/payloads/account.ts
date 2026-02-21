export interface CreateAccountPayload {
	owner_id: string;
	title: string;
	description?: string;
}

export interface UpdateAccountPayload {
	owner_id?: string;
	title?: string;
	description?: string;
}
