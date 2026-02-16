import type { ApiResponse } from '~/types/API';
import type { Transaction } from '~/types/Transaction';
import { useFetchPagenizedTransactions } from '@/composables/Transactions/useFetchPagenizedTransactions';
import { ERRORS } from '#shared/utils/Errors';

export function useUpdateTransaction() {
	const error = ref('');
	const { FetchPagenizedTransactions } = useFetchPagenizedTransactions();

	async function UpdateTransaction(transaction: Transaction) {
		try {
			const response = await $fetch<ApiResponse>('/api/management/modify/transaction', {
				method: 'POST',
				body: {
					id: transaction.id,
					account_id: transaction.account_id,
					owner_id: transaction.owner_id,
					title: transaction.title,
					description: transaction.description,
					type: transaction.type,
					price: transaction.price,
				},
			});

			if (response.state === 'success') {
				await FetchPagenizedTransactions();
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	return { error, UpdateTransaction };
}
