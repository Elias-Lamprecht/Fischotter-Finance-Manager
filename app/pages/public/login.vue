<template>
	<div class="auth-page">
		<fieldset class="auth-page__fieldset">
			<legend class="auth-page__legend">Login</legend>

			<form @submit.prevent="submitForm" class="auth-page__form">
				<input
					v-model="username_or_email"
					type="text"
					placeholder="Username or Email"
					class="auth-page__form-input"
					required
				/>

				<input
					v-model="password"
					type="password"
					placeholder="Password"
					class="auth-page__form-input"
					required
				/>

				<a href="/public/register" class="auth-page__switch-link"> Register </a>

				<button type="submit" :disabled="loading" class="auth-page__login-button">
					{{ loading ? 'Logging in...' : 'Login' }}
				</button>

				<p v-if="error" class="auth-page__error">
					{{ error }}
				</p>
			</form>
		</fieldset>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: 'public',
});

import { useRouter } from 'vue-router';
import { ref } from 'vue';
import type { ApiResponse } from '~/types/API';

const router = useRouter();

const username_or_email = ref('');
const password = ref('');

const loading = ref(false);
const error = ref('');

async function submitForm() {
	loading.value = true;
	error.value = '';

	try {
		const data = await $fetch<ApiResponse>('/api/public/login', {
			method: 'POST',
			body: { username_or_email: username_or_email.value, password: password.value },
		});

		if (data.state !== 'success') {
			error.value = data.message || 'Failed to login.';
			return;
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

<style src="@/assets/public/auth.scss" lang="scss"></style>
