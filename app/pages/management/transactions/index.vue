<template>
	<DeleteAllTransactionsForm />
	<CreateNewTransactionForm />

	<form @submit.prevent="DeleteSelectedTransactions(SelectedTransactions)">
		<button type="submit">Delete Selected Transactions</button>
	</form>

	<p>Total Transactions: {{ TotalTransactions }}</p>
	<p>Selected Transactions: {{ SelectedTransactions.length }}</p>

	<ul
		v-for="transaction in transactions"
		:key="transaction.id"
		class="ItemList"
		:class="{ selected: SelectedTransactions.includes(transaction.id) }"
	>
		<li>
			<input type="checkbox" :value="transaction.id" v-model="SelectedTransactions" />
		</li>

		<li>ID: <input type="text" :value="transaction.id" disabled /></li>

		<li>Owner ID: <input type="text" v-model="transaction.owner_id" /></li>

		<li>Account ID: <input type="text" v-model="transaction.account_id" /></li>

		<li>Title: <input type="text" v-model="transaction.title" /></li>

		<li v-if="transaction.description">
			Description: <input type="text" v-model="transaction.description" />
		</li>

		<li>
			Type:
			<select v-model="transaction.type">
				<option value="income">income</option>
				<option value="transfer">transfer</option>
				<option value="expense">expense</option>
			</select>
		</li>

		<li>
			Price:
			<input v-model="transaction.price" type="number" step="0.01" />
		</li>

		<li>
			Created at:
			{{
				new Date(transaction.created_at).toLocaleString('en-UK', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				})
			}}
		</li>
		<li>
			<button @click="UpdateTransaction(transaction)">Update Transaction</button>
		</li>
		<li>
			<button @click="DeleteTransaction(transaction.id)" class="management__delete-button">
				Delete Transaction
			</button>
		</li>
	</ul>
	<ul>
		<li>
			<button @click="PreviousPage" :disabled="page === 1">Previous Page</button>
		</li>
		<li>
			<button @click="NextPage" :disabled="page === lastPage">Next Page</button>
		</li>
		<li>
			<input type="number" v-model.number="pageInput" :min="1" :max="lastPage" />
			<button @click="GoToPage">Go</button>
		</li>
		<li>Last Page: {{ lastPage }}</li>
	</ul>
</template>
<style src="@/assets/management/index.scss" lang="scss"></style>
<script setup lang="ts">
// COMPOSABLES
import { useFetchPagenizedTransactions } from '@/composables/Transactions/useFetchPagenizedTransactions';
import { useDeleteTransaction } from '~/composables/Transactions/delete/useDeleteTransaction';
import { useUpdateTransaction } from '@/composables/Transactions/useUpdateTransaction';
import { useDeleteSelectedTransactions } from '~/composables/Transactions/delete/useDeleteSelectedTransactions';

// COMPONENTS
import CreateNewTransactionForm from '@/components/management/transactions/CreateNewTransactionForm.vue';
import DeleteAllTransactionsForm from '@/components/management/transactions/DeleteAllTransactionsForm.vue';

const {
	transactions,
	TotalTransactions,
	lastPage,
	error: fetchError,
	page,
	FetchPagenizedTransactions,
} = useFetchPagenizedTransactions();

const { error: deleteTransactionError, DeleteTransaction } = useDeleteTransaction();

const { error: updateTransactionError, UpdateTransaction } = useUpdateTransaction();

const {
	error: deleteSelectedTransactions,
	SelectedTransactions,
	DeleteSelectedTransactions,
} = useDeleteSelectedTransactions();

const pageInput = ref(1);

onMounted(() => FetchPagenizedTransactions());

async function NextPage() {
	if (page.value < lastPage.value) {
		page.value++;
		pageInput.value = page.value;
		await FetchPagenizedTransactions();
	}
}

async function PreviousPage() {
	if (page.value > 1) {
		page.value--;
		pageInput.value = page.value;
		await FetchPagenizedTransactions();
	}
}

async function GoToPage() {
	if (pageInput.value < 1) return;
	if (pageInput.value > lastPage.value) return;

	page.value = pageInput.value;
	await FetchPagenizedTransactions();
}
</script>
<style scoped src="@/assets/management/index.scss" lang="scss"></style>
