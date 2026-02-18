<template>
	<form @submit.prevent="create()">
		<br />
		<div>
			<label for="username">Username:</label>
			<input v-model="username" id="username" type="text" required />
		</div>

		<div>
			<label for="email">Email:</label>
			<input v-model="email" id="email" type="text" />
		</div>

		<div>
			<label for="password">Password:</label>
			<input v-model="password" id="password" type="text" required />
		</div>
		<br />
		<button type="submit" :disabled="loading">
			{{ loading ? 'Creating...' : 'Create new User' }}
		</button>
		<br />
	</form>

	<p v-if="error" style="color: red">{{ error }}</p>
</template>
<script lang="ts" setup>
import { useCreateNewUser } from '@/composables/Users/useCreateNewUser';

const username = ref('');
const email = ref('');
const password = ref('');

const { error, loading, CreateNewUser } = useCreateNewUser();

function create() {
	CreateNewUser({
		username: username.value,
		email: email.value,
		password: password.value,
	});
}
</script>
