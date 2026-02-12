import { getFullAuthCookieContent } from '../../../utils/getFullAuthCookieContent';
import { db } from '../../../database/client';
import { user } from '../../../database/schema/user';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
     const FullAuthCookieContent = getFullAuthCookieContent(event);
     const body = await readBody(event);

     // TODO: Add the generalized Error Messages
     if (FullAuthCookieContent === null) {
          return { success: false, message: "User isn't logged in" };
     }

     // TODO: Add the generalized Error Messages
     if (FullAuthCookieContent.role !== 'admin') {
          return { success: false, message: "User isn't a adminstrator" };
     }
     try {
          await db
               .update(user)
               .set({
                    username: body.username,
                    displayname: body.displayname,
                    role: body.role,
                    email: body.email,
                    status: body.status,
               })
               .where(eq(user.id, body.id));

          return { success: true };
     } catch (error: any) {
          console.log('Register API Error:', error);
          return { success: false, error: error?.message ?? error };
     }
});
