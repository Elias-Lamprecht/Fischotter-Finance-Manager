<template>
     <form @submit.prevent="CreateNewTransaction()">
          <br />
          <div>
               <label for="owner_id">Owner ID:</label>
               <input v-model="owner_id" id="owner_id" type="text" required />
          </div>

          <div>
               <label for="account_id">Account ID:</label>
               <input v-model="account_id" id="account_id" type="text" required />
          </div>

          <div>
               <label for="title">title:</label>
               <input v-model="title" id="title" type="text" required />
          </div>

          <div>
               <label for="description">description:</label>
               <textarea v-model="description" id="description" type="text"></textarea>
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
               <input v-model="price" id="price" type="number" step="0.01"></input>
          </div>
          <br />
          <button type="submit" :disabled="loading_new_transaction">
               {{ loading_new_transaction ? 'Creating...' : 'Create new Transaction' }}
          </button>
          <br />
     </form>

     <p v-if="error" style="color: red">{{ error }}</p>

     <form @submit.prevent="DeleteAllTransactions()">
          <button type="submit" :disabled="loading_delete_all_transactions">
               {{ loading_delete_all_transactions ? 'Deleting...' : 'Delete all Transactions' }}
          </button>
     </form>

     <form @submit.prevent="DeleteSelectedTransactions(SelectedTransactions)">
          <button type="submit">Delete Selected Transactions</button>
     </form>

     <p>Total Transactions: {{ TotalTransactions }}</p>
     <p>Selected Transactions: {{ SelectedTransactions.length }}</p>


     <ul v-for="transaction in transactions" :key="transaction.id" style="display: flex;flex-direction: row;">
          <li><input type="checkbox" :value="transaction.id" v-model="SelectedTransactions"></li>

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
               <input v-model="transaction.price" type="number" step="0.01"></input>
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
               <button @click="DeleteTransaction(transaction.id)">Delete Transaction</button>
          </li>

          <li>
               <button @click="UpdateTransaction(transaction)">Update Transaction</button>
          </li>
     </ul>
     <ul>
          <li>
               <button @click="PreviousPage" :disabled="page === 1">
                    Previous Page
               </button>
          </li>
          <li>
          <button @click="NextPage" :disabled="page === lastPage">
               Next Page
          </button>
          </li>
          <li>
               <input
                    type="number"
                    v-model.number="pageInput"
                    :min="1"
                    :max="lastPage"
               />
               <button @click="GoToPage">
                    Go
               </button>
          </li>
          <li>
               Last Page: {{ lastPage }}
          </li>
     </ul>
</template>
<script setup lang="ts">
import { ERRORS } from '~~/server/utils/errors';
import type { ApiResponse, PaginationApiResponse } from '@/types/API';
import type { Transaction } from '@/types/Transaction';

const transactions = ref<Transaction[]>([]);
const TotalTransactions = ref<number>();
const SelectedTransactions = ref([]);

const owner_id = ref('');
const account_id = ref('');
const title = ref('');
const description = ref('');
const type = ref('income');
const price = ref(0);

const page = ref(1);
const limit = 10;
const lastPage = ref(1);
const pageInput = ref(1);

const error = ref('');

const loading_new_transaction = ref(false);
const loading_delete_all_transactions = ref(false);

onMounted(async () => {
     await Promise.all([FetchAllTransactions()]);
});

async function NextPage() {
     if (page.value < lastPage.value) {
          page.value++;
          await FetchAllTransactions();
     }
}

async function PreviousPage() {
     if (page.value > 1) {
          page.value--;
          await FetchAllTransactions();
     }
}

async function GoToPage() {
     if (pageInput.value < 1) return;
     if (pageInput.value > lastPage.value) return;

     page.value = pageInput.value;
     await FetchAllTransactions();
}

async function FetchAllTransactions() {
     try {
          const response = await $fetch<PaginationApiResponse<Transaction[]>>('/api/management/get/all/transactions', {
               method: 'POST',
               body: {
                    page: page.value,
                    limit: limit
               }
          });

     if (response.state === 'success') {
          transactions.value = response.data;
          TotalTransactions.value = response.pagination.total;
          lastPage.value = response.pagination.lastPage;
     } else if (response.state === 'denied' || response.state === 'error') {
          error.value = response.message || ERRORS.GENERAL.ERROR;
     }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     }
}

async function CreateNewTransaction() {
     loading_new_transaction.value = true;
     try {
          const response = await $fetch<ApiResponse>('/api/management/create/transaction', {
               method: 'POST',
               body: {
                    account_id: account_id.value,
                    owner_id: owner_id.value,
                    title: title.value,
                    description: description.value,
                    type: type.value,
                    price: price.value,
               },
          });

          if (response.state === 'success') {
               title.value = '';
               description.value = '';
               type.value = '';
               price.value = 0;
          } else {
               error.value = response.message || ERRORS.GENERAL.ERROR;
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     } finally {
          loading_new_transaction.value = false;
          await Promise.all([FetchAllTransactions()]);
     }
}

async function UpdateTransaction(transaction: Transaction) {
     try {
          const response = await $fetch<ApiResponse>('/api/management/modify/transaction', {
               method: 'POST',
               body: {
                    id: transaction.id,
                    account_id: transaction.account_id,
                    owner_id: transaction.owner_id,
                    title: transaction.title,
                    description: transaction.description,
                    type: transaction.type,
                    price: transaction.price,
               },
          });

          if (response.state !== 'success') {
               error.value = response.message || ERRORS.GENERAL.ERROR;
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     } finally {
          await FetchAllTransactions();
     }
}

async function DeleteTransaction(id: string) {
     try {
          const response = await $fetch<ApiResponse>('/api/management/delete/by-id/transaction', {
               method: 'DELETE',
               body: {
                    id: id,
               },
          });

          if (response.state !== 'success') {
               error.value = response.message || ERRORS.GENERAL.ERROR;
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     } finally {
          await Promise.all([FetchAllTransactions()]);
     }
}

async function DeleteAllTransactions() {
     loading_delete_all_transactions.value = true;
     error.value = '';

          try {
          const response = await $fetch<ApiResponse>('/api/management/delete/all/transactions', {
               method: 'DELETE',
          });

          if (response.state !== 'success') {
               error.value = response.message || ERRORS.GENERAL.ERROR;
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     } finally {
          await FetchAllTransactions();
     }
}

async function DeleteSelectedTransactions(TransactionArray: any) {
          try {
          const response = await $fetch<ApiResponse>('/api/management/delete/many/transactions', {
               method: 'DELETE',
               body: {
                    TransactionArray: TransactionArray
               },
          });

          if (response.state === 'success') {
               SelectedTransactions.value.length = 0;
          } else {
               error.value = response.message || ERRORS.GENERAL.ERROR;
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     } finally {
          await FetchAllTransactions();
     }
}
</script>
