import type { Account } from '@/types/Account';
import type { ApiResponse, PaginatedResponse } from '@/types/API';
import type { CreateAccountPayload, UpdateAccountPayload } from '@/types/payloads/account';
import { ERRORS } from '#shared/utils/Errors';

export function useAccountsAPI() {
	const accounts = ref<Account[]>([]);
	const totalAccounts = ref(0);
	const lastPage = ref(0);
	const loading = ref(false);
	const error = ref('');

	async function fetchAll() {
		try {
			const response = await $fetch<ApiResponse<Account[]>>(
				'/api/management/get/all/accounts',
				{
					method: 'GET',
				},
			);

			if (response.state === 'success') {
				accounts.value = response.data ?? [];
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	async function fetchPagenized(page: number = 1, limit: number = 10) {
		try {
			const response = await $fetch<PaginatedResponse<Account[]>>(
				'/api/management/get/all-as-pages/accounts',
				{
					method: 'POST',
					body: { page, limit },
				},
			);

			if (response.state === 'success') {
				accounts.value = response.data;
				totalAccounts.value = response.pagination.total;
				lastPage.value = response.pagination.lastPage;
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	async function CreateAccount(payload: CreateAccountPayload) {
		loading.value = true;
		error.value = '';

		try {
			const response = await $fetch<ApiResponse>('/api/management/create/account', {
				method: 'POST',
				body: payload,
			});

			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			loading.value = false;
		}
	}

	async function UpdateAccount(account_id: string, account: UpdateAccountPayload) {
		try {
			const response = await $fetch<ApiResponse>('/api/management/modify/account', {
				method: 'POST',
				body: {
					id: account_id,
					...account,
				},
			});

			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	async function DeleteAccount(id: string) {
		try {
			const response = await $fetch<ApiResponse>('/api/management/delete/by-id/account', {
				method: 'DELETE',
				body: { id },
			});

			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	async function DeleteManyAccounts(ids: string[]) {
		try {
			const response = await $fetch<ApiResponse>('/api/management/delete/many/accounts', {
				method: 'DELETE',
				body: {
					AccountArray: ids,
				},
			});

			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	async function DeleteAllAccounts() {
		loading.value = true;
		error.value = '';

		try {
			const response = await $fetch<ApiResponse>('/api/management/delete/all/accounts', {
				method: 'DELETE',
			});

			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			loading.value = false;
		}
	}

	return {
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
	};
}
