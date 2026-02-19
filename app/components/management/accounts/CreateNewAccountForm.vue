<script setup lang="ts">
import { useCreateNewAccount } from '@/composables/Accounts/useCreateNewAccount';
import { useFetchAllUsers } from '@/composables/Users/useFetchAllUsers';

// Form state
const owner_id = ref('');
const title = ref('');
const description = ref('');

// Composables
const { users, error: fetchAllError, FetchAllUsers } = useFetchAllUsers();
const { error, loading, CreateNewAccount } = useCreateNewAccount();

onMounted(() => FetchAllUsers());

// Submit form
function submit() {
	CreateNewAccount({
		owner_id: owner_id.value,
		title: title.value,
		description: description.value,
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
				<form @submit.prevent="submit()" class="modal">
					<h2>Create New Account</h2>

					<div>
						<label for="owner_id">Owner:</label>
						<select id="owner_id" v-model="owner_id">
							<option v-for="user in users" :value="user.id" :key="user.id">
								{{ user.username }}
							</option>
						</select>
					</div>

					<div>
						<label for="title">Title:</label>
						<input id="title" v-model="title" type="text" required />
					</div>

					<div>
						<label for="description">Description:</label>
						<textarea id="description" v-model="description"></textarea>
					</div>

					<button type="submit" :disabled="loading">
						{{ loading ? 'Creating...' : 'Create' }}
					</button>

					<p v-if="error" class="error">{{ error }}</p>
				</form>
			</div>
		</Teleport>
	</ClientOnly>
</template>

<style src="@/assets/management/index.scss" lang="scss"></style>
