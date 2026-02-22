<template>
	<h2 class="management__page-title">Account Management</h2>

	<div class="management__page-header">
		<button @click="showModal = true" class="management__button">Create Account</button>
		<div class="management__delete-group">
			<form
				@submit.prevent="AccountStore.DeleteManyAccounts(AccountStore.selectedAccounts)"
			>
				<button type="submit" class="management__delete-button management__button">
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

	<div class="EntityList">
		<div class="EntityList__grid">
			<div class="EntityList__row">
				<div class="EntityList__header"><b>Select</b></div>
				<div class="EntityList__header"><b>ID</b></div>
				<div class="EntityList__header"><b>Owner ID</b></div>
				<div class="EntityList__header"><b>Title</b></div>
				<div class="EntityList__header"><b>Description</b></div>
				<div class="EntityList__header"><b>Created At</b></div>
				<div class="EntityList__header"><b>Actions</b></div>
			</div>

			<div
				v-for="account in AccountStore.accounts"
				:key="account.id"
				class="EntityList__row"
				:class="{ selected: AccountStore.selectedAccounts.includes(account.id) }"
			>
				<div class="EntityList__list-item EntityList__list-checkbox-item">
					<input
						type="checkbox"
						:value="account.id"
						v-model="AccountStore.selectedAccounts"
					/>
				</div>
				<div class="EntityList__list-item">
					<input type="text" :value="account.id" disabled />
				</div>
				<div class="EntityList__list-item">
					<input type="text" v-model="account.owner_id" />
				</div>
				<div class="EntityList__list-item">
					<input type="text" v-model="account.title" />
				</div>
				<div class="EntityList__list-item">
					<textarea v-model="account.description"></textarea>
				</div>
				<div class="EntityList__list-item EntityList__list-date-item">
					{{
						new Date(account.created_at).toLocaleString('en-UK', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
						})
					}}
				</div>
				<!-- Actions -->
				<div class="EntityList__actions EntityList__list-item">
					<button
						@click="AccountStore.UpdateAccount(account.id, account)"
						class="management__button management__update-button"
					>
						Update
					</button>
					<button
						@click="AccountStore.DeleteAccount(account.id)"
						class="management__button management__delete-button"
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	</div>
	<nav class="management__page-control">
		<div>
			<button @click="PreviousPage" :disabled="page === 1" class="management__button">
				Previous Page
			</button>
		</div>
		<p class="management__page-control__current-page">{{ page }}</p>
		<div>
			<button
				@click="NextPage"
				:disabled="page === AccountStore.lastPage"
				class="management__button"
			>
				Next Page
			</button>
		</div>
	</nav>
	<CreateNewAccountForm v-model:show="showModal" />
</template>

<style src="@/assets/management/index.scss" lang="scss"></style>
<script setup lang="ts">
// COMPONENTS
import DeleteAllAccountsForm from '@/components/management/accounts/DeleteAllAccountsForm.vue';
import CreateNewAccountForm from '@/components/management/accounts/CreateNewAccountForm.vue';

import { useAccountStore } from '@/stores/accounts';

let page = 1;

const AccountStore = useAccountStore();
const UserStore = useUserStore();

const showModal = ref(false);

async function NextPage() {
	if (page < AccountStore.lastPage) {
		page++;
		await AccountStore.fetchPagenizedAccounts(page, 10);
	}
}

async function PreviousPage() {
	if (page > 1) {
		page--;
		await AccountStore.fetchPagenizedAccounts(page, 10);
	}
}

onMounted(async () => {
	AccountStore.fetchPagenizedAccounts(1, 10);
});
</script>
