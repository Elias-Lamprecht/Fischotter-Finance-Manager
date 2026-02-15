import type { ApiResponse } from '@/types/API';
import { ERRORS } from '#shared/utils/Errors';
import { useFetchAllAccounts } from '@/composables/Accounts/useFetchAllAccounts';
import { useConfirm } from '@/composables/useConfirm';

export function useDeleteSelectedAccounts() {
	const error = ref('');
	const SelectedAccounts = ref([]);
	const { FetchAllAccounts } = useFetchAllAccounts();
	const { showConfirm } = useConfirm();

	async function DeleteSelectedAccounts(AccountArray: any) {
		const result = await showConfirm(
			'Are you sure you want to delete the selected Accounts?',
		);

		if (result) {
			try {
				const response = await $fetch<ApiResponse>(
					'/api/management/delete/many/accounts',
					{
						method: 'DELETE',
						body: {
							AccountArray: AccountArray,
						},
					},
				);

				if (response.state === 'success') {
					await FetchAllAccounts();
					SelectedAccounts.value.length = 0;
				} else {
					error.value = response.message || ERRORS.GENERAL.ERROR;
				}
			} catch (err) {
				error.value = ERRORS.GENERAL.ERROR;
			}
		}
	}
	return { error, SelectedAccounts, DeleteSelectedAccounts };
}
