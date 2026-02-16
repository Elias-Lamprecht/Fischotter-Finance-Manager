<template>
	<header>
		<ul>
			<li>
				<NuxtLink to="/home">Home</NuxtLink>
			</li>
			<li>
				<NuxtLink to="/management/users">User Page</NuxtLink>
			</li>
			<li>
				<NuxtLink to="/management/accounts">Account Page</NuxtLink>
			</li>
			<li>
				<NuxtLink to="/management/transactions">Transaction Page</NuxtLink>
			</li>
			<li>
				<form @submit.prevent="logout()">
					<button type="submit">Logout</button>
					<p>{{ error }}</p>
				</form>
			</li>
		</ul>
	</header>
</template>
<style scoped>
ul {
	display: flex;
	gap: 0.5rem;
	padding: 0;
	margin: 0;
}
li {
	padding: 0;
	margin: 0;
}
</style>
<script setup lang="ts">
const error = ref('');

async function logout() {
	error.value = '';

	try {
		await $fetch('/api/public/logout', {
			method: 'GET',
		});
	} catch (err) {
		error.value = ERRORS.GENERAL.ERROR;
	} finally {
		await navigateTo('/public/login');
	}
}
</script>
