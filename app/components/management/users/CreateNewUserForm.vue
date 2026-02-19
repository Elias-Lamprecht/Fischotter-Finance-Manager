<script lang="ts" setup>
import { useCreateNewUser } from '@/composables/Users/useCreateNewUser';

// Form state
const username = ref('');
const email = ref('');
const password = ref('');

// Composable
const { error, loading, CreateNewUser } = useCreateNewUser();

// Create form
function create() {
	CreateNewUser({
		username: username.value,
		email: email.value,
		password: password.value,
	});
	closeModal();
}

const props = defineProps({
	show: Boolean,
});
const emit = defineEmits(['update:show']);

function closeModal() {
	emit('update:show', false);
}
</script>
<template>
	<ClientOnly>
		<Teleport to="body">
			<div v-if="show" class="overlay" @click.self="closeModal">
				<form @submit.prevent="create()">
					<h2>Create New User</h2>
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
			</div>
		</Teleport>
	</ClientOnly>

	<p v-if="error" style="color: red">{{ error }}</p>
</template>
