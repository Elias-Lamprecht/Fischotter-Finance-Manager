import { getFullAuthCookieContent } from '../../../../../utils/getFullAuthCookieContent';
import { db } from '../../../../../database/client';
import { user } from '../../../../../database/schema/user';
import { count } from 'drizzle-orm';
import { ERRORS } from '~~/server/utils/errors';

export default defineEventHandler(async (event) => {
     const FullAuthCookieContent = getFullAuthCookieContent(event);

     if (FullAuthCookieContent === null) {
          return { state: 'denied', message: ERRORS.AUTH.NOT_LOGGED_IN };
     }

     if (FullAuthCookieContent.role !== 'admin') {
          return { state: 'denied', message: ERRORS.AUTH.INSUFFICIENT_PERMISSIONS };
     }

     try {
          const db_result = await db.select({ count: count() }).from(user);

          const result = db_result[0]!.count;

          return { state: 'success', data: result };
     } catch (error: any) {
          console.log('Count All Users API Error:', error);
     }
});
