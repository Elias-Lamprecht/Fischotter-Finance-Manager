import { getFullAuthCookieContent } from '../../../../utils/getFullAuthCookieContent';
import { db } from '../../../../database/client';
import { eq } from 'drizzle-orm';
import { account } from '../../../../database/schema/account';
import { ERRORS } from '~~/server/utils/errors';

export default defineEventHandler(async (event) => {
     const FullAuthCookieContent = getFullAuthCookieContent(event);

     if (FullAuthCookieContent === null) {
          return { state: 'denied', message: ERRORS.AUTH.NOT_LOGGED_IN };
     }

     try {
          const result = await db
               .select()
               .from(account)
               .where(eq(account.owner_id, FullAuthCookieContent.id));

          return { state: 'success', data: result };
     } catch (error: any) {
          console.log('Get owned Accounts API Error:', error);
     }
});
