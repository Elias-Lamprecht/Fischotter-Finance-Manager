<template>
     <ul v-for="user in users" :key="user.id">
          <li>ID: {{ user.id }}</li>
          <li v-if="user.email">Email: {{ user.email }}</li>
          <li>Username: {{ user.username }}</li>
          <li v-if="user.username !== user.displayname">Displayname: {{ user.displayname }}</li>
          <li>Role: {{ user.role }}</li>
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
     </ul>

     <p v-if="error" style="color: red">{{ error }}</p>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const users = ref([]);
const error = ref('');

// fetch users when component mounts
onMounted(async () => {
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
});
</script>
