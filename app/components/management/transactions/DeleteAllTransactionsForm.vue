<template>
	<form @submit.prevent="TransactionStore.DeleteAllTransactions()">
		<button
			type="submit"
			:disabled="TransactionStore.loading_deleteAll"
			class="management__delete-button management__button"
		>
			{{ TransactionStore.loading_deleteAll ? 'Deleting...' : 'Delete all Transactions' }}
		</button>
	</form>

	<p v-if="TransactionStore.error" style="color: red">{{ TransactionStore.error }}</p>
</template>
<style src="@/assets/management/index.scss" lang="scss"></style>
<script setup lang="ts">
import { useTransactionStore } from '@/stores/transactions';
const TransactionStore = useTransactionStore();
</script>
