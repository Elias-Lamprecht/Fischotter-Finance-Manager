import { ref } from 'vue';
import type { ApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';
import { useFetchPagenizedUsers } from '@/composables/Users/useFetchPagenizedUsers';

export function useCreateNewUser() {
	const loading = ref(false);
	const error = ref('');
	const { FetchPagenizedUsers } = useFetchPagenizedUsers();

	async function CreateNewUser(payload: { username: string; email: string; password: string }) {
		loading.value = true;
		error.value = '';

		try {
			const response = await $fetch<ApiResponse>('/api/public/register', {
				method: 'POST',
				body: {
					username: payload.username,
					email: payload.email,
					password: payload.password,
				},
			});

			if (response.state === 'success') {
				await FetchPagenizedUsers();
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			loading.value = false;
		}
	}
	return { loading, error, CreateNewUser };
}
