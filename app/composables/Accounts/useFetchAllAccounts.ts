import type { Account } from '@/types/Account';
import type { PaginationApiResponse } from '~/types/API';
import { ERRORS } from '#shared/utils/Errors';

const accounts = ref<Account[]>([]);
const TotalAccounts = ref(0);
const lastPage = ref(1);

export function useFetchAllAccounts() {
	const error = ref('');
	const page = ref(1);
	const limit = ref(10);

	async function FetchAllAccounts() {
		try {
			const response = await $fetch<PaginationApiResponse<Account[]>>(
				'/api/management/get/all-as-pages/accounts',
				{
					method: 'POST',
					body: { page: page.value, limit },
				},
			);

			if (response.state === 'success') {
				accounts.value = response.data;
				TotalAccounts.value = response.pagination.total;
				lastPage.value = response.pagination.lastPage;
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}
	return { accounts, TotalAccounts, lastPage, error, page, limit, FetchAllAccounts };
}
