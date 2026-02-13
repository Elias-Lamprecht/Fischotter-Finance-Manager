import { getFullAuthCookieContent } from '../../../utils/getFullAuthCookieContent';
import { db } from '../../../database/client';
import { account } from '../../../database/schema/account';
import { ERRORS } from '~~/server/utils/errors';

export default defineEventHandler(async (event) => {
     const FullAuthCookieContent = getFullAuthCookieContent(event);
     const body = await readBody(event);

     if (!body.id || !body.title) {
          return { state: 'error', message: ERRORS.GENERAL.MISSING_DATA };
     }

     if (FullAuthCookieContent === null) {
          return { state: 'denied', message: ERRORS.AUTH.NOT_LOGGED_IN };
     }

     if (FullAuthCookieContent.role !== 'admin') {
          return { state: 'denied', message: ERRORS.AUTH.INSUFFICIENT_PERMISSIONS };
     }

     try {
          const result = await db
               .insert(account)
               .values({
                    owner_id: body.owner_id,
                    title: body.title,
                    description: body.description,
               })
               .returning();

          return { success: true, data: result };
     } catch (error: any) {
          console.log('Create Account API Error:', error);
     }
});
