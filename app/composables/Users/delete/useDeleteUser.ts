import type { ApiResponse } from '~/types/API';
import { ERRORS } from '#shared/utils/Errors';
import { useFetchPagenizedUsers } from '@/composables/Users/useFetchPagenizedUsers';
import { useConfirm } from '@/composables/useConfirm';

export function useDeleteUser() {
	const error = ref('');
	const { FetchPagenizedUsers } = useFetchPagenizedUsers();
	const { showConfirm } = useConfirm();

	async function DeleteUser(id: string) {
		const result = await showConfirm('Are you sure you want to delete this User?');

		if (result) {
			try {
				const response = await $fetch<ApiResponse>(
					'/api/management/delete/by-id/user',
					{
						method: 'DELETE',
						body: {
							id: id,
						},
					},
				);
				if (response.state === 'success') {
					await FetchPagenizedUsers();
				} else {
					error.value = response.message || ERRORS.GENERAL.ERROR;
				}
			} catch (err) {
				error.value = ERRORS.GENERAL.ERROR;
			}
		}
	}

	return { error, DeleteUser };
}
