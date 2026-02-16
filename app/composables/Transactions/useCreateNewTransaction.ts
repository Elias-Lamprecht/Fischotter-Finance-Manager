import { ref } from 'vue';
import type { ApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';
import { useFetchAllTransactions } from '@/composables/Transactions/useFetchAllTransactions';

export function useCreateNewTransaction() {
	const loading = ref(false);
	const error = ref('');
	const { FetchAllTransactions } = useFetchAllTransactions();

	async function CreateNewTransaction(payload: {
		owner_id: string;
		account_id: string;
		title: string;
		type: string;
		price: number;
		description?: string;
	}) {
		loading.value = true;
		error.value = '';

		try {
			const response = await $fetch<ApiResponse>('/api/management/create/transaction', {
				method: 'POST',
				body: {
					owner_id: payload.owner_id,
					account_id: payload.account_id,
					title: payload.title,
					description: payload.description,
					type: payload.type,
					price: payload.price,
				},
			});

			if (response.state === 'success') {
				await FetchAllTransactions();
				console.log('fetching');
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			loading.value = false;
		}
	}
	return { loading, error, CreateNewTransaction };
}
