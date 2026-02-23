export interface Account {
	id: string;
	owner_id: string;
	title: string;
	description?: string;
	primary: boolean;
	created_at: string;
}
