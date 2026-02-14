import { getRequestURL, sendRedirect } from 'h3';
import { getFullAuthCookieContent } from '../utils/getFullAuthCookieContent';
import { ERRORS } from '../utils/errors';

export default defineEventHandler(async (event) => {
     const url = getRequestURL(event).pathname;
     const auth = getFullAuthCookieContent(event);

     const publicPages = ['/public/login', '/public/register'];

     if (url.startsWith('/api')) {
          return;
     }

     if (url === '/') {
          // Redirect root → /home
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
