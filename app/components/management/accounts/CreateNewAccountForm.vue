<script setup lang="ts">
import { useAccountStore } from '@/stores/accounts';
import { useUserStore } from '@/stores/users';

const AccountStore = useAccountStore();
const UserStore = useUserStore();

const owner_id = ref('');
const title = ref('');
const description = ref('');

onMounted(async () => {
	AccountStore.fetchAllAccounts();
	UserStore.fetchAllUsers();
});

// Submit form
function submit() {
	AccountStore.CreateAccount({
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
							<option
								v-for="user in UserStore.users"
								:value="user.id"
								:key="user.id"
							>
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

					<button type="submit" :disabled="AccountStore.loading_create">
						{{ AccountStore.loading_create ? 'Creating...' : 'Create' }}
					</button>

					<p v-if="AccountStore.error" class="error">{{ AccountStore.error }}</p>
				</form>
			</div>
		</Teleport>
	</ClientOnly>
</template>

<style src="@/assets/management/index.scss" lang="scss"></style>
