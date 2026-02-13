import { getFullAuthCookieContent } from '../../../utils/getFullAuthCookieContent';
import { db } from '../../../database/client';
import { account } from '../../../database/schema/account';

export default defineEventHandler(async (event) => {
     const FullAuthCookieContent = getFullAuthCookieContent(event);
     const body = await readBody(event);

     if (!body.owner_id || !body.title) {
          return { success: false, message: 'Missing Owner ID or Title' };
     }

     if (FullAuthCookieContent === null) {
          // TODO: Add the generalized Error Messages
          return { success: false, message: "User isn't logged in" };
     }

     if (FullAuthCookieContent.role !== 'admin') {
          // TODO: Add the generalized Error Messages
          return { success: false, message: "User isn't a adminstrator" };
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

          return { success: true, result };
     } catch (error: any) {
          console.log('Create Account API Error:', error);
          return { success: false, error: error?.message ?? error };
     }
});
