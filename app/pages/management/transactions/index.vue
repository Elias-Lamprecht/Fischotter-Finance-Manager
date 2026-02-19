<template>
	<h2 class="management__page-title">Transaction Management</h2>

	<div class="management__page-header">
		<button @click="showModal = true" class="management__button">Create Transaction</button>
		<div class="management__delete-group">
			<form @submit.prevent="DeleteSelectedTransactions(SelectedTransactions)">
				<button type="submit" class="management__delete-button management__button">
					Delete Selected Transactions
				</button>
			</form>
			<DeleteAllTransactionsForm />
		</div>
	</div>

	<div class="management__count-page-wrapper">
		<div class="management__count-wrapper">
			<p>Total Transactions: {{ TotalTransactions }}</p>
			<p>Selected Transactions: {{ SelectedTransactions.length }}</p>
		</div>
	</div>

	<div class="EntityList">
		<div class="EntityList__grid">
			<div class="EntityList__row EntityList__row--transaction">
				<div class="EntityList__header"><b>Select</b></div>
				<div class="EntityList__header"><b>ID</b></div>
				<div class="EntityList__header"><b>Owner ID</b></div>
				<div class="EntityList__header"><b>Account ID</b></div>
				<div class="EntityList__header"><b>Title</b></div>
				<div class="EntityList__header"><b>Description</b></div>
				<div class="EntityList__header"><b>Type</b></div>
				<div class="EntityList__header"><b>Price</b></div>
				<div class="EntityList__header"><b>Day</b></div>
				<div class="EntityList__header"><b>Month</b></div>
				<div class="EntityList__header"><b>Year</b></div>
				<div class="EntityList__header"><b>Created At</b></div>
				<div class="EntityList__header"><b>Actions</b></div>
			</div>
			<div
				v-for="transaction in transactions"
				:key="transaction.id"
				class="EntityList__row EntityList__row--transaction"
				:class="{ selected: SelectedTransactions.includes(transaction.id) }"
			>
				<div>
					<input
						type="checkbox"
						:value="transaction.id"
						v-model="SelectedTransactions"
					/>
				</div>
				<div><input type="text" :value="transaction.id" disabled /></div>
				<div><input type="text" v-model="transaction.owner_id" /></div>
				<div><input type="text" v-model="transaction.account_id" /></div>
				<div><input type="text" v-model="transaction.title" /></div>
				<div>
					<input type="text" v-model="transaction.description" />
				</div>
				<div>
					<select v-model="transaction.type">
						<option value="income">income</option>
						<option value="transfer">transfer</option>
						<option value="expense">expense</option>
					</select>
				</div>
				<div>
					<input v-model="transaction.price" type="number" step="0.01" />
				</div>
				<div>
					<input type="number" step="1" min="1" v-model="transaction.day" />
				</div>
				<div>
					<input type="number" step="1" min="1" v-model="transaction.month" />
				</div>
				<div>
					<input type="number" step="1" min="2025" v-model="transaction.year" />
				</div>
				<div>
					{{
						new Date(transaction.created_at).toLocaleString('en-UK', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
						})
					}}
				</div>
				<li>
					<button
						@click="UpdateTransaction(transaction)"
						class="management__button management__update-button"
					>
						Update Transaction
					</button>
				</li>
				<li>
					<button
						@click="DeleteTransaction(transaction.id)"
						class="management__button management__delete-button"
					>
						Delete Transaction
					</button>
				</li>
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
			<button @click="NextPage" :disabled="page === lastPage" class="management__button">
				Next Page
			</button>
		</div>
	</nav>
	<CreateNewTransactionForm v-model:show="showModal" />
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

const showModal = ref(false);

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
