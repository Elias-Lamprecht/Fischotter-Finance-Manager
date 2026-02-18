import { ref } from 'vue';
import type { User } from '@/types/User';
import type { ApiResponse } from '~/types/API';
import { ERRORS } from '#shared/utils/Errors';

const users = ref<User[]>([]);

export function useFetchAllUsers() {
	const error = ref('');

	async function FetchAllUsers() {
		try {
			const response = await $fetch<ApiResponse<User[]>>('/api/management/get/all/users', {
				method: 'GET',
			});

			if (response.state === 'success') {
				users.value = response.data ?? [];
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}
	return { users, error, FetchAllUsers };
}
