import type { Account } from '~/types/Account';
import type { ApiResponse } from '~/types/API';
import { defineStore } from 'pinia';

export const useAccountStore = defineStore('accounts', {
	state: () => ({
		accounts: [] as Account[],
		error: null as string | null,
		loading: false,
	}),

	actions: {
		async fetchAllAccounts() {
			this.error = null;
			this.loading = true;

			try {
				const response = await $fetch<ApiResponse<Account[]>>(
					'/api/management/get/all/accounts',
					{
						method: 'GET',
					},
				);

				this.accounts = response.data ?? [];
			} catch (err: any) {
				this.error = err?.message || 'Failed to fetch accounts';
			} finally {
				this.loading = false;
			}
		},
	},
});
