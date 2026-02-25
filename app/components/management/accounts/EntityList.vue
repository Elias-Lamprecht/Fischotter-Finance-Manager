<template>
	<div class="EntityList">
		<div class="EntityList__grid">
			<div class="EntityList__row">
				<div class="EntityList__header"><b>Select</b></div>
				<div class="EntityList__header"><b>ID</b></div>
				<div class="EntityList__header"><b>Owner ID</b></div>
				<div class="EntityList__header"><b>Primary</b></div>
				<div class="EntityList__header"><b>Title</b></div>
				<div class="EntityList__header"><b>Description</b></div>
				<div class="EntityList__header"><b>Created At</b></div>
				<div class="EntityList__header"><b>Actions</b></div>
			</div>
			<div
				v-for="account in AccountStore.accounts"
				:key="account.id"
				class="EntityList__row"
				:class="{ selected: AccountStore.selectedAccounts.includes(account.id) }"
			>
				<div class="EntityList__list-item EntityList__list-checkbox-item">
					<input
						type="checkbox"
						:value="account.id"
						v-model="AccountStore.selectedAccounts"
					/>
				</div>
				<div class="EntityList__list-item">
					<div class="input-wrapper">
						<input
							type="text"
							:value="account.id"
							disabled
						/>
					</div>
				</div>
				<div class="EntityList__list-item">
					<input
						type="text"
						v-model="account.owner_id"
					/>
					<select v-model="account.owner_id">
						<option
							v-for="user in UserStore.users"
							:key="user.id"
							:value="user.id"
						>
							{{ user.username }}
						</option>
					</select>
				</div>
				<div class="EntityList__list-item">
					<input
						type="checkbox"
						v-model="account.primary"
					/>
				</div>
				<div class="EntityList__list-item">
					<input
						type="text"
						v-model="account.title"
					/>
				</div>
				<div class="EntityList__list-item">
					<textarea v-model="account.description"></textarea>
				</div>
				<div class="EntityList__list-item EntityList__list-date-item">
					{{
						new Date(account.created_at).toLocaleString('en-UK', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
						})
					}}
				</div>
				<div class="EntityList__actions EntityList__list-item">
					<button
						@click="AccountStore.UpdateAccount(account.id, account)"
						class="management__button management__update-button"
					>
						<Upload
							class="icon"
							:size="20"
						/>
					</button>
					<button
						@click="AccountStore.DeleteAccount(account.id)"
						class="management__button management__delete-button"
					>
						<Trash
							class="icon"
							:size="20"
						/>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<style src="@/assets/management/index.scss" lang="scss"></style>
<script setup lang="ts">
	import { Trash, Upload } from 'lucide-vue-next';

	import { useAccountStore } from '@/stores/accounts';
	import { useUserStore } from '@/stores/users';

	const AccountStore = useAccountStore();
	const UserStore = useUserStore();
</script>
