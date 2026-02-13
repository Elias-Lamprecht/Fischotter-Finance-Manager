import { getFullAuthCookieContent } from '../../../utils/getFullAuthCookieContent';
import { db } from '../../../database/client';
import { account } from '../../../database/schema/account';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
     const FullAuthCookieContent = getFullAuthCookieContent(event);
     const body = await readBody(event);

     if (!body.owner_id && !body.title && !body.description) {
          return {
               success: false,
               message: 'No updated fields',
          };
     }

     if (FullAuthCookieContent === null) {
          // TODO: Add the generalized Error Messages
          return { success: false, message: "User isn't logged in" };
     }

     // TODO: Add the generalized Error Messages
     if (FullAuthCookieContent.role !== 'admin') {
          return { success: false, message: "User isn't a adminstrator" };
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

          return { success: true };
     } catch (error: any) {
          console.log('Account Modify API Error:', error);
          return { success: false, error: error?.message ?? error };
     }
});
