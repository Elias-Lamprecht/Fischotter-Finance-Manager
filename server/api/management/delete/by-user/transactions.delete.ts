import { getFullAuthCookieContent } from '../../../../utils/getFullAuthCookieContent';
import { db } from '../../../../database/client';
import { transaction } from '../../../../database/schema/transaction';
import { eq } from 'drizzle-orm';
import { ERRORS } from '#shared/utils/Errors';

export default defineEventHandler(async (event) => {
	const FullAuthCookieContent = getFullAuthCookieContent(event);
	const body = await readBody(event);

	if (!body.owner_id) {
		return { state: 'error', message: ERRORS.GENERAL.MISSING_DATA };
	}

	if (FullAuthCookieContent === null) {
		return { state: 'denied', message: ERRORS.AUTH.NOT_LOGGED_IN };
	}

	if (FullAuthCookieContent.role !== 'admin') {
		return { state: 'denied', message: ERRORS.AUTH.INSUFFICIENT_PERMISSIONS };
	}

	try {
		await db.delete(transaction).where(eq(body.owner_id, transaction.owner_id));
		return { state: 'success' };
	} catch (error: any) {
		console.log('Delete by User Transaction API Error:', error);
	}
});
