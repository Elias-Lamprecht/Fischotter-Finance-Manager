import type { ApiResponse } from '~/types/API';
import { ERRORS } from '#shared/utils/Errors';
import { useFetchPagenizedTransactions } from '@/composables/Transactions/useFetchPagenizedTransactions';
import { useConfirm } from '@/composables/useConfirm';

export function useDeleteTransaction() {
	const error = ref('');
	const { FetchPagenizedTransactions } = useFetchPagenizedTransactions();
	const { showConfirm } = useConfirm();

	async function DeleteTransaction(id: string) {
		const result = await showConfirm('Are you sure you want to delete this transaction?');

		if (result) {
			try {
				const response = await $fetch<ApiResponse>(
					'/api/management/delete/by-id/transaction',
					{
						method: 'DELETE',
						body: {
							id: id,
						},
					},
				);
				if (response.state === 'success') {
					await FetchPagenizedTransactions();
				} else {
					error.value = response.message || ERRORS.GENERAL.ERROR;
				}
			} catch (err) {
				error.value = ERRORS.GENERAL.ERROR;
			}
		}
	}

	return { error, DeleteTransaction };
}
