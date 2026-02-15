<template>
     <DeleteAllTransactionsForm @deleted_all="FetchAllTransactions()" />

     <CreateNewTransactionForm @created="FetchAllTransactions()" />

     <form @submit.prevent="DeleteSelectedTransactions(SelectedTransactions)">
          <button type="submit">Delete Selected Transactions</button>
     </form>

     <p>Total Transactions: {{ TotalTransactions }}</p>
     <p>Selected Transactions: {{ SelectedTransactions.length }}</p>


     <ul v-for="transaction in transactions" :key="transaction.id" style="display: flex; flex-direction: row;">
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
// COMPOSABLES
import { useFetchAllTransactions } from '@/composables/Transactions/useFetchAllTransactions'
import { useDeleteTransaction } from '@/composables/Transactions/useDeleteTransaction';
import { useUpdateTransaction } from '@/composables/Transactions/useUpdateTransaction';

// COMPONENTS
import CreateNewTransactionForm from '@/components/management/transactions/CreateNewTransactionForm.vue'
import DeleteAllTransactionsForm from '@/components/management/transactions/DeleteAllTransactionsForm.vue';

// TYPES & ERROR LIST
import type { ApiResponse } from '@/types/API';
import type { Transaction } from '@/types/Transaction';
import { ERRORS } from '#shared/utils/Errors';

const SelectedTransactions = ref([]);

// FetchAllTransactions
const {
     transactions,
     TotalTransactions,
     lastPage,
     error: fetchError,
     page,
     FetchAllTransactions
} = useFetchAllTransactions()

const {
     error: deleteTransactionError,
     DeleteTransaction
} = useDeleteTransaction()

const {
     error: updateTransactionError,
     UpdateTransaction
} = useUpdateTransaction()


const pageInput = ref(1);

onMounted(() => FetchAllTransactions());

async function NextPage() {
     if (page.value < lastPage.value) {
          page.value++;
          pageInput.value = page.value;
          await FetchAllTransactions();
     }
}

async function PreviousPage() {
     if (page.value > 1) {
          page.value--;
          pageInput.value = page.value;
          await FetchAllTransactions();
     }
}

async function GoToPage() {
     if (pageInput.value < 1) return;
     if (pageInput.value > lastPage.value) return;

     page.value = pageInput.value;
     await FetchAllTransactions();
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
          await FetchAllTransactions();
     }
}

async function DeleteSelectedTransactions(TransactionArray: any) {
     const result = await showConfirm('Are you sure you want to delete the selected Transactions?');

     if (result) {
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

}
</script>
