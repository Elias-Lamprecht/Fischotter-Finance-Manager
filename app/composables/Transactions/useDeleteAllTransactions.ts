import type { ApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';
import { useConfirm } from '@/composables/useConfirm';
import { useFetchAllTransactions } from './useFetchAllTransactions';

export function useDeleteAllTransactions() {
	const loading = ref(false);
	const error = ref('');
	const { showConfirm } = useConfirm();
	const { FetchAllTransactions } = useFetchAllTransactions();

	async function DeleteAllTransactions() {
		loading.value = true;
		error.value = '';

		const result = await showConfirm('Are you sure you want to delete all Transactions?');

		if (result) {
			try {
				const response = await $fetch<ApiResponse>(
					'/api/management/delete/all/transactions',
					{
						method: 'DELETE',
					},
				);

				if (response.state === 'success') {
					await FetchAllTransactions();
				} else {
					error.value = response.message || ERRORS.GENERAL.ERROR;
				}
			} catch (err) {
				error.value = ERRORS.GENERAL.ERROR;
			} finally {
				loading.value = false;
			}
		} else {
			loading.value = false;
		}
	}
	return { error, loading, DeleteAllTransactions };
}
