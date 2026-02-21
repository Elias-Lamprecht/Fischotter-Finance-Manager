export interface CreateUserPayload {
	username: string;
	email?: string;
	password: string;
}

export interface UpdateUserPayload {
	username: string;
	email?: string;
	displayname?: string;
	role: 'user' | 'admin';
	status: 'active' | 'disabled';
}
