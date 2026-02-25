import type { User } from '@/types/user';
import type { ApiResponse, PaginatedResponse } from '@/types/API';
import type { CreateUserPayload, UpdateUserPayload } from '@/types/payloads/user';
import { ERRORS } from '#shared/utils/Errors';

export function useUsersAPI() {
	const users = ref<User[]>([]);
	const totalUsers = ref(0);
	const lastPage = ref(0);
	const loading = ref(false);
	const error = ref('');

	async function fetchAll() {
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

	async function fetchPagenized(page: number = 1, limit: number = 10) {
		try {
			const response = await $fetch<PaginatedResponse<User[]>>(
				'/api/management/get/all-as-pages/users',
				{
					method: 'POST',
					body: { page, limit },
				},
			);

			if (response.state === 'success') {
				users.value = response.data;
				totalUsers.value = response.pagination.total;
				lastPage.value = response.pagination.lastPage;
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch {
			error.value = ERRORS.GENERAL.ERROR;
		}
	}

	async function CreateUser(payload: CreateUserPayload) {
		loading.value = true;
		error.value = '';

		try {
			const response = await $fetch<ApiResponse>('/api/public/register', {
				method: 'POST',
				body: payload,
			});

			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			loading.value = false;
		}
	}

	async function UpdateUser(user_id: string, user: UpdateUserPayload) {
		try {
			const response = await $fetch<ApiResponse>('/api/management/modify/user', {
				method: 'POST',
				body: {
					id: user_id,
					...user,
				},
			});

			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			loading.value = false;
		}
	}

	async function DeleteUser(id: string) {
		try {
			const response = await $fetch<ApiResponse>('/api/management/delete/by-id/user', {
				method: 'DELETE',
				body: {
					id,
				},
			});
			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			loading.value = false;
		}
	}

	async function DeleteDisabledUsers() {
		try {
			const response = await $fetch<ApiResponse>(
				'/api/management/delete/all/disabled-users',
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
	}

	async function DeleteManyUsers(ids: string[]) {
		try {
			const response = await $fetch<ApiResponse>('/api/management/delete/many/users', {
				method: 'DELETE',
				body: {
					UserArray: ids,
				},
			});

			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			loading.value = false;
		}
	}

	async function DeleteAllUsers() {
		try {
			const response = await $fetch<ApiResponse>('/api/management/delete/all/users', {
				method: 'DELETE',
			});

			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			} else {
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			loading.value = false;
		}
	}

	return {
		users,
		totalUsers,
		lastPage,
		loading,
		error,
		fetchAll,
		fetchPagenized,
		CreateUser,
		UpdateUser,
		DeleteUser,
		DeleteDisabledUsers,
		DeleteManyUsers,
		DeleteAllUsers,
	};
}
