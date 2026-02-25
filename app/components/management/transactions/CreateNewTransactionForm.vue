<script setup lang="ts">
const owner_id = ref('');
const account_id = ref('');
const title = ref('');
const description = ref('');
const type = ref('');
const price = ref(0);
const day = ref(1);
const month = ref(1);
const year = ref(1);

import { useTransactionStore } from '@/stores/transactions';
import { useUserStore } from '@/stores/users';
import { useAccountStore } from '@/stores/accounts';

const TransactionStore = useTransactionStore();
const AccountStore = useAccountStore();
const UserStore = useUserStore();

onMounted(async () => {
	AccountStore.fetchAllAccounts();
	UserStore.fetchAllUsers();
});

function create() {
	TransactionStore.CreateTransaction({
		owner_id: owner_id.value,
		account_id: account_id.value,
		title: title.value,
		description: description.value,
		type: type.value,
		price: price.value,
		day: day.value,
		month: month.value,
		year: year.value,
	});
}

const props = defineProps({
	show: Boolean,
});
const emit = defineEmits(['update:show']);

function closeModal() {
	emit('update:show', false);
}
</script>

<template>
	<ClientOnly>
		<Teleport to="body">
			<div v-if="show" class="overlay" @click.self="closeModal">
				<form @submit.prevent="create()" class="modal">
					<h2>Create New Transaction</h2>
					<br />
					<div>
						<label for="owner_id">Owner ID:</label>
						<select id="owner_id" v-model="owner_id">
							<option
								v-for="user in UserStore.users"
								:value="user.id"
								:key="user.id"
							>
								{{ user.username }}
							</option>
						</select>
					</div>
					<div>
						<label for="account_id">Account ID:</label>
						<select id="account_id" v-model="account_id">
							<option
								v-for="account in AccountStore.accounts"
								:value="account.id"
								:key="account.id"
							>
								{{ account.title }}
							</option>
						</select>
					</div>
					<div>
						<label for="title">title:</label>
						<input v-model="title" id="title" type="text" required />
					</div>
					<div>
						<label for="description">description:</label>
						<textarea
							v-model="description"
							id="description"
							type="text"
						></textarea>
					</div>
					<div>
						Type:
						<select v-model="type">
							<option value="income">income</option>
							<option value="transfer">transfer</option>
							<option value="expense">expense</option>
						</select>
					</div>
					<div>
						<label for="price">price:</label>
						<input v-model="price" id="price" type="number" step="0.01" />
					</div>
					<li>
						Day:
						<input type="number" step="1" min="1" />
					</li>
					<li>
						Month:
						<input type="number" step="1" min="1" />
					</li>
					<li>
						Year:
						<input type="number" step="1" min="2025" />
					</li>
					<br />
					<button type="submit" :disabled="TransactionStore.loading_create">
						{{
							TransactionStore.loading_create
								? 'Creating...'
								: 'Create new Transaction'
						}}
					</button>
					<br />
				</form>
			</div>
		</Teleport>
	</ClientOnly>
	<p>{{ TransactionStore.error }}</p>
</template>
