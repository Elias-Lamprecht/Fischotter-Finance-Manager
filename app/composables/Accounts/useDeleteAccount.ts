import type { ApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';
import { useFetchAllAccounts } from '@/composables/Accounts/useFetchAllAccounts';

export function useDeleteAccount() {
	const error = ref('');
	const { FetchAllAccounts } = useFetchAllAccounts();

	async function DeleteAccount(id: string) {
		try {
			const response = await $fetch<ApiResponse>('/api/management/delete/by-id/account', {
				method: 'DELETE',
				body: { id: id },
			});

			if (response.state === 'success') {
				await FetchAllAccounts();
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			FetchAllAccounts();
		}
	}
	return { error, DeleteAccount };
}
