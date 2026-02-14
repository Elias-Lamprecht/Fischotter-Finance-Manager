import { getFullAuthCookieContent } from '../../../../utils/getFullAuthCookieContent';
import { db } from '../../../../database/client';
import { account } from '../../../../database/schema/account';
import { eq } from 'drizzle-orm';
import { ERRORS } from '~~/server/utils/errors';

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
          await db.delete(account).where(eq(body.owner_id, account.owner_id));
          return { state: 'success' };
     } catch (error: any) {
          console.log('Delete by User Account API Error:', error);
     }
});
