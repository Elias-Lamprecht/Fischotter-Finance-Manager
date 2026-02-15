<template>
	<form @submit.prevent="DeleteAllTransactions()">
		<button type="submit" :disabled="loading">
			{{ loading ? 'Deleting...' : 'Delete all Transactions' }}
		</button>
	</form>
</template>
<script setup lang="ts">
import { useConfirm } from '@/composables/useConfirm';
import type { ApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';

// Local state
const error = ref('');
const loading = ref(false);

// Confirm Modal
const { showConfirm } = useConfirm();

// Callback to Parent after deletion
const emit = defineEmits<{
	(event: 'deleted_all'): void;
}>();

async function DeleteAllTransactions() {
	loading.value = true;
	error.value = '';

	const result = await showConfirm('Are you sure you want to delete all Transactions?');

	if (result) {
		try {
			const response = await $fetch<ApiResponse>(
				'/api/management/delete/all/transactions',
				{
					method: 'DELETE',
				},
			);

			if (response.state !== 'success') {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			emit('deleted_all');
			loading.value = false;
		}
	} else {
		loading.value = false;
	}
}
</script>
