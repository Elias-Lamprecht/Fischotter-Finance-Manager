import type { ApiResponse } from '~/types/API';
import type { User } from '~/types/User';
import { useFetchPagenizedUsers } from '@/composables/Users/useFetchPagenizedUsers';
import { ERRORS } from '#shared/utils/Errors';

export function useUpdateUser() {
	const error = ref('');
	const { FetchPagenizedUsers } = useFetchPagenizedUsers();

	async function UpdateUser(user: User) {
		try {
			const response = await $fetch<ApiResponse>('/api/management/modify/user', {
				method: 'POST',
				body: {
					id: user.id,
					username: user.username,
					displayname: user.displayname,
					email: user.email,
					role: user.role,
					status: user.status,
				},
			});

			if (response.state === 'success') {
				await FetchPagenizedUsers();
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	return { error, UpdateUser };
}
