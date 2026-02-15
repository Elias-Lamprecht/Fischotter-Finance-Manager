<template>
	<form @submit.prevent="submit()">
		<br />
		<div>
			<label for="owner_id">Owner ID:</label>
			<input v-model="owner_id" id="owner_id" type="text" required />
		</div>

		<div>
			<label for="title">title:</label>
			<input v-model="title" id="title" type="text" required />
		</div>

		<div>
			<label for="description">description:</label>
			<textarea v-model="description" id="description" type="text"></textarea>
		</div>
		<br />
		<button type="submit" :disabled="loading">
			{{ loading ? 'Creating...' : 'Create new Account' }}
		</button>
		<br />
		<p v-if="error" style="color: red">{{ error }}</p>
	</form>
</template>
<script setup lang="ts">
import { useCreateNewAccount } from '@/composables/Accounts/useCreateNewAccount';

const owner_id = ref('');
const title = ref('');
const description = ref('');

function submit() {
	CreateNewAccount({
		owner_id: owner_id.value,
		title: title.value,
		description: description.value,
	});
}

const { error, loading, CreateNewAccount } = useCreateNewAccount();
</script>
