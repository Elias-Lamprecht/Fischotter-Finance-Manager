<template>
     <form @submit.prevent="DeleteAllTransactions()">
          <button type="submit" :disabled="loading_delete_all_transactions">
               {{ loading_delete_all_transactions ? 'Deleting...' : 'Delete all Transactions' }}
          </button>
     </form>

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

     <p>Transactions Count: {{ TransactionsCount }}</p>

     <ul v-for="transaction in transactions" :key="transaction.id">
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
</template>
<script setup lang="ts">
import { ERRORS } from '~~/server/utils/errors';
import type { ApiResponse } from '@/types/API';
import type { Transaction } from '@/types/Transaction';

const transactions = ref<Transaction[]>([]);
const TransactionsCount = ref<number>();

const owner_id = ref('');
const account_id = ref('');
const title = ref('');
const description = ref('');
const type = ref('income');
const price = ref(0);

const error = ref('');

const loading_new_transaction = ref(false);
const loading_delete_all_transactions = ref(false);

onMounted(async () => {
     await Promise.all([FetchAllTransactions(), FetchTransactionCount()]);
});

async function FetchAllTransactions() {
     try {
          const response = await $fetch<ApiResponse<Transaction[]>>('/api/management/get/all/transactions', {
               method: 'GET',
          });

          if (response.state === 'success') {
               transactions.value = response.data || [];
          } else {
               error.value = response.message || ERRORS.GENERAL.ERROR;
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     }
}

async function FetchTransactionCount() {
     try {
          const response = await $fetch<ApiResponse<number>>('/api/statistics/management/count/all/transactions', {
               method: 'GET',
          });

          if (response.state === 'success') {
               TransactionsCount.value = response.data || 0;
          } else {
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
          await Promise.all([FetchAllTransactions(), FetchTransactionCount()]);
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
          await Promise.all([FetchAllTransactions(), FetchTransactionCount()]);
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
          loading_delete_all_transactions.value = false;
          await Promise.all([FetchAllTransactions(), FetchTransactionCount()]);
     }
}

</script>
