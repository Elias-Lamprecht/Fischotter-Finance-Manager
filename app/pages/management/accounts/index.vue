<template>
	<DeleteAllAccountsForm />
	<CreateNewAccountForm />

	<form @submit.prevent="DeleteSelectedAccounts(SelectedAccounts)">
		<button type="submit">Delete Selected Accounts</button>
	</form>

	<p>Total Accounts: {{ TotalAccounts }}</p>
	<p>Selected Accounts: {{ SelectedAccounts.length }}</p>

	<ul v-for="account in accounts" :key="account.id" style="display: flex; flex-direction: row">
		<li><input type="checkbox" :value="account.id" v-model="SelectedAccounts" /></li>

		<li>ID: <input type="text" :value="account.id" disabled /></li>

		<li>Owner ID: <input type="text" v-model="account.owner_id" /></li>

		<li>Title: <input type="text" v-model="account.title" /></li>

		<li v-if="account.description">
			Description: <input type="text" v-model="account.description" />
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
			<button @click="DeleteAccount(account.id)">Delete Account</button>
		</li>
		<li>
			<button @click="UpdateAccount(account)">Update Account</button>
		</li>

		<br />
	</ul>
</template>
<script setup lang="ts">
// COMPONENTS
import DeleteAllAccountsForm from '@/components/management/accounts/DeleteAllAccountsForm.vue';
import CreateNewAccountForm from '@/components/management/accounts/CreateNewAccountForm.vue';

// COMPOSABLES
import { useFetchAllAccounts } from '@/composables/Accounts/useFetchAllAccounts';
import { useUpdateAccount } from '@/composables/Accounts/useUpdateAccount';
import { useDeleteAccount } from '~/composables/Accounts/useDeleteAccount';
import { useDeleteSelectedAccounts } from '~/composables/Accounts/useDeleteSelectedAccounts';

const {
	accounts,
	TotalAccounts,
	lastPage,
	error: fetchError,
	page,
	FetchAllAccounts,
} = useFetchAllAccounts();

const {
	error: deleteSelectedError,
	SelectedAccounts,
	DeleteSelectedAccounts,
} = useDeleteSelectedAccounts();

const { error: DeleteError, DeleteAccount } = useDeleteAccount();

const { error: UpdateError, UpdateAccount } = useUpdateAccount();

onMounted(async () => {
	FetchAllAccounts();
});
</script>
