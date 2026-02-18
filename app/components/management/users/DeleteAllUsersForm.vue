<template>
	<form @submit.prevent="DeleteAllUsers()">
		<button type="submit" :disabled="loading">
			{{ loading ? 'Deleting...' : 'Delete all Users' }}
		</button>
		{{ error }}
	</form>
</template>
<script setup lang="ts">
import { useDeleteAllUsers } from '~/composables/Users/delete/useDeleteAllUsers';

const { error, loading, DeleteAllUsers } = useDeleteAllUsers();
</script>
