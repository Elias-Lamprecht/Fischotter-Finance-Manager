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
				<div class="auth-page__password-wrapper">
					<input
						v-model="password"
						:type="view_status ? 'password' : 'text'"
						placeholder="Password"
						class="auth-page__form-input auth-page__password-input"
						required
					/>
					<div @click="switchViewStatus()" class="icon">
						<Eye v-if="view_status"></Eye>
						<EyeClosed v-else></EyeClosed>
					</div>
				</div>

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
import { Eye, EyeClosed } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import type { ApiResponse } from '~/types/API';

const view_status = ref(true);

const router = useRouter();

const username_or_email = ref('');
const password = ref('');

const loading = ref(false);
const error = ref('');

function switchViewStatus() {
	view_status.value = !view_status.value;
}

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
