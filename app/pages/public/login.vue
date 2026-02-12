<template>
     <form @submit.prevent="submitForm">
          <div>
               <label for="username_or_email">Username or Email:</label>
               <input v-model="username_or_email" id="username_or_email" type="text" required />
          </div>

          <div>
               <label for="password">password:</label>
               <input v-model="password" id="password" type="password" required />
          </div>

          <br /><a href="/public/register">Register</a> <br /><br />

          <button type="submit" :disabled="loading">
               {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          <p v-if="error" style="color: red">{{ error }}</p>
     </form>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const username_or_email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

async function submitForm() {
     loading.value = true;
     error.value = '';
     success.value = false;

     try {
          const response = await fetch('http://localhost:3000/api/public/login', {
               method: 'POST',
               headers: {
                    'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                    username_or_email: username_or_email.value,
                    password: password.value,
               }),
          });

          const data = await response.json();

          if (!data.success) {
               error.value = data.message || 'Failed to login.';
          } else {
               success.value = true;
               username_or_email.value = '';
               password.value = '';
          }

          router.push('/home');
     } catch (err) {
          error.value = 'Network or server error';
          console.error(err);
     } finally {
          loading.value = false;
     }
}
</script>
