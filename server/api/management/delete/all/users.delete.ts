import { getFullAuthCookieContent } from '../../../../utils/getFullAuthCookieContent';
import { db } from '../../../../database/client';
import { user } from '../../../../database/schema/user';
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
		await db.delete(user);
		return { state: 'success' };
	} catch (error: any) {
		console.log('Delete All User API Error:', error);
	}
});
