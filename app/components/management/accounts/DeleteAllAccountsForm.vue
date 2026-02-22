<template>
	<form @submit.prevent="AccountStore.DeleteAllAccounts()">
		<button
			type="submit"
			:disabled="AccountStore.loading_deleteAll"
			class="management__delete-button management__button"
		>
			{{ AccountStore.loading_deleteAll ? 'Deleting...' : 'Delete all Accounts' }}
		</button>
	</form>

	<p v-if="AccountStore.error" style="color: red">{{ AccountStore.error }}</p>
</template>
<style src="@/assets/management/index.scss" lang="scss"></style>
<script setup lang="ts">
import { useAccountStore } from '@/stores/accounts';

const AccountStore = useAccountStore();
</script>
