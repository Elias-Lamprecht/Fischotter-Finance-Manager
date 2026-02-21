import type { ApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';
import { useFetchPagenizedUsers } from '@/composables/Users/useFetchPagenizedUsers';
import { useConfirm } from '@/composables/useConfirm';

export function useDeleteSelectedUsers() {
	const error = ref('');
	const SelectedUsers = ref<string[]>([]);
	const { FetchPagenizedUsers } = useFetchPagenizedUsers();
	const { showConfirm } = useConfirm();

	async function DeleteSelectedUsers(UserArray: any) {
		const result = await showConfirm('Are you sure you want to delete the selected Users?');

		if (result) {
			try {
				const response = await $fetch<ApiResponse>(
					'/api/management/delete/many/users',
					{
						method: 'DELETE',
						body: {
							UserArray: UserArray,
						},
					},
				);

				if (response.state === 'success') {
					await FetchPagenizedUsers();
					SelectedUsers.value.length = 0;
				} else {
					error.value = response.message || ERRORS.GENERAL.ERROR;
				}
			} catch (err) {
				error.value = ERRORS.GENERAL.ERROR;
			}
		}
	}
	return { error, SelectedUsers, DeleteSelectedUsers };
}
