<template>
	<DeleteAllAccountsForm />

	<form @submit.prevent="CreateNewAccount()">
		<br />
		<div>
			<label for="owner_id">Owner ID:</label>
			<input v-model="owner_id" id="owner_id" type="text" required />
		</div>

		<div>
			<label for="title">title:</label>
			<input v-model="title" id="title" type="text" required />
		</div>

		<div>
			<label for="description">description:</label>
			<textarea v-model="description" id="description" type="text"></textarea>
		</div>
		<br />
		<button type="submit" :disabled="loading_new_account">
			{{ loading_new_account ? 'Creating...' : 'Create new Account' }}
		</button>
		<br />
	</form>

	<p v-if="error" style="color: red">{{ error }}</p>

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

import { ERRORS } from '#shared/utils/Errors';
import type { Account } from '@/types/Account';
import type { ApiResponse } from '@/types/API';

const accounts = ref<Account[]>([]);
const AccountsCount = ref<number>(0);

const owner_id = ref('');
const title = ref('');
const description = ref('');

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

async function CreateNewAccount() {
	loading_new_account.value = true;
	error.value = '';

	try {
		const response = await $fetch<ApiResponse>('/api/management/create/account', {
			method: 'POST',
			body: {
				owner_id: owner_id.value,
				title: title.value,
				description: description.value,
			},
		});

		if (response.state === 'success') {
			owner_id.value = '';
			title.value = '';
			description.value = '';
		} else {
			error.value = response.message || ERRORS.GENERAL.ERROR;
		}
	} catch (err) {
		error.value = ERRORS.GENERAL.ERROR;
	} finally {
		loading_new_account.value = false;
		await Promise.all([FetchAllAccounts(), FetchAccountCount()]);
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
