<template>
	<div class="auth-page">
		<fieldset class="auth-page__fieldset">
			<legend class="auth-page__legend">Register</legend>

			<form @submit.prevent="submitForm" class="auth-page__form">
				<input
					v-model="username"
					type="text"
					placeholder="Username"
					class="auth-page__form-input"
					required
				/>

				<input
					v-model="email"
					type="email"
					placeholder="Email (optional)"
					class="auth-page__form-input"
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

				<a href="/public/login" class="auth-page__switch-link"> Login </a>

				<button type="submit" :disabled="loading" class="auth-page__login-button">
					{{ loading ? 'Creating...' : 'Create Account' }}
				</button>

				<p v-if="error" class="auth-page__error">
					{{ error }}
				</p>

				<p v-if="success" class="auth-page__success">Account created successfully!</p>
			</form>
		</fieldset>
	</div>
</template>
<style src="@/assets/public/auth.scss" lang="scss"></style>

<script setup lang="ts">
definePageMeta({
	layout: 'public',
});

const view_status = ref(true);

function switchViewStatus() {
	view_status.value = !view_status.value;
}

import { ref } from 'vue';
import type { ApiResponse } from '@/types/API';
import { Eye, EyeClosed } from 'lucide-vue-next';

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
		const data = await $fetch<ApiResponse>('/api/public/register', {
			method: 'POST',
			body: { username: username.value, email: email.value, password: password.value },
		});

		console.log(data);

		if (data.state !== 'success') {
			error.value = data.message || 'Failed to create account.';
			return;
		}

		success.value = true;

		// reset form
		username.value = '';
		email.value = '';
		password.value = '';
	} catch (err) {
		error.value = 'Network or server error';
		console.error(err);
	} finally {
		loading.value = false;
	}
}
</script>
