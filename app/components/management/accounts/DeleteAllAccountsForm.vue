<template>
	<form @submit.prevent="DeleteAllAccounts()">
		<button
			type="submit"
			:disabled="loading"
			class="management__delete-button management__button"
		>
			{{ loading ? 'Deleting...' : 'Delete all Accounts' }}
		</button>
	</form>

	<p v-if="error" style="color: red">{{ error }}</p>
</template>
<style src="@/assets/management/index.scss" lang="scss"></style>
<script setup lang="ts">
import { useDeleteAllAccounts } from '~/composables/Accounts/delete/useDeleteAllAccounts';

const { error, loading, DeleteAllAccounts } = useDeleteAllAccounts();
</script>
