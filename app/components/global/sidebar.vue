<template>
	<nav class="sidebar">
		<div class="sidebar__section">
			<p class="sidebar__heading">User Space</p>
			<div class="sidebar__item">
				<div class="sidebar__item-header">
					<Home
						class="sidebar__icon"
						:size="18"
					/>
					<a
						href="#"
						class="sidebar__link"
						>Home</a
					>
				</div>
			</div>
			<div class="sidebar__item">
				<div class="sidebar__item-header">
					<LayoutDashboard
						class="sidebar__icon"
						:size="18"
					/>
					<a
						href="#"
						class="sidebar__link"
						@click="SwitchUserDashboard"
						>Dashboard</a
					>
					<ChevronDown
						@click="SwitchUserDashboard"
						v-if="UserDashboard"
						class="sidebar__chevron"
					/>
					<ChevronUp
						@click="SwitchUserDashboard"
						v-if="!UserDashboard"
						class="sidebar__chevron"
					/>
				</div>

				<ul
					v-if="UserDashboard"
					class="sidebar__submenu"
				>
					<li class="sidebar__submenu-item">Accounts</li>
					<li class="sidebar__submenu-item">Transactions</li>
				</ul>
			</div>
			<div class="sidebar__item">
				<div class="sidebar__item-header">
					<Settings
						class="sidebar__icon"
						:size="18"
					/>
					<a
						href="#"
						class="sidebar__link"
						>Settings</a
					>
				</div>
			</div>
		</div>

		<div class="sidebar__section" v-if="LoggedInUserStore.UserData.role == 'admin'">
			<p class="sidebar__heading">Management Space</p>
			<div class="sidebar__item">
				<div class="sidebar__item-header">
					<LayoutDashboard
						class="sidebar__icon"
						:size="18"
					/>
					<a
						href="#"
						class="sidebar__link"
						@click="SwitchAdminDashboard"
						>Dashboard</a
					>
					<ChevronDown
						@click="SwitchAdminDashboard"
						v-if="AdminDashboard"
						class="sidebar__chevron"
					/>
					<ChevronUp
						@click="SwitchAdminDashboard"
						v-if="!AdminDashboard"
						class="sidebar__chevron"
					/>
				</div>

				<ul
					v-if="AdminDashboard"
					class="sidebar__submenu"
				>
					<li class="sidebar__submenu-item">
						<NuxtLink to="/management/users">Users</NuxtLink>
					</li>
					<li class="sidebar__submenu-item">
						<NuxtLink to="/management/accounts">Accounts</NuxtLink>
					</li>
					<li class="sidebar__submenu-item">
						<NuxtLink to="/management/transactions">Transactions</NuxtLink>
					</li>
				</ul>
			</div>
		</div>

		<div class="sidebar__section sidebar__bottom sidebar__section--user">
			<div class="sidebar__user-profile">
				<p
					class="sidebar__user-profile-displayname"
					v-if="LoggedInUserStore.UserData.displayname"
				>
					{{ LoggedInUserStore.UserData.displayname }}
				</p>
				<p
					class="sidebar__user-profile-username"
					v-if="LoggedInUserStore.UserData.username"
				>
					@{{ LoggedInUserStore.UserData.username }}
				</p>
			</div>
			<div class="sidebar__logout">
				<form @submit.prevent="Logout()">
					<button class="sidebar__logout-button">
						<LogOut class="sidebar__logout-icon" :size="18" />
					</button>
				</form>
			</div>
		</div>
	</nav>
</template>
<style src="@/assets/global/sidebar.scss" lang="scss"></style>
<script setup lang="ts">
	import { Home, LayoutDashboard, ChevronDown, ChevronUp, Settings, LogOut } from 'lucide-vue-next';
	import { useLoggedInUserStore } from '@/stores/LoggedInUser';
	import { useAccountStore } from '@/stores/accounts';
	import { useUserStore } from '@/stores/users';
	import { useTransactionStore } from '@/stores/transactions';
	import { useRouter } from 'vue-router';

	const router = useRouter();

	const LoggedInUserStore = useLoggedInUserStore();
	const UserStore = useUserStore();
	const AccountStore = useAccountStore();
	const TransactionStore = useTransactionStore();
	

	const UserDashboard = ref(true);
	const AdminDashboard = ref(true);

	function SwitchAdminDashboard() {
		AdminDashboard.value = !AdminDashboard.value;
	}

	function SwitchUserDashboard() {
		UserDashboard.value = !UserDashboard.value;
	}

	function Logout() {
		try {
			$fetch('/api/public/logout', {
				method: 'GET'
			})

			UserStore.users = [];
			AccountStore.accounts = [];
			TransactionStore.transactions = [];
			LoggedInUserStore.UserData = {};

			router.push('/public/login');
		} catch (err) {
			console.log(err)
		}
	}
</script>
