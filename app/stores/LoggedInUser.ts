import { defineStore } from 'pinia';

export const useLoggedInUserStore = defineStore('LoggedInUser', {
	state: () => ({
		UserData: {} as {
			username?: string;
			displayname?: string;
			email?: string;
			role?: string;
		},
	}),

	actions: {
		async SetLoggedInUserData(payload: {
			username?: string;
			displayname?: string;
			email?: string;
			role?: string;
		}) {
			this.UserData = {
				username: payload.username,
				displayname: payload.displayname,
				email: payload.email,
				role: payload.role,
			};
		},
	},
});
