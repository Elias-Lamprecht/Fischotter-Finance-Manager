<template>
	<h2 class="management__page-title">Transaction Management</h2>

	<div class="management__page-header">
		<button @click="showModal = true" class="management__button">Create Transaction</button>
		<div class="management__delete-group">
			<form
				@submit.prevent="
					TransactionStore.DeleteManyTransactions(
						TransactionStore.selectedTransactions,
					)
				"
			>
				<button type="submit" class="management__delete-button management__button">
					Delete Selected Transactions
				</button>
			</form>
			<DeleteAllTransactionsForm />
		</div>
	</div>

	<div class="management__count-page-wrapper">
		<div class="management__count-wrapper">
			<p>Total Transactions: {{ TransactionStore.totalTransactions }}</p>
			<p>Selected Transactions: {{ TransactionStore.selectedTransactions.length }}</p>
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
				<div class="EntityList__header EntityList__day-month-year">
					<b>Day</b> <b>Month</b> <b>Year</b>
				</div>
				<div class="EntityList__header"><b>Created At</b></div>
				<div class="EntityList__header"><b>Actions</b></div>
			</div>
			<div
				v-for="transaction in TransactionStore.transactions"
				:key="transaction.id"
				class="EntityList__row EntityList__row--transaction"
				:class="{
					selected: TransactionStore.selectedTransactions.includes(transaction.id),
				}"
			>
				<div>
					<input
						type="checkbox"
						:value="transaction.id"
						v-model="TransactionStore.selectedTransactions"
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
				<div class="EntityList__day-month-year">
					<input type="number" step="1" min="1" v-model="transaction.day" />
					<input type="number" step="1" min="1" v-model="transaction.month" />
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
				<div class="EntityList__actions">
					<button
						@click="
							TransactionStore.UpdateTransaction(transaction.id, transaction)
						"
						class="management__button management__update-button"
					>
						Update Transaction
					</button>
					<button
						@click="TransactionStore.DeleteTransaction(transaction.id)"
						class="management__button management__delete-button"
					>
						Delete Transaction
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
				:disabled="page === TransactionStore.lastPage"
				class="management__button"
			>
				Next Page
			</button>
		</div>
	</nav>
	<CreateNewTransactionForm v-model:show="showModal" />
</template>
<style src="@/assets/management/index.scss" lang="scss"></style>
<script setup lang="ts">
// COMPONENTS
import CreateNewTransactionForm from '@/components/management/transactions/CreateNewTransactionForm.vue';
import DeleteAllTransactionsForm from '@/components/management/transactions/DeleteAllTransactionsForm.vue';

const showModal = ref(false);

import { useTransactionStore } from '@/stores/transactions';
const TransactionStore = useTransactionStore();

const pageInput = ref(1);
let page = 1;

onMounted(() => TransactionStore.fetchPagenizedTransactions());

async function NextPage() {
	if (page < TransactionStore.lastPage) {
		page++;
		pageInput.value = page;
		await TransactionStore.fetchPagenizedTransactions(page, 10);
	}
}

async function PreviousPage() {
	if (page > 1) {
		page--;
		pageInput.value = page;
		await TransactionStore.fetchPagenizedTransactions(page, 10);
	}
}
</script>
<style scoped src="@/assets/management/index.scss" lang="scss"></style>
