<template>
	<div class="page">
		<Sidebar />
		<NuxtPage />
	</div>
	<ConfirmModal />
</template>
<style>
	.page {
		display: flex;
	}
</style>
<script setup>
	import Sidebar from '@/components/global/sidebar.vue';
	import ConfirmModal from '@/components/utils/ConfirmModal.vue';

	useHead({
		link: [
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap',
			},
		],
	});
</script>
