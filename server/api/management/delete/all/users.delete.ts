import { getFullAuthCookieContent } from '../../../../utils/getFullAuthCookieContent';
import { db } from '../../../../database/client';
import { user } from '../../../../database/schema/user';

export default defineEventHandler(async (event) => {
     const FullAuthCookieContent = getFullAuthCookieContent(event);

     // TODO: Add the generalized Error Messages
     if (FullAuthCookieContent === null) {
          return { success: false, message: "User isn't logged in" };
     }

     // TODO: Add the generalized Error Messages
     if (FullAuthCookieContent.role !== 'admin') {
          return { success: false, message: "User isn't a adminstrator" };
     }
     try {
          await db.delete(user);
          return { success: true };
     } catch (error: any) {
          console.log('Register API Error:', error);
          return { success: false, error: error?.message ?? error };
     }
});
