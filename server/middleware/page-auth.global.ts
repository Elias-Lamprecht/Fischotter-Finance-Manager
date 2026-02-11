import { getRequestURL, sendRedirect } from 'h3';
import { getFullAuthCookieContent } from '../utils/getFullAuthCookieContent';

export default defineEventHandler(async (event) => {
     const url = getRequestURL(event).pathname;
     const FullAuthCookieContent = getFullAuthCookieContent(event);

     // API requests are ignored
     if (url.startsWith('/api')) return;

     const publicPages = ['/public/login', '/public/register'];

     // Redirect to login if not logged in and it's not a public page
     if (!FullAuthCookieContent && !publicPages.includes(url)) {
          return sendRedirect(event, '/public/login');
     }

     // convert / to /home
     if (url === '/') {
          return sendRedirect(event, '/home');
     }

     // block /management access
     if (url.startsWith('/management') && FullAuthCookieContent?.role !== 'admin') {
          return sendRedirect(event, '/public/login');
     }
});
