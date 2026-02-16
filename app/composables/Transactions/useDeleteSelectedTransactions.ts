import type { ApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';
import { useFetchPagenizedTransactions } from '@/composables/Transactions/useFetchPagenizedTransactions';
import { useConfirm } from '@/composables/useConfirm';

export function useDeleteSelectedTransactions() {
	const error = ref('');
	const SelectedTransactions = ref([]);
	const { FetchPagenizedTransactions } = useFetchPagenizedTransactions();
	const { showConfirm } = useConfirm();

	async function DeleteSelectedTransactions(TransactionArray: any) {
		const result = await showConfirm(
			'Are you sure you want to delete the selected Transactions?',
		);

		if (result) {
			try {
				const response = await $fetch<ApiResponse>(
					'/api/management/delete/many/transactions',
					{
						method: 'DELETE',
						body: {
							TransactionArray: TransactionArray,
						},
					},
				);

				if (response.state === 'success') {
					await FetchPagenizedTransactions();
					SelectedTransactions.value.length = 0;
				} else {
					error.value = response.message || ERRORS.GENERAL.ERROR;
				}
			} catch (err) {
				error.value = ERRORS.GENERAL.ERROR;
			}
		}
	}
	return { error, SelectedTransactions, DeleteSelectedTransactions };
}
