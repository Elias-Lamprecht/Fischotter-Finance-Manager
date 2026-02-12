<template>
     <form @submit.prevent="submitForm">
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

          <br /><a href="/public/login">Login</a> <br /><br />

          <button type="submit" :disabled="loading">
               {{ loading ? 'Creating...' : 'Create Account' }}
          </button>

          <p v-if="error" style="color: red">{{ error }}</p>
          <p v-if="success" style="color: green">Account created successfully!</p>
     </form>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

async function submitForm() {
     loading.value = true;
     error.value = '';
     success.value = false;

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
               success.value = true;
               username.value = '';
               email.value = '';
               password.value = '';
               console.log('Created account:', data.result);
          }
     } catch (err) {
          error.value = 'Network or server error';
          console.error(err);
     } finally {
          loading.value = false;
     }
}
</script>
