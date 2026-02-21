<template>
	<h2 class="management__page-title">Account Management</h2>

	<div class="management__page-header">
		<button @click="showModal = true" class="management__button">Create User</button>
		<div class="management__delete-group">
			<form @submit.prevent="DeleteSelectedUsers(SelectedUsers)">
				<button type="submit" class="management__delete-button management__button">
					Delete Selected Users
				</button>
			</form>
			<DeleteAllUsersForm />
		</div>
	</div>

	<div class="management__count-page-wrapper">
		<div class="management__count-wrapper">
			<p>Total Users: {{ TotalUsers }}</p>
			<p>Selected Users: {{ SelectedUsers.length }}</p>
		</div>
	</div>

	<div class="EntityList">
		<div class="EntityList__grid">
			<div class="EntityList__row EntityList__row--user">
				<div class="EntityList__header"><b>Select</b></div>
				<div class="EntityList__header"><b>ID</b></div>
				<div class="EntityList__header"><b>Username</b></div>
				<div class="EntityList__header"><b>Displayname</b></div>
				<div class="EntityList__header"><b>Email</b></div>
				<div class="EntityList__header"><b>Role</b></div>
				<div class="EntityList__header"><b>Status</b></div>
				<div class="EntityList__header"><b>Created At</b></div>
				<div class="EntityList__header"><b>Actions</b></div>
			</div>
			<div
				v-for="user in users"
				:key="user.id"
				class="EntityList__row EntityList__row--user"
				:class="{ selected: SelectedUsers.includes(user.id) }"
			>
				<div class="EntityList__list-item">
					<input type="checkbox" :value="user.id" v-model="SelectedUsers" />
				</div>
				<div class="EntityList__list-item">
					<input type="text" :value="user.id" disabled />
				</div>
				<div class="EntityList__list-item">
					<input type="text" v-model="user.email" />
				</div>
				<div class="EntityList__list-item">
					<input type="text" v-model="user.username" />
				</div>
				<div class="EntityList__list-item">
					<input type="text" v-model="user.displayname" />
				</div>
				<div class="EntityList__list-item">
					<select v-model="user.role">
						<option value="user">user</option>
						<option value="admin">admin</option>
					</select>
				</div>
				<div class="EntityList__list-item">
					<select v-model="user.status">
						<option value="active">active</option>
						<option value="disabled">disabled</option>
					</select>
				</div>
				<div class="EntityList__list-item EntityList__list-date-item">
					{{
						new Date(user.created_at).toLocaleString('en-UK', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
						})
					}}
				</div>
				<div class="EntityList__actions EntityList__list-item">
					<button
						@click="UpdateUser(user)"
						class="management__button management__update-button"
					>
						Update User
					</button>
					<button
						@click="DeleteUser(user.id)"
						class="management__button management__delete-button"
					>
						Delete User
					</button>
				</div>
			</div>
		</div>
	</div>
	<nav class="management__page-control">
		<div>
			<button @click="PreviousPage" :disabled="page === 1" class="management__button">
				Previous Page
			</button>
		</div>
		<p class="management__page-control__current-page">{{ page }}</p>
		<div>
			<button @click="NextPage" :disabled="page === lastPage" class="management__button">
				Next Page
			</button>
		</div>
	</nav>
	<CreateNewUserForm v-model:show="showModal" />
</template>
<style src="@/assets/management/index.scss" lang="scss"></style>
<script setup lang="ts">
// COMPOSABLES
import { useFetchPagenizedUsers } from '@/composables/Users/useFetchPagenizedUsers';
import { useDeleteUser } from '@/composables/Users/delete/useDeleteUser';
import { useDeleteSelectedUsers } from '@/composables/Users/delete/useDeleteSelectedUsers';
import { useUpdateUser } from '@/composables/Users/useUpdateUser';

// COMPONENTS
import DeleteAllUsersForm from '@/components/management/users/DeleteAllUsersForm.vue';
import CreateNewUserForm from '@/components/management/users/CreateNewUserForm.vue';

const showModal = ref(false);

const {
	users,
	TotalUsers,
	lastPage,
	error: fetchError,
	page,
	FetchPagenizedUsers,
} = useFetchPagenizedUsers();

const { error: deleteUserError, DeleteUser } = useDeleteUser();

const {
	error: deleteSelectedUsersError,
	SelectedUsers,
	DeleteSelectedUsers,
} = useDeleteSelectedUsers();

const { error: updateUserError, UpdateUser } = useUpdateUser();

const pageInput = ref(1);

onMounted(() => FetchPagenizedUsers());

async function NextPage() {
	if (page.value < lastPage.value) {
		page.value++;
		pageInput.value = page.value;
		await FetchPagenizedUsers();
	}
}

async function PreviousPage() {
	if (page.value > 1) {
		page.value--;
		pageInput.value = page.value;
		await FetchPagenizedUsers();
	}
}

async function GoToPage() {
	if (pageInput.value < 1) return;
	if (pageInput.value > lastPage.value) return;

	page.value = pageInput.value;
	await FetchPagenizedUsers();
}
</script>
