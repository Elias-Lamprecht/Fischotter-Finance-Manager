import { getFullAuthCookieContent } from '../../../../utils/getFullAuthCookieContent';
import { db } from '../../../../database/client';
import { transaction } from '../../../../database/schema/transaction';
import { eq, and } from 'drizzle-orm';
import { ERRORS } from '#shared/utils/Errors';

export default defineEventHandler(async (event) => {
	const FullAuthCookieContent = getFullAuthCookieContent(event);
	const body = await readBody(event);

	if (!body.id) {
		return { state: 'error', message: ERRORS.GENERAL.MISSING_DATA };
	}

	if (FullAuthCookieContent === null) {
		return { state: 'denied', message: ERRORS.AUTH.NOT_LOGGED_IN };
	}

	try {
		const result = await db
			.select()
			.from(transaction)
			.where(
				and(
					eq(body.id, transaction.id),
					eq(transaction.owner_id, FullAuthCookieContent.id),
				),
			);
		return { state: 'success', data: result };
	} catch (error: any) {
		console.log('Get by ID Transaction API Error:', error);
	}
});
