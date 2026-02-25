import { defineStore } from 'pinia';
import type { Account } from '~/types/Account';
import { useAccountsAPI } from '@/composables/API/useAccountsAPI';
import type { CreateAccountPayload, UpdateAccountPayload } from '~/types/payloads/account';

const {
	accounts,
	totalAccounts,
	lastPage,
	loading,
	error,
	fetchAll,
	fetchPagenized,
	CreateAccount,
	UpdateAccount,
	DeleteAccount,
	DeleteManyAccounts,
	DeleteAllAccounts,
} = useAccountsAPI();

export const useAccountStore = defineStore('accounts', {
	state: () => ({
		accounts: [] as Account[],
		selectedAccounts: [] as string[],
		totalAccounts: 0,
		lastPage: 0,
		error: null as string | null,

		loading_create: false,
		loading_fetchAll: false,
		loading_fetchPagenized: false,
		loading_deleteAll: false,
		loading_deleteMany: false,
		loading_delete: false,
		loading_update: false,
	}),

	actions: {
		async fetchAllAccounts() {
			this.error = null;
			this.loading_fetchAll = true;

			await fetchAll();

			this.accounts = accounts.value;
			this.error = error.value;
			this.loading_fetchAll = false;
		},

		async fetchPagenizedAccounts(page: number = 1, limit: number = 1) {
			this.error = null;
			this.loading_fetchPagenized = true;

			await fetchPagenized(page, limit);

			this.accounts = accounts.value;
			this.totalAccounts = totalAccounts.value;
			this.lastPage = lastPage.value;
			this.loading_fetchPagenized = false;
			this.error = error.value;
		},

		async refreshAccounts() {
			this.loading_fetchAll = true;
			this.error = null;

			await fetchAll();
			this.accounts = accounts.value;
			this.totalAccounts = totalAccounts.value;
			this.lastPage = lastPage.value;

			this.loading_fetchAll = false;
			this.error = error.value;
		},

		async CreateAccount(payload: CreateAccountPayload) {
			this.loading_create = true;
			this.error = null;

			await CreateAccount(payload);
			await this.refreshAccounts();

			this.error = error.value;
			this.loading_create = false;
		},

		async UpdateAccount(user_id: string, payload: UpdateAccountPayload) {
			this.loading_update = true;
			this.error = null;

			await UpdateAccount(user_id, payload);
			await this.refreshAccounts();

			this.error = error.value;
			this.loading_update = false;
		},

		async DeleteAllAccounts() {
			this.loading_deleteAll = true;
			this.error = null;

			await DeleteAllAccounts();
			await this.refreshAccounts();

			this.error = error.value;
			this.loading_deleteAll = false;
		},

		async DeleteManyAccounts(ids: string[]) {
			this.loading_deleteMany = true;
			this.error = null;

			await DeleteManyAccounts(ids);
			this.selectedAccounts = [];
			await this.refreshAccounts();

			this.error = error.value;
			this.loading_deleteMany = false;
		},

		async DeleteAccount(id: string) {
			this.loading_delete = true;
			this.error = null;

			await DeleteAccount(id);
			await this.refreshAccounts();

			this.error = error.value;
			this.loading_delete = false;
		},
	},
});
