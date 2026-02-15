import { getFullAuthCookieContent } from '../../../utils/getFullAuthCookieContent';
import { db } from '../../../database/client';
import { transaction } from '../../../database/schema/transaction';
import { eq } from 'drizzle-orm';
import { ERRORS } from '#shared/utils/Errors';

export default defineEventHandler(async (event) => {
	const FullAuthCookieContent = getFullAuthCookieContent(event);
	const body = await readBody(event);

	if (
		!body.id &&
		!body.account_id &&
		!body.owner_id &&
		!body.title &&
		!body.description &&
		!body.type
	) {
		return {
			state: 'error',
			message: ERRORS.UPDATE.NO_CHANGES_DETECTED,
		};
	}

	if (FullAuthCookieContent === null) {
		return { state: 'denied', message: ERRORS.AUTH.NOT_LOGGED_IN };
	}

	if (FullAuthCookieContent.role !== 'admin') {
		return { state: 'denied', message: ERRORS.AUTH.INSUFFICIENT_PERMISSIONS };
	}

	try {
		console.log('updating transaction.');
		console.log({
			id: body.id,
			account_id: body.account_id,
			owner_id: body.owner_id,
			title: body.title,
			description: body.description,
			type: body.type,
			price: body.price,
		});
		await db
			.update(transaction)
			.set({
				id: body.id,
				account_id: body.account_id,
				owner_id: body.owner_id,
				title: body.title,
				description: body.description,
				type: body.type,
				price: body.price,
			})
			.where(eq(transaction.id, body.id));

		return { state: 'success' };
	} catch (error: any) {
		console.log('Transaction Modify API Error:', error);
	}
});
