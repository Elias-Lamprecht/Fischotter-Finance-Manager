import { ref } from 'vue';
import type { User } from '@/types/User';
import type { PaginationApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';

const TotalUsers = ref(0);
const users = ref<User[]>([]);

export function useFetchPagenizedUsers() {
	const lastPage = ref(1);
	const error = ref('');
	const page = ref(1);
	const limit = ref(10);

	async function FetchPagenizedUsers() {
		try {
			const response = await $fetch<PaginationApiResponse<User[]>>(
				'/api/management/get/all-as-pages/users',
				{
					method: 'POST',
					body: { page: page.value, limit },
				},
			);

			if (response.state === 'success') {
				users.value = response.data;
				TotalUsers.value = response.pagination.total;
				lastPage.value = response.pagination.lastPage;
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	return {
		users,
		TotalUsers,
		lastPage,
		error,
		page,
		limit,
		FetchPagenizedUsers,
	};
}
