const isOpen = ref(false);
const message = ref('');
let resolver: ((value: boolean) => void) | null = null;

export function useConfirm() {
	function showConfirm(msg: string) {
		message.value = msg;
		isOpen.value = true;

		return new Promise<boolean>((resolve) => {
			resolver = resolve;
		});
	}

	function answer(value: boolean) {
		isOpen.value = false;
		if (resolver) {
			resolver(value);
			resolver = null;
		}
	}

	return {
		isOpen,
		message,
		showConfirm,
		answer,
	};
}
