<template>
	<DeleteAllAccountsForm />
	<CreateNewAccountForm />

	<p>Accounts Count: {{ AccountsCount }}</p>

	<ul v-for="account in accounts" :key="account.id">
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
import DeleteAllAccountsForm from '@/components/management/accounts/DeleteAllAccountsForm.vue';
import CreateNewAccountForm from '@/components/management/accounts/CreateNewAccountForm.vue';

import { ERRORS } from '#shared/utils/Errors';
import type { Account } from '@/types/Account';
import type { ApiResponse } from '@/types/API';

const accounts = ref<Account[]>([]);
const AccountsCount = ref<number>(0);

const error = ref('');

const loading_new_account = ref(false);
const loading_delete_all_accounts = ref(false);

onMounted(async () => {
	await Promise.all([FetchAllAccounts(), FetchAccountCount()]);
});

async function FetchAllAccounts() {
	try {
		const response = await $fetch<ApiResponse<Account[]>>(
			'/api/management/get/all/accounts',
			{
				method: 'GET',
			},
		);

		if (response.state === 'success') {
			accounts.value = response.data || [];
		} else {
			error.value = response.message || ERRORS.GENERAL.ERROR;
		}
	} catch (err) {
		error.value = ERRORS.GENERAL.ERROR;
	}
}

async function FetchAccountCount() {
	try {
		const response = await $fetch<ApiResponse<number>>(
			'/api/statistics/management/count/all/accounts',
			{
				method: 'GET',
			},
		);

		if (response.state == 'success') {
			AccountsCount.value = response.data || 0;
		} else {
			error.value = response.message || ERRORS.GENERAL.ERROR;
		}
	} catch (err) {
		error.value = ERRORS.GENERAL.ERROR;
	}
}

async function UpdateAccount(account: Account) {
	try {
		const response = await $fetch<ApiResponse>('/api/management/modify/account', {
			method: 'POST',
			body: {
				id: account.id,
				owner_id: account.owner_id,
				title: account.title,
				description: account.description,
			},
		});

		if (response.state !== 'success') {
			error.value = response.message || ERRORS.GENERAL.ERROR;
		}
	} catch (err) {
		error.value = ERRORS.GENERAL.ERROR;
	} finally {
		await FetchAllAccounts();
	}
}

async function DeleteAccount(id: string) {
	try {
		const response = await $fetch<ApiResponse>('/api/management/delete/by-id/account', {
			method: 'DELETE',
			body: { id: id },
		});

		if (response.state !== 'success') {
			error.value = response.message || ERRORS.GENERAL.ERROR;
		}
	} catch (err) {
		error.value = ERRORS.GENERAL.ERROR;
	} finally {
		await Promise.all([FetchAllAccounts(), FetchAccountCount()]);
	}
}
</script>
