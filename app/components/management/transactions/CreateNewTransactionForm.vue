<template>
	<form @submit.prevent="submitTransaction()">
		<br />
		<div>
			<label for="owner_id">Owner ID:</label>
			<input v-model="owner_id" id="owner_id" type="text" required />
		</div>

		<div>
			<label for="account_id">Account ID:</label>
			<input v-model="account_id" id="account_id" type="text" required />
		</div>

		<div>
			<label for="title">title:</label>
			<input v-model="title" id="title" type="text" required />
		</div>

		<div>
			<label for="description">description:</label>
			<textarea v-model="description" id="description" type="text"></textarea>
		</div>

		<div>
			Type:
			<select v-model="type">
				<option value="income">income</option>
				<option value="transfer">transfer</option>
				<option value="expense">expense</option>
			</select>
		</div>

		<div>
			<label for="price">price:</label>
			<input v-model="price" id="price" type="number" step="0.01" />
		</div>
		<br />
		<button type="submit" :disabled="loading">
			{{ loading ? 'Creating...' : 'Create new Transaction' }}
		</button>
		<br />
	</form>
	<p>{{ error }}</p>
</template>
<script setup lang="ts">
import type { ApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';

// Form state
const owner_id = ref('');
const account_id = ref('');
const title = ref('');
const description = ref('');
const type = ref('income');
const price = ref(0);

// Local state
const error = ref('');
const loading = ref(false);

// Callback to Parent after creation
const emit = defineEmits<{
	(event: 'created'): void;
}>();

async function submitTransaction() {
	loading.value = true;
	error.value = '';

	try {
		const response = await $fetch<ApiResponse>('/api/management/create/transaction', {
			method: 'POST',
			body: {
				owner_id: owner_id.value,
				account_id: account_id.value,
				title: title.value,
				description: description.value,
				type: type.value,
				price: price.value,
			},
		});

		if (response.state === 'success') {
			// Reset form
			owner_id.value = '';
			account_id.value = '';
			title.value = '';
			description.value = '';
			type.value = 'income';
			price.value = 0;

			// Emit event to parent
			emit('created');
		} else {
			error.value = response.message || ERRORS.GENERAL.ERROR;
		}
	} catch {
		error.value = ERRORS.GENERAL.ERROR;
	} finally {
		loading.value = false;
	}
}
</script>
