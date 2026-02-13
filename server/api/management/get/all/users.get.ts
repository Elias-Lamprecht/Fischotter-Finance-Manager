import { getFullAuthCookieContent } from '../../../../utils/getFullAuthCookieContent';
import { db } from '../../../../database/client';
import { user } from '../../../../database/schema/user';
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
          const result = await db.select().from(user);

          // remove the password field
          const safeResult = result.map(({ password, ...user }) => user);

          return { state: 'success', data: safeResult };
     } catch (error: any) {
          console.log('Get All Users API Error:', error);
     }
});
