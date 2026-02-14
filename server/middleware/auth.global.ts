import { getRequestURL, sendRedirect } from 'h3';
import { getFullAuthCookieContent } from '../utils/getFullAuthCookieContent';
import { ERRORS } from '../utils/errors';

export default defineEventHandler(async (event) => {
     const url = getRequestURL(event).pathname;
     const auth = getFullAuthCookieContent(event);

     const publicPages = ['/public/login', '/public/register'];

     // Protect API routes
     if (url.startsWith('/api') && !url.startsWith('/api/public')) {
          if (!auth) {
               return { state: 'denied', reason: ERRORS.AUTH.NOT_LOGGED_IN };
          }

          if (url.startsWith('/api/management') && auth.role !== 'admin') {
               return { state: 'denied', reason: ERRORS.AUTH.INSUFFICIENT_PERMISSIONS };
          }

          return;
     }

     // Redirect root → /home
     if (url === '/') {
          return sendRedirect(event, '/home');
     }

     // Redirect unauthenticated users to login
     if (!auth && !publicPages.includes(url)) {
          return sendRedirect(event, '/public/login');
     }

     // Block management page for non-admins
     if (url.startsWith('/management') && auth?.role !== 'admin') {
          return sendRedirect(event, '/public/login');
     }
});
