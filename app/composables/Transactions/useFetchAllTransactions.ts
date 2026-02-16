import { ref } from 'vue';
import type { Transaction } from '@/types/Transaction';
import type { PaginationApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';

const TotalTransactions = ref(0);
const transactions = ref<Transaction[]>([]);

export function useFetchTransactions() {
	const lastPage = ref(1);
	const error = ref('');
	const page = ref(1);
	const limit = ref(10);

	async function FetchTransactions() {
		try {
			const response = await $fetch<PaginationApiResponse<Transaction[]>>(
				'/api/management/get/all-as-pages/transactions',
				{
					method: 'POST',
					body: { page: page.value, limit },
				},
			);

			if (response.state === 'success') {
				transactions.value = response.data;
				TotalTransactions.value = response.pagination.total;
				console.log(TotalTransactions.value);
				lastPage.value = response.pagination.lastPage;
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	return { transactions, TotalTransactions, lastPage, error, page, limit, FetchTransactions };
}
