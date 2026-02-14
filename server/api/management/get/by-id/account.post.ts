import { getFullAuthCookieContent } from '../../../../utils/getFullAuthCookieContent';
import { db } from '../../../../database/client';
import { account } from '../../../../database/schema/account';
import { eq } from 'drizzle-orm';
import { ERRORS } from '~~/server/utils/errors';

export default defineEventHandler(async (event) => {
     const FullAuthCookieContent = getFullAuthCookieContent(event);
     const body = await readBody(event);

     if (!body.id) {
          return { state: 'error', message: ERRORS.GENERAL.MISSING_DATA };
     }

     if (FullAuthCookieContent === null) {
          return { state: 'denied', message: ERRORS.AUTH.NOT_LOGGED_IN };
     }

     if (FullAuthCookieContent.role !== 'admin') {
          return { state: 'denied', message: ERRORS.AUTH.INSUFFICIENT_PERMISSIONS };
     }

     try {
          const result = await db.select().from(account).where(eq(body.id, account.id));
          return { state: 'success', data: result };
     } catch (error: any) {
          console.log('Get by ID Account API Error:', error);
     }
});
