<template>
	<DeleteAllAccountsForm />
	<CreateNewAccountForm />

	<p>Accounts Count: {{ TotalAccounts }}</p>

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
// COMPONENTS
import DeleteAllAccountsForm from '@/components/management/accounts/DeleteAllAccountsForm.vue';
import CreateNewAccountForm from '@/components/management/accounts/CreateNewAccountForm.vue';

// COMPOSABLES
import { useFetchAllAccounts } from '@/composables/Accounts/useFetchAllAccounts';
import { useUpdateAccount } from '@/composables/Accounts/useUpdateAccount';

import { ERRORS } from '#shared/utils/Errors';
import type { ApiResponse } from '@/types/API';

const error = ref('');

const {
	accounts,
	TotalAccounts,
	lastPage,
	error: fetchError,
	page,
	FetchAllAccounts,
} = useFetchAllAccounts();

const { error: UpdateError, UpdateAccount } = useUpdateAccount();

onMounted(async () => {
	FetchAllAccounts();
});

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
		FetchAllAccounts();
	}
}
</script>
