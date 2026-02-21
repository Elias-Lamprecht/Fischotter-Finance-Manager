import type { Transaction } from '@/types/Transaction';
import type { ApiResponse, PaginatedResponse } from '@/types/API';
import type {
	CreateTransactionPayload,
	UpdateTransactionPayload,
} from '@/types/payloads/transaction';
import { ERRORS } from '#shared/utils/Errors';

export function useTransactionsAPI() {
	const transactions = ref<Transaction[]>([]);
	const totalTransactions = ref(0);
	const lastPage = ref(0);
	const loading = ref(false);
	const error = ref('');

	async function fetchAll() {
		try {
			const response = await $fetch<ApiResponse<Transaction[]>>(
				'/api/management/get/all/transactions',
				{
					method: 'GET',
				},
			);

			if (response.state === 'success') {
				transactions.value = response.data ?? [];
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	async function fetchPagenized(page: number = 1, limit: number = 10) {
		try {
			const response = await $fetch<PaginatedResponse<Transaction[]>>(
				'/api/management/get/all-as-pages/transactions',
				{
					method: 'POST',
					body: { page, limit },
				},
			);

			if (response.state === 'success') {
				transactions.value = response.data;
				totalTransactions.value = response.pagination.total;
				lastPage.value = response.pagination.lastPage;
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	async function CreateTransaction(payload: CreateTransactionPayload) {
		loading.value = true;
		error.value = '';

		try {
			const response = await $fetch<ApiResponse>('/api/management/create/transaction', {
				method: 'POST',
				body: payload,
			});

			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			loading.value = false;
		}
	}

	async function UpdateTransaction(
		transaction_id: string,
		transaction: UpdateTransactionPayload,
	) {
		try {
			const response = await $fetch<ApiResponse>('/api/management/modify/transaction', {
				method: 'POST',
				body: {
					id: transaction_id,
					...transaction,
				},
			});

			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	async function DeleteTransaction(id: string) {
		try {
			const response = await $fetch<ApiResponse>(
				'/api/management/delete/by-id/transaction',
				{
					method: 'DELETE',
					body: {
						id,
					},
				},
			);
			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	async function DeleteManyTransactions(ids: string[]) {
		try {
			const response = await $fetch<ApiResponse>(
				'/api/management/delete/many/transactions',
				{
					method: 'DELETE',
					body: {
						TransactionArray: ids,
					},
				},
			);

			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	async function DeleteAllTransactions() {
		loading.value = true;
		error.value = '';

		try {
			const response = await $fetch<ApiResponse>(
				'/api/management/delete/all/transactions',
				{
					method: 'DELETE',
				},
			);

			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			loading.value = false;
		}
	}
}
