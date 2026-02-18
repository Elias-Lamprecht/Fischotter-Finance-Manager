import { ref } from 'vue';
import type { Account } from '@/types/Account';
import type { ApiResponse } from '~/types/API';
import { ERRORS } from '#shared/utils/Errors';

const accounts = ref<Account[]>([]);

export function useFetchAllAccounts() {
	const error = ref('');

	async function FetchAllAccounts() {
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
	return { accounts, error, FetchAllAccounts };
}
