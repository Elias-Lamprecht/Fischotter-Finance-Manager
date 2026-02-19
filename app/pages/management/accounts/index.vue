<template>
	<h2>Account Management</h2>

	<div class="management__page-header">
		<button @click="showModal = true" class="management__button">Create Account</button>
		<div class="management__delete-group">
			<form @submit.prevent="DeleteSelectedAccounts(SelectedAccounts)">
				<button type="submit" class="management__delete-button management__button">
					Delete Selected Accounts
				</button>
			</form>
			<DeleteAllAccountsForm />
		</div>
	</div>
	<br />
	<p>Total Accounts: {{ TotalAccounts }}</p>
	<p>Selected Accounts: {{ SelectedAccounts.length }}</p>

	<ul v-for="account in accounts" :key="account.id" style="display: flex; flex-direction: row">
		<li><input type="checkbox" :value="account.id" v-model="SelectedAccounts" /></li>

		<li>ID: <input type="text" :value="account.id" disabled /></li>

		<li>Owner ID: <input type="text" v-model="account.owner_id" /></li>

		<li>Title: <input type="text" v-model="account.title" /></li>

		<li v-if="account.description">
			Description: <textarea type="text" v-model="account.description"></textarea>
		</li>

		<li>
			Created at:
			{{
				new Date(account.created_at).toLocaleString('en-UK', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				})
			}}
		</li>

		<li>
			<button
				@click="UpdateAccount(account)"
				class="management__button management__update-button"
			>
				Update Account
			</button>
		</li>
		<li>
			<button
				@click="DeleteAccount(account.id)"
				class="management__button management__delete-button"
			>
				Delete Account
			</button>
		</li>
		<br />
	</ul>
	<CreateNewAccountForm v-model:show="showModal" />
</template>
<style src="@/assets/management/index.scss" lang="scss"></style>
<script setup lang="ts">
// COMPONENTS
import DeleteAllAccountsForm from '@/components/management/accounts/DeleteAllAccountsForm.vue';
import CreateNewAccountForm from '@/components/management/accounts/CreateNewAccountForm.vue';

// COMPOSABLES
import { useFetchPagenizedAccounts } from '@/composables/Accounts/useFetchPagenizedAccounts';
import { useUpdateAccount } from '@/composables/Accounts/useUpdateAccount';
import { useDeleteAccount } from '~/composables/Accounts/delete/useDeleteAccount';
import { useDeleteSelectedAccounts } from '~/composables/Accounts/delete/useDeleteSelectedAccounts';

const showModal = ref(false);

const {
	accounts,
	TotalAccounts,
	lastPage,
	error: fetchError,
	page,
	FetchPagenizedAccounts,
} = useFetchPagenizedAccounts();

const {
	error: deleteSelectedError,
	SelectedAccounts,
	DeleteSelectedAccounts,
} = useDeleteSelectedAccounts();

const { error: DeleteError, DeleteAccount } = useDeleteAccount();

const { error: UpdateError, UpdateAccount } = useUpdateAccount();

onMounted(async () => {
	FetchPagenizedAccounts();
});
</script>
