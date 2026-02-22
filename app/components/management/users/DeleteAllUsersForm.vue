<template>
	<form @submit.prevent="UserStore.DeleteAllUsers()">
		<button type="submit" class="management__delete-button management__button">
			{{ UserStore.loading_deleteAll ? 'Deleting...' : 'Delete All Users' }}
		</button>
	</form>
</template>
<script setup lang="ts">
import { useUserStore } from '@/stores/users';
const UserStore = useUserStore();
</script>
