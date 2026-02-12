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

const users = ref([]);
const username = ref('');
const email = ref('');
const password = ref('');
const error = ref('');

const loading_new_user = ref(false);
const loading_delete_user = ref(false);
const loading_delete_all_users = ref(false);

// fetch users when component mounts
onMounted(async () => {
     await FetchAllUsers();
});

async function FetchAllUsers() {
     try {
          const response = await fetch('http://localhost:3000/api/management/get/all/users', {
               method: 'GET',
               headers: { 'Content-Type': 'application/json' },
          });

          const data = await response.json();
          console.log(data);

          if (!data.success) {
               error.value = data.message || 'Failed to load data.';
          } else {
               console.log(data.safeResult);
               users.value = data.safeResult || [];
          }
     } catch (err) {
          error.value = 'Network or server error';
          console.error(err);
     }
}

async function UpdateUser(user) {
     try {
          const response = await fetch('http://localhost:3000/api/management/modify/user', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                    id: user.id,
                    username: user.username,
                    displayname: user.displayname,
                    email: user.email,
                    role: user.role,
                    status: user.status,
               }),
          });

          const data = await response.json();

          if (!data.success) {
               error.value = data.message || 'Failed to update user';
          }
     } catch (err) {
          error.value = 'Network or server error';
          console.error(err);
     } finally {
          await FetchAllUsers();
     }
}

async function DeleteAllUsers() {
     loading_delete_all_users.value = true;
     error.value = '';

     try {
          const response = await fetch('http://localhost:3000/api/management/delete/all/users', {
               method: 'DELETE',
               headers: {
                    'Content-Type': 'application/json',
               },
          });

          const data = await response.json();

          if (!data.success) {
               error.value = data.message || 'Failed to delete.';
          }
     } catch (err) {
          error.value = 'Network or server error';
          console.error(err);
     } finally {
          loading_delete_all_users.value = false;
          await FetchAllUsers();
     }
}

async function DeleteUser(id) {
     loading_delete_user.value = true;
     try {
          const response = await fetch('http://localhost:3000/api/management/delete/by-id/user', {
               method: 'DELETE',
               headers: {
                    'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                    id: id,
               }),
          });

          const data = await response.json();

          if (!data.success) {
               error.value = data.message || 'Failed to create account';
          }
     } catch (err) {
          error.value = 'Network or server error';
          console.error(err);
     } finally {
          loading_delete_user.value = false;
          await FetchAllUsers();
     }
}

async function CreateNewUser() {
     loading_new_user.value = true;
     try {
          const response = await fetch('http://localhost:3000/api/public/register', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                    username: username.value,
                    email: email.value,
                    password: password.value,
               }),
          });

          const data = await response.json();

          if (!data.success) {
               error.value = data.message || 'Failed to create account';
          } else {
               username.value = '';
               email.value = '';
               password.value = '';
               console.log('Created account:', data.result);
          }
     } catch (err) {
          error.value = 'Network or server error';
          console.error(err);
     } finally {
          loading_new_user.value = false;
          await FetchAllUsers();
     }
}
</script>
