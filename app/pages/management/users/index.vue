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
               <label for="email">Email:</label>
               <input v-model="email" id="email" type="text" />
          </div>

          <div>
               <label for="password">Password:</label>
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
               <button @click="selectUser(user)">Load Accounts</button>
          </li>

          <li v-if="selectedUserId === user.id">
               <p v-if="loadingUserData">Loading details...</p>
               <div v-else>
                    <p v-for="account in selectedUserData" :key="account.id" >
                         <ul>ID: {{ account.id }}</ul>
                         <ul>Title: {{ account.title }}</ul>
                         <ul>Description: {{ account.description }}</ul>
                         <ul>Created at: {{ new Date(account.created_at).toLocaleString('en-UK', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric',
                         hour: '2-digit',
                         minute: '2-digit',
                    }) }}
                         </ul>
                    </p>
               </div>
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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ERRORS } from '#shared/utils/Errors';
import type { ApiResponse } from '@/types/API';
import type { User } from '@/types/User';
import type { Account } from '@/types/Account';

const users = ref<User[]>([]);
const UserCount = ref<number>(0);

const username = ref('');
const email = ref('');
const password = ref('');

const selectedUserId = ref<string | null>(null);
const selectedUserData = ref<Account[]>([]);
const loadingUserData = ref(false);

const error = ref('');

const loading_new_user = ref(false);
const loading_delete_user = ref(false);
const loading_delete_all_users = ref(false);

onMounted(async () => {
     await Promise.all([FetchAllUsers(), FetchUserCount()]);
});

async function FetchAllUsers() {
     try {
          const response = await $fetch<ApiResponse<User[]>>('/api/management/get/all/users', {
               method: 'GET',
          });

          if (response.state === 'success') {
               users.value = response.data || [];
          } else {
               error.value = response.message || ERRORS.GENERAL.ERROR;
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     }
}

async function FetchUserCount() {
     try {
          const response = await $fetch<ApiResponse<number>>(
               '/api/statistics/management/count/all/users',
               { method: 'GET' },
          );
          if (response.state === 'success') {
               UserCount.value = response.data || 0;
          } else {
               error.value = response.message || ERRORS.GENERAL.ERROR;
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     }
}

async function selectUser(user: User) {
     selectedUserId.value = user.id;
     selectedUserData.value = [];
     error.value = '';
     loadingUserData.value = true;

     try {
          const response = await $fetch<ApiResponse<Account[]>>(
               '/api/management/get/by-user/accounts',
               {
                    method: 'POST',
                    body: { id: user.id },
               },
          );

          if (response.state === 'success') {
               selectedUserData.value = response.data || [];
          } else {
               error.value = response.message || ERRORS.GENERAL.ERROR;
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     } finally {
          loadingUserData.value = false;
     }
}

async function CreateNewUser() {
     loading_new_user.value = true;
     error.value = '';

     try {
          const response = await $fetch<ApiResponse>('/api/public/register', {
               method: 'POST',
               body: { username: username.value, email: email.value, password: password.value },
          });

          if (response.state === 'success') {
               username.value = '';
               email.value = '';
               password.value = '';
          } else {
               error.value = response.message || ERRORS.GENERAL.ERROR;
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     } finally {
          loading_new_user.value = false;
          await Promise.all([FetchAllUsers(), FetchUserCount()]);
     }
}

async function UpdateUser(user: User) {
     try {
          const response = await $fetch<ApiResponse>('/api/management/modify/user', {
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

          if (response.state !== 'success') {
               error.value = response.message || ERRORS.GENERAL.ERROR;
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     } finally {
          await FetchAllUsers();
     }
}

async function DeleteUser(id: string) {
     loading_delete_user.value = true;
     try {
          const response = await $fetch<ApiResponse>('/api/management/delete/by-id/user', {
               method: 'DELETE',
               body: { id: id },
          });

          if (response.state !== 'success') {
               error.value = response.message || ERRORS.GENERAL.ERROR;
          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     } finally {
          loading_delete_user.value = false;
          await Promise.all([FetchAllUsers(), FetchUserCount()]);
     }
}

async function DeleteAllUsers() {
     loading_delete_all_users.value = true;
     error.value = '';

     try {
          const response = await $fetch<ApiResponse>('/api/management/delete/all/users', {
               method: 'DELETE',
          });

          if (response.state !== 'success') {
               error.value = response.message || ERRORS.GENERAL.ERROR;

          }
     } catch (err) {
          error.value = ERRORS.GENERAL.ERROR;
     } finally {
          loading_delete_all_users.value = false;
          await Promise.all([FetchAllUsers(), FetchUserCount()]);
     }
}
</script>
