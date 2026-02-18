<template>
	<DeleteAllUsersForm />
	<CreateNewUserForm />

	<form @submit.prevent="DeleteSelectedUsers(SelectedUsers)">
		<button type="submit">Delete Selected Users</button>
	</form>

	<p>Total Users: {{ TotalUsers }}</p>
	<p>Selected Users: {{ SelectedUsers.length }}</p>

	<ul v-for="user in users" :key="user.id" style="display: flex; flex-direction: row">
		<li><input type="checkbox" :value="user.id" v-model="SelectedUsers" /></li>

		<li>ID: <input type="text" :value="user.id" disabled /></li>

		<li v-if="user.email">Email: <input type="text" v-model="user.email" /></li>

		<li>Username: <input type="text" v-model="user.username" /></li>

		<li>Displayname: <input type="text" v-model="user.displayname" /></li>

		<li>
			Role:
			<select v-model="user.role">
				<option value="user">user</option>
				<option value="admin">admin</option>
			</select>
		</li>

		<li>
			Status:
			<select v-model="user.status">
				<option value="active">active</option>
				<option value="disabled">disabled</option>
			</select>
		</li>

		<li>
			Created at:
			{{
				new Date(user.created_at).toLocaleString('en-UK', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				})
			}}
		</li>

		<li>
			<button @click="DeleteUser(user.id)">Delete User</button>
		</li>

		<li>
			<button @click="UpdateUser(user)">Update User</button>
		</li>
		<br />
	</ul>
	<ul>
		<li>
			<button @click="PreviousPage" :disabled="page === 1">Previous Page</button>
		</li>
		<li>
			<button @click="NextPage" :disabled="page === lastPage">Next Page</button>
		</li>
		<li>
			<input type="number" v-model.number="pageInput" :min="1" :max="lastPage" />
			<button @click="GoToPage">Go</button>
		</li>
		<li>Last Page: {{ lastPage }}</li>
	</ul>
</template>

<script setup lang="ts">
// COMPOSABLES
import { useFetchPagenizedUsers } from '@/composables/Users/useFetchPagenizedUsers';
import { useDeleteUser } from '@/composables/Users/delete/useDeleteUser';
import { useDeleteSelectedUsers } from '@/composables/Users/delete/useDeleteSelectedUsers';
import { useUpdateUser } from '@/composables/Users/useUpdateUser';

// COMPONENTS
import DeleteAllUsersForm from '@/components/management/users/DeleteAllUsersForm.vue';
import CreateNewUserForm from '@/components/management/users/CreateNewUserForm.vue';

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
