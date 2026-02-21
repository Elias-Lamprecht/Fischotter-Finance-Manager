<template>
	<form @submit.prevent="DeleteAllTransactions()">
		<button
			type="submit"
			:disabled="loading"
			class="management__delete-button management__button"
		>
			{{ loading ? 'Deleting...' : 'Delete all Transactions' }}
		</button>
	</form>

	<p v-if="error" style="color: red">{{ error }}</p>
</template>
<style src="@/assets/management/index.scss" lang="scss"></style>
<script setup lang="ts">
import { useDeleteAllTransactions } from '~/composables/Transactions/delete/useDeleteAllTransactions';

const { error, loading, DeleteAllTransactions } = useDeleteAllTransactions();
</script>
