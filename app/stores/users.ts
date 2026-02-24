import { defineStore } from 'pinia';
import type { User } from '~/types/user';
import { useUsersAPI } from '@/composables/API/useUsersAPI';
import type { CreateUserPayload, UpdateUserPayload } from '@/types/payloads/user';

const {
	users,
	totalUsers,
	lastPage,
	error,
	fetchAll,
	fetchPagenized,
	CreateUser,
	DeleteAllUsers,
	DeleteManyUsers,
	DeleteUser,
	UpdateUser,
} = useUsersAPI();

export const useUserStore = defineStore('users', {
	state: () => ({
		users: [] as User[],
		selectedUsers: [] as string[],
		totalUsers: 0,
		lastPage: 0,
		error: null as string | null,

		loading_create: false,
		loading_fetchAll: false,
		loading_fetchPagenized: false,
		loading_deleteAll: false,
		loading_deleteMany: false,
		loading_delete: false,
		loading_update: false,
	}),

	actions: {
		async fetchAllUsers() {
			this.error = null;
			this.loading_fetchAll = true;

			await fetchAll();

			this.users = users.value;
			this.error = error.value;
			this.loading_fetchAll = false;
		},

		async fetchPagenizedUsers(page: number = 1, limit: number = 10) {
			this.error = null;
			this.loading_fetchPagenized = true;

			await fetchPagenized();

			this.users = users.value;
			this.totalUsers = totalUsers.value;
			this.lastPage = lastPage.value;
			this.loading_fetchPagenized = false;
			this.error = error.value;
		},

		async refreshUsers() {
			this.loading_fetchAll = true;
			this.error = null;

			await fetchAll();
			this.users = users.value;
			this.totalUsers = totalUsers.value;
			this.lastPage = lastPage.value;

			this.loading_fetchAll = false;
			this.error = error.value;
		},

		async CreateUser(payload: CreateUserPayload) {
			this.loading_create = true;
			this.error = null;

			await CreateUser(payload);
			await this.refreshUsers();

			this.error = error.value;
			this.loading_create = false;
		},

		async UpdateUser(user_id: string, payload: UpdateUserPayload) {
			this.loading_update = true;
			this.error = null;

			await UpdateUser(user_id, payload);
			await this.refreshUsers();

			this.error = error.value;
			this.loading_update = false;
		},

		async DeleteAllUsers() {
			this.error = null;
			this.loading_deleteAll = true;

			await DeleteAllUsers();
			await this.refreshUsers();
               
			this.loading_deleteAll = false;
			this.error = error.value;
		},

		async DeleteManyUsers(ids: string[]) {
			this.loading_deleteMany = true;
			this.error = null;

			await DeleteManyUsers(ids);
			await this.refreshUsers();

			this.error = error.value;
			this.loading_deleteMany = false;
		},

		async DeleteUser(id: string) {
			this.loading_delete = true;
			this.error = null;

			await DeleteUser(id);
			await this.refreshUsers();

			this.error = error.value;
			this.loading_delete = false;
		},
	},
});
