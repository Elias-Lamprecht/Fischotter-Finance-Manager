<template>
	<form @submit.prevent="DeleteAllAccounts()">
		<button type="submit" :disabled="loading">
			{{ loading ? 'Deleting...' : 'Delete all Accounts' }}
		</button>
	</form>

	<p v-if="error" style="color: red">{{ error }}</p>
</template>
<script setup lang="ts">
import { useDeleteAllAccounts } from '@/composables/Accounts/useDeleteAllAccounts';

const { error, loading, DeleteAllAccounts } = useDeleteAllAccounts();
</script>
