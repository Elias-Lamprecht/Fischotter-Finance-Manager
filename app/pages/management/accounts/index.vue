<template>
	<div class="management">
		<h2 class="management__page-title">Account Management</h2>
		<div class="management__page-header">
			<button
				@click="showModal = true"
				class="management__button"
			>
				Create Account
			</button>
			<div class="management__delete-group">
				<form
					@submit.prevent="
						AccountStore.DeleteManyAccounts(AccountStore.selectedAccounts)
					"
				>
					<button
						type="submit"
						class="management__delete-button management__button"
					>
						Delete Selected Accounts
					</button>
				</form>
				<DeleteAllAccountsForm />
			</div>
		</div>
		<div class="management__count-page-wrapper">
			<div class="management__count-wrapper">
				<p>Total Accounts: {{ AccountStore.totalAccounts }}</p>
				<p>Selected Accounts: {{ AccountStore.selectedAccounts.length }}</p>
			</div>
		</div>

		<EntityList />

		<PageControl />
		<CreateNewAccountForm v-model:show="showModal" />
	</div>
</template>
<style src="@/assets/management/index.scss" lang="scss"></style>
<script setup lang="ts">
	// COMPONENTS
	import DeleteAllAccountsForm from '@/components/management/accounts/DeleteAllAccountsForm.vue';
	import CreateNewAccountForm from '@/components/management/accounts/CreateNewAccountForm.vue';

	import EntityList from '@/components/management/accounts/EntityList.vue';
	import PageControl from '@/components/management/accounts/PageControl.vue';

	import { useAccountStore } from '@/stores/accounts';
	import { useUserStore } from '@/stores/users';

	const AccountStore = useAccountStore();
	const UserStore = useUserStore();

	const showModal = ref(false);

	onMounted(async () => {
		AccountStore.fetchPagenizedAccounts(1, 10);
		UserStore.fetchAllUsers();
	});
</script>
