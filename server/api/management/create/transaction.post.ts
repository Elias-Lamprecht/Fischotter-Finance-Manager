import { getFullAuthCookieContent } from '../../../utils/getFullAuthCookieContent';
import { db } from '../../../database/client';
import { transaction } from '../../../database/schema/transaction';
import { ERRORS } from '#shared/utils/Errors';

export default defineEventHandler(async (event) => {
	const FullAuthCookieContent = getFullAuthCookieContent(event);
	const body = await readBody(event);

	console.log('Missing fields:', {
		owner_id: !body.owner_id,
		account_id: !body.account_id,
		title: !body.title,
		type: !body.type,
		price: !body.price,
	});

	if (!body.owner_id || !body.account_id || !body.title || !body.type || !body.price) {
		return { state: 'error', message: ERRORS.GENERAL.MISSING_DATA };
	}

	if (FullAuthCookieContent === null) {
		return { state: 'denied', message: ERRORS.AUTH.NOT_LOGGED_IN };
	}

	if (FullAuthCookieContent.role !== 'admin') {
		return { state: 'denied', message: ERRORS.AUTH.INSUFFICIENT_PERMISSIONS };
	}

	try {
		const result = await db
			.insert(transaction)
			.values({
				account_id: body.account_id,
				owner_id: body.owner_id,
				title: body.title,
				description: body.description,
				type: body.type,
				price: body.price,
			})
			.returning();

		return { state: 'success', data: result };
	} catch (error: any) {
		console.log('Create Transaction API Error:', error);
	}
});
