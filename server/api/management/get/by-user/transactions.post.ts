import { getFullAuthCookieContent } from '../../../../utils/getFullAuthCookieContent';
import { db } from '../../../../database/client';
import { eq } from 'drizzle-orm';
import { transaction } from '../../../../database/schema/transaction';
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
          const result = await db
               .select()
               .from(transaction)
               .where(eq(transaction.owner_id, body.id));

          console.log(result);

          return { state: 'success', data: result };
     } catch (error: any) {
          console.log('Get by User Transactions API Error:', error);
     }
});
