<template>
	<nav class="management__page-control">
		<div>
			<button
				@click="PreviousPage"
				:disabled="page === 1"
				class="management__button"
			>
				Previous Page
			</button>
		</div>
		<p class="management__page-control__current-page">{{ page }}</p>
		<div>
			<button
				@click="NextPage"
				:disabled="page === AccountStore.lastPage"
				class="management__button"
			>
				Next Page
			</button>
		</div>
	</nav>
</template>
<script setup lang="ts">
	import { useAccountStore } from '@/stores/accounts';
	const AccountStore = useAccountStore();

	let page = ref(1);

	async function NextPage() {
		console.log(page);
		if (page.value < AccountStore.lastPage) {
			page.value++;
			await AccountStore.fetchPagenizedAccounts(page.value, 10);
		}
	}

	async function PreviousPage() {
		console.log(page);
		if (page.value > 1) {
			page.value--;
			await AccountStore.fetchPagenizedAccounts(page.value, 10);
		}
	}
</script>
