<template>
	<form @submit.prevent="create()">
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

import { useCreateNewTransaction } from '@/composables/Transactions/useCreateNewTransaction';

const owner_id = ref('');
const account_id = ref('');
const title = ref('');
const description = ref('');
const type = ref('');
const price = ref(0);

const { error, loading, CreateNewTransaction } = useCreateNewTransaction();

function create() {
	CreateNewTransaction({
		owner_id: owner_id.value,
		account_id: account_id.value,
		title: title.value,
		description: description.value,
		type: type.value,
		price: price.value,
	});
}
</script>
