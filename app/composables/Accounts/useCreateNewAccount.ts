import type { ApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';
import { useFetchAllAccounts } from '@/composables/Accounts/useFetchAllAccounts';

export function useCreateNewAccount() {
	const error = ref('');
	const loading = ref(false);
	const { FetchAllAccounts } = useFetchAllAccounts();

	async function CreateNewAccount(payload: {
		owner_id: string;
		title: string;
		description?: string;
	}) {
		loading.value = true;
		error.value = '';

		try {
			const response = await $fetch<ApiResponse>('/api/management/create/account', {
				method: 'POST',
				body: {
					owner_id: payload.owner_id,
					title: payload.title,
					description: payload.description,
				},
			});

			if (response.state === 'success') {
				await FetchAllAccounts();
			} else {
				error.value = response.message || ERRORS.GENERAL.ERROR;
			}
		} catch (err) {
			error.value = ERRORS.GENERAL.ERROR;
		} finally {
			loading.value = false;
		}
	}
	return { error, loading, CreateNewAccount };
}
