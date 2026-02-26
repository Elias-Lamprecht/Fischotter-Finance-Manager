import { readBody } from 'h3';
import { sql } from 'drizzle-orm';
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
		const body = await readBody(event);

		const page = Number(body?.page) || 1;
		const limit = Number(body?.limit) || 10;
		const offset = (page - 1) * limit;

		const result = await db.select().from(account).limit(limit).offset(offset);

		const totalResult = await db.select({ count: sql<number>`count(*)` }).from(account);

		const total = totalResult[0]!.count;
		const lastPage = Math.ceil(total / limit);

		return {
			state: 'success',
			data: result,
			pagination: {
				total,
				page,
				limit,
				lastPage,
				hasNext: page < lastPage,
				hasPrev: page > 1,
			},
		};
	} catch (error: any) {
		console.log('Get All Accounts as Pages API Error:', error);
		return { state: 'error', message: 'Something went wrong' };
	}
});
