import type { ApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';
import { useConfirm } from '@/composables/useConfirm';
import { useFetchPagenizedUsers } from '@/composables/Users/useFetchPagenizedUsers';

export function useDeleteAllUsers() {
	const loading = ref(false);
	const error = ref('');
	const { showConfirm } = useConfirm();
	const { FetchPagenizedUsers } = useFetchPagenizedUsers();

	async function DeleteAllUsers() {
		loading.value = true;
		error.value = '';

		const result = await showConfirm('Are you sure you want to delete all Users?');

		if (result) {
			try {
				const response = await $fetch<ApiResponse>('/api/management/delete/all/users', {
					method: 'DELETE',
				});

				if (response.state === 'success') {
					await FetchPagenizedUsers();
				} else {
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
	return { error, loading, DeleteAllUsers };
}
