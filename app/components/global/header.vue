<template>
	<header class="header">
		<nav class="header__navbar">
			<div class="header__navbar-left-side">
				<div>
					<NuxtLink to="/home">Home</NuxtLink>
				</div>
				<div class="dropdown">
					Admin Pages
					<div class="dropdown__content">
						<NuxtLink to="/management/users">User Page</NuxtLink>
						<NuxtLink to="/management/accounts">Account Page</NuxtLink>
						<NuxtLink to="/management/transactions">Transaction Page</NuxtLink>
					</div>
				</div>
			</div>
			<div class="header__navbar-right-side">
				<form @submit.prevent="logout()">
					<button type="submit" class="header__button">Logout</button>
					<p>{{ error }}</p>
				</form>
			</div>
		</nav>
	</header>
</template>
<style src="@/assets/global/header.scss" lang="scss"></style>
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
