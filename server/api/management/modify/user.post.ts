import { getFullAuthCookieContent } from '../../../utils/getFullAuthCookieContent';
import { db } from '../../../database/client';
import { user } from '../../../database/schema/user';
import { eq } from 'drizzle-orm';
import { ERRORS } from '#shared/utils/Errors';

export default defineEventHandler(async (event) => {
	const FullAuthCookieContent = getFullAuthCookieContent(event);
	const body = await readBody(event);

	if (!body.username && !body.displayname && !body.role && !body.email) {
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
		await db
			.update(user)
			.set({
				username: body.username,
				displayname: body.displayname,
				role: body.role,
				email: body.email,
				status: body.status,
			})
			.where(eq(user.id, body.id));

		return { state: 'success' };
	} catch (error: any) {
		console.log('User Modify API Error:', error);
	}
});
