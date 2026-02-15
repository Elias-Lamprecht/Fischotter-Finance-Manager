import { getFullAuthCookieContent } from '../../../../utils/getFullAuthCookieContent';
import { db } from '../../../../database/client';
import { account } from '../../../../database/schema/account';
import { ERRORS } from '#shared/utils/Errors';

export default defineEventHandler(async (event) => {
	const FullAuthCookieContent = getFullAuthCookieContent(event);

	if (FullAuthCookieContent === null) {
		return { state: 'denied', message: ERRORS.AUTH.NOT_LOGGED_IN };
	}

	if (FullAuthCookieContent.role !== 'admin') {
		return { state: 'denied', message: ERRORS.AUTH.INSUFFICIENT_PERMISSIONS };
	}

	try {
		const result = await db.select().from(account);

		return { state: 'success', data: result };
	} catch (error: any) {
		console.log('Get All Accounts API Error:', error);
	}
});
