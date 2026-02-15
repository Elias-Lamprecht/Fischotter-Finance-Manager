import type { ApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';
import { useConfirm } from '@/composables/useConfirm';

// TODO: Add Fetchall

export function useDeleteAllAccounts() {
	const error = ref('');
	const loading = ref(false);
	const { showConfirm } = useConfirm();

	async function DeleteAllAccounts() {
		const result = await showConfirm('Are you sure you want to delete all Accounts?');
		loading.value = true;
		error.value = '';

		if (result) {
			try {
				const response = await $fetch<ApiResponse>(
					'/api/management/delete/all/accounts',
					{
						method: 'DELETE',
					},
				);

				if (response.state !== 'success') {
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
	return { error, loading, DeleteAllAccounts };
}
