import { defineStore } from 'pinia';
import { useTransactionsAPI } from '~/composables/API/useTransactionsAPI';
import type { Transaction } from '~/types/Transaction';
import type {
	CreateTransactionPayload,
	UpdateTransactionPayload,
} from '~/types/payloads/transaction';

const {
	transactions,
	totalTransactions,
	lastPage,
	loading,
	error,
	fetchAll,
	fetchPagenized,
	CreateTransaction,
	UpdateTransaction,
	DeleteTransaction,
	DeleteManyTransactions,
	DeleteAllTransactions,
} = useTransactionsAPI();

export const useTransactionStore = defineStore('transactions', {
	state: () => ({
		transactions: [] as Transaction[],
		selectedTransactions: [] as string[],
		totalTransactions: 0,
		lastPage: 0,
		error: null as string | null,

		loading_create: false,
		loading_fetchAll: false,
		loading_fetchPagenized: false,
		loading_deleteAll: false,
		loading_deleteMany: false,
		loading_delete: false,
		loading_update: false,
	}),
	actions: {
		async fetchAllTransactions() {
			this.error = null;
			this.loading_fetchAll = true;

			await fetchAll();

			this.transactions = transactions.value;
			this.error = error.value;
			this.loading_fetchAll = false;
		},

		async fetchPagenizedTransactions(page: number = 1, limit: number = 10) {
			this.error = null;
			this.loading_fetchPagenized = true;

			await fetchPagenized(page, limit);

			this.transactions = transactions.value;
			this.totalTransactions = totalTransactions.value;
			this.lastPage = lastPage.value;
			this.loading_fetchPagenized = false;
			this.error = error.value;
		},

		async refreshTransactions() {
			this.loading_fetchAll = true;
			this.error = null;

			await fetchAll();
			this.transactions = transactions.value;
			this.totalTransactions = totalTransactions.value;
			this.lastPage = lastPage.value;

			this.loading_fetchAll = false;
			this.error = error.value;
		},

		async CreateTransaction(payload: CreateTransactionPayload) {
			this.loading_create = true;
			this.error = null;

			await CreateTransaction(payload);
			await this.refreshTransactions();

			this.error = error.value;
			this.loading_create = false;
		},

		async UpdateTransaction(user_id: string, payload: UpdateTransactionPayload) {
			this.loading_update = true;
			this.error = null;

			await UpdateTransaction(user_id, payload);
			await this.refreshTransactions();

			this.error = error.value;
			this.loading_update = false;
		},

		async DeleteAllTransactions() {
			this.loading_deleteAll = true;
			this.error = null;

			await DeleteAllTransactions();
			await this.refreshTransactions();

			this.error = error.value;
			this.loading_deleteAll = false;
		},

		async DeleteManyTransactions(ids: string[]) {
			this.loading_deleteMany = true;
			this.error = null;

			await DeleteManyTransactions(ids);
			this.selectedTransactions = [];
			await this.refreshTransactions();

			this.error = error.value;
			this.loading_deleteMany = false;
		},

		async DeleteTransaction(id: string) {
			this.loading_delete = true;
			this.error = null;

			await DeleteTransaction(id);
			await this.refreshTransactions();

			this.error = error.value;
			this.loading_delete = false;
		},
	},
});
