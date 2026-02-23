export interface CreateAccountPayload {
	owner_id: string;
	title: string;
	description?: string;
	primary: boolean;
}

export interface UpdateAccountPayload {
	owner_id?: string;
	title?: string;
	description?: string;
	primary?: boolean;
}
