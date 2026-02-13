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
          const response = await $fetch('/api/public/register', {
               method: 'POST',
               body: {
                    username: username.value,
                    email: email.value,
                    password: password.value,
               },
          });

          const data = response;

          if (!data.state === 'success') {
               error.value = data.message || 'Failed to create account';
          } else {
               success.value = true;
               username.value = '';
               email.value = '';
               password.value = '';
          }
     } catch (err) {
          error.value = 'Network or server error';
          console.error(err);
     } finally {
          loading.value = false;
     }
}
</script>
