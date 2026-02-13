<template>
     <form @submit.prevent="DeleteAllUsers()">
          <button type="submit" :disabled="loading_delete_all_users">
               {{ loading_delete_all_users ? 'Deleting...' : 'Delete all Users' }}
          </button>
     </form>

     <form @submit.prevent="CreateNewUser()">
          <br />
          <div>
               <label for="username">Username:</label>
               <input v-model="username" id="username" type="text" required />
          </div>

          <div>
               <label for="email">email:</label>
               <input v-model="email" id="email" type="text" />
          </div>

          <div>
               <label for="password">password:</label>
               <input v-model="password" id="password" type="text" required />
          </div>
          <br />
          <button type="submit" :disabled="loading_new_user">
               {{ loading_new_user ? 'Creating...' : 'Create new User' }}
          </button>
          <br />
     </form>

     <p v-if="error" style="color: red">{{ error }}</p>

     <p>User Count: {{ UserCount }}</p>

     <ul v-for="user in users" :key="user.id">
          <li>ID: <input type="text" :value="user.id" disabled /></li>

          <li v-if="user.email">Email: <input type="text" v-model="user.email" /></li>

          <li>Username: <input type="text" v-model="user.username" /></li>

          <li>Displayname: <input type="text" v-model="user.displayname" /></li>

          <li>
               Role:
               <select v-model="user.role">
                    <option value="user">user</option>
                    <option value="admin">admin</option>
               </select>
          </li>
          <li>
               Status:
               <select v-model="user.status">
                    <option value="active">active</option>
                    <option value="disabled">disabled</option>
               </select>
          </li>

          <li>
               Created at:
               {{
                    new Date(user.created_at).toLocaleString('en-UK', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric',
                         hour: '2-digit',
                         minute: '2-digit',
                    })
               }}
          </li>

          <li>
               <button @click="DeleteUser(user.id)">Delete User</button>
          </li>

          <li>
               <button @click="UpdateUser(user)">Update User</button>
          </li>

          <br />
     </ul>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ERRORS } from '~~/server/utils/errors';

const users = ref([]);
const UserCount = ref(0);

const username = ref('');
const email = ref('');
const password = ref('');

const error = ref('');

const loading_new_user = ref(false);
const loading_delete_user = ref(false);
const loading_delete_all_users = ref(false);

// fetch users when component mounts
onMounted(async () => {
     await Promise.all([FetchAllUsers(), FetchUserCount()]);
});

async function FetchAllUsers() {
     try {
          const response = await $fetch('/api/management/get/all/users', {
               method: 'GET',
          });

          if (response.state === 'success') {
               users.value = response.data || [];
          } else {
               error.value = response.message || 'Failed to load data.';
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     }
}

async function FetchUserCount() {
     try {
          const response = await $fetch('/api/statistics/management/count/all/users', {
               method: 'GET',
          });

          if (response.state === 'success') {
               UserCount.value = response.data || 0;
          } else {
               error.value = response.message || 'Failed to load data.';
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     }
}

async function UpdateUser(user) {
     try {
          const response = await $fetch('/api/management/modify/user', {
               method: 'POST',
               body: {
                    id: user.id,
                    username: user.username,
                    displayname: user.displayname,
                    email: user.email,
                    role: user.role,
                    status: user.status,
               },
          });

          if (!response.state === 'success') {
               error.value = response.message || 'Failed to update user';
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     } finally {
          await FetchAllUsers();
     }
}

async function DeleteAllUsers() {
     loading_delete_all_users.value = true;
     error.value = '';

     try {
          const response = await $fetch('/api/management/delete/all/users', {
               method: 'DELETE',
          });

          if (!response.state === 'success') {
               error.value = response.message || 'Failed to delete.';
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     } finally {
          loading_delete_all_users.value = false;
          await Promise.all([FetchAllUsers(), FetchUserCount()]);
     }
}

async function DeleteUser(id) {
     loading_delete_user.value = true;
     try {
          const response = await $fetch('/api/management/delete/by-id/user', {
               method: 'DELETE',

               body: {
                    id: id,
               },
          });

          if (!response.state === 'success') {
               error.value = response.message || 'Failed to create account';
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     } finally {
          loading_delete_user.value = false;
          await Promise.all([FetchAllUsers(), FetchUserCount()]);
     }
}

async function CreateNewUser() {
     loading_new_user.value = true;
     try {
          const response = await $fetch('/api/public/register', {
               method: 'POST',
               body: {
                    username: username.value,
                    email: email.value,
                    password: password.value,
               },
          });

          if (!response.state === 'success') {
               error.value = data.message || 'Failed to create account';
          } else {
               username.value = '';
               email.value = '';
               password.value = '';
               console.log('Created account:', data.result);
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     } finally {
          loading_new_user.value = false;
          await Promise.all([FetchAllUsers(), FetchUserCount()]);
     }
}
</script>
