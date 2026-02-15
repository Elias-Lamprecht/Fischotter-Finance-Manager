<script setup>
import { useConfirm } from '@/composables/useConfirm';

const { isOpen, message, answer } = useConfirm();
</script>

<template>
	<ClientOnly>
		<Teleport to="body">
			<div v-if="isOpen" class="overlay" @click.self="answer(false)">
				<div class="modal">
					<p>{{ message }}</p>

					<button @click="answer(true)">Yes</button>
					<button @click="answer(false)">No</button>
				</div>
			</div>
		</Teleport>
	</ClientOnly>
</template>

<style>
.overlay {
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.modal {
	padding: 0.5rem;
	background-color: black;
}
</style>
