<template>
     <form @submit.prevent="DeleteAllAccounts()">
          <button type="submit" :disabled="loading_delete_all_accounts">
               {{ loading_delete_all_accounts ? 'Deleting...' : 'Delete all Accounts' }}
          </button>
     </form>

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
<script setup>
const owner_id = ref('751e3176-9243-4fdd-b0fc-527463562278');
const title = ref('');
const description = ref('');

const AccountsCount = ref();
const accounts = ref([]);
const error = ref('');

const loading_new_account = ref(false);
const loading_delete_all_accounts = ref(false);

onMounted(async () => {
     await Promise.all([FetchAllAccounts(), FetchAccountCount()]);
});

async function DeleteAllAccounts() {
     loading_delete_all_accounts.value = true;
     error.value = '';

     try {
          const response = await $fetch('/api/management/delete/all/accounts', {
               method: 'DELETE',
          });

          const data = response;

          if (!data.success) {
               error.value = data.message || 'Failed to delete.';
          }
     } catch (err) {
          error.value = 'Network or server error';
          console.error(err);
     } finally {
          loading_delete_all_accounts.value = false;
          await Promise.all([FetchAllAccounts(), FetchAccountCount()]);
     }
}

async function DeleteAccount(id) {
     try {
          const response = await $fetch('/api/management/delete/by-id/account', {
               method: 'DELETE',
               body: {
                    id: id,
               },
          });

          const data = response;

          if (!data.success) {
               error.value = data.message || 'Failed to create account';
          }
     } catch (err) {
          error.value = 'Network or server error';
          console.error(err);
     } finally {
          await Promise.all([FetchAllAccounts(), FetchAccountCount()]);
     }
}

async function CreateNewAccount() {
     loading_new_account.value = true;
     try {
          const response = await $fetch('/api/management/create/account', {
               method: 'POST',
               body: JSON.stringify({
                    owner_id: owner_id.value,
                    title: title.value,
                    description: description.value,
               }),
          });

          const data = response;

          if (!data.success) {
               error.value = data.message || 'Failed to create account';
          } else {
               owner_id.value = '';
               title.value = '';
               description.value = '';
          }
     } catch (err) {
          error.value = 'Network or server error';
          console.error(err);
     } finally {
          loading_new_account.value = false;
          await Promise.all([FetchAllAccounts(), FetchAccountCount()]);
     }
}

async function UpdateAccount(account) {
     try {
          const response = await $fetch('/api/management/modify/account', {
               method: 'POST',
               body: {
                    id: account.id,
                    owner_id: account.owner_id,
                    title: account.title,
                    description: account.description,
               },
          });

          const data = response;

          if (!data.success) {
               error.value = data.message || 'Failed to update account';
          }
     } catch (err) {
          error.value = 'Network or server error';
          console.error(err);
     } finally {
          await FetchAllAccounts();
     }
}

async function FetchAllAccounts() {
     try {
          const response = await $fetch('/api/management/get/all/accounts', {
               method: 'GET',
          });

          const data = response;

          if (!data.success) {
               error.value = data.message || 'Failed to load data.';
          } else {
               accounts.value = data.result || [];
          }
     } catch (err) {
          error.value = 'Network or server error';
          console.error(err);
     }
}

async function FetchAccountCount() {
     try {
          const response = await $fetch('/api/statistics/management/count/all/accounts', {
               method: 'GET',
          });

          const data = response;

          if (!data.success) {
               error.value = data.message || 'Failed to load data.';
          } else {
               AccountsCount.value = data.result || 0;
          }
     } catch (err) {
          error.value = 'Network or server error';
          console.error(err);
     }
}
</script>
