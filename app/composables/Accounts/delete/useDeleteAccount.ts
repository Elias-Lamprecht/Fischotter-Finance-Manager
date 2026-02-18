import type { ApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';
import { useFetchPagenizedAccounts } from '@/composables/Accounts/useFetchPagenizedAccounts';

export function useDeleteAccount() {
	const error = ref('');
	const { FetchPagenizedAccounts } = useFetchPagenizedAccounts();

	async function DeleteAccount(id: string) {
		try {
			const response = await $fetch<ApiResponse>('/api/management/delete/by-id/account', {
				method: 'DELETE',
				body: { id: id },
			});

			if (response.state === 'success') {
				await FetchPagenizedAccounts();
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			FetchPagenizedAccounts();
		}
	}
	return { error, DeleteAccount };
}
