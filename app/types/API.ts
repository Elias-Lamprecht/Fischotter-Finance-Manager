export interface ApiResponse<T = any> {
	state: 'success' | 'error' | 'denied';
	data?: T;
	message?: string;
}

export interface LoginApiResponse {
	state: 'success' | 'error' | 'denied';
	data?: {
		token: string;
		user: {
			username: string;
			displayname: string;
			email: string;
			role: string;
		};
	};
	message?: string;
}

export type PaginatedResponse<T> =
	| {
			state: 'success';
			data: T;
			pagination: {
				total: number;
				page: number;
				limit: number;
				lastPage: number;
				hasNext: boolean;
				hasPrev: boolean;
			};
	  }
	| {
			state: 'denied' | 'error';
			message: string;
	  };
