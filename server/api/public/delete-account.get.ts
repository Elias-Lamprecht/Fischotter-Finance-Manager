import { ERRORS } from '#shared/utils/Errors';
import { getFullAuthCookieContent } from '../../utils/getFullAuthCookieContent';
import { db } from '../../database/client';
import { eq } from 'drizzle-orm';
import { transaction } from '../../database/schema/transaction';
import { account } from '../../database/schema/account';
import { user } from '../../database/schema/user';

export default defineEventHandler(async (event) => {
	const FullAuthCookieContent = getFullAuthCookieContent(event);

	if (FullAuthCookieContent === null) {
		return { state: 'denied', message: ERRORS.AUTH.NOT_LOGGED_IN };
	}

	await db.delete(transaction).where(eq(transaction.owner_id, FullAuthCookieContent.id));
	await db.delete(account).where(eq(account.owner_id, FullAuthCookieContent.id));
	await db.delete(user).where(eq(user.id, FullAuthCookieContent.id));
	deleteCookie(event, 'auth');

	return { state: 'success' };
});
