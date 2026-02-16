<template>
	<form @submit.prevent="DeleteAllTransactions()">
		<button type="submit" :disabled="loading">
			{{ loading ? 'Deleting...' : 'Delete all Transactions' }}
		</button>
		<p>{{ error }}</p>
	</form>
</template>
<script setup lang="ts">
import { useDeleteAllTransactions } from '~/composables/Transactions/useDeleteAllTransactions';

const { error, loading, DeleteAllTransactions } = useDeleteAllTransactions();
</script>
