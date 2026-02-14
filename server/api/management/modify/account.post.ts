import { getFullAuthCookieContent } from '../../../utils/getFullAuthCookieContent';
import { db } from '../../../database/client';
import { account } from '../../../database/schema/account';
import { eq } from 'drizzle-orm';
import { ERRORS } from '~~/server/utils/errors';

export default defineEventHandler(async (event) => {
     const FullAuthCookieContent = getFullAuthCookieContent(event);
     const body = await readBody(event);

     if (!body.id && !body.owner_id && !body.title && !body.description) {
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
               .update(account)
               .set({
                    owner_id: body.owner_id,
                    title: body.title,
                    description: body.description,
               })
               .where(eq(account.id, body.id));

          return { state: 'success' };
     } catch (error: any) {
          console.log('Account Modify API Error:', error);
     }
});
