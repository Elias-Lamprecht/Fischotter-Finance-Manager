import type { ApiResponse } from '~/types/API';
import type { Account } from '~/types/Account';
import { useFetchAllAccounts } from '@/composables/Accounts/useFetchAllAccounts';
import { ERRORS } from '#shared/utils/Errors';

export function useUpdateAccount() {
	const error = ref('');
	const { FetchAllAccounts } = useFetchAllAccounts();

	async function UpdateAccount(account: Account) {
		try {
			const response = await $fetch<ApiResponse>('/api/management/modify/account', {
				method: 'POST',
				body: {
					id: account.id,
					owner_id: account.owner_id,
					title: account.title,
					description: account.description,
				},
			});

			if (response.state === 'success') {
				await FetchAllAccounts();
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}
	return { error, UpdateAccount };
}
