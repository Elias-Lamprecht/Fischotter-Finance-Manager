import { getRequestURL, sendRedirect } from 'h3';
import { getFullAuthCookieContent } from '../utils/getFullAuthCookieContent';

export default defineEventHandler(async (event) => {
	const url = getRequestURL(event).pathname;
	const auth = getFullAuthCookieContent(event);

	if (url.startsWith('/api')) {
		return;
	}

	if (url.startsWith('/public')) {
		return;
	}

	if (url === '/') {
		// Redirect root → /home
		return sendRedirect(event, '/home');
	}

	// Redirect unauthenticated users to login
	if (!auth) {
		return sendRedirect(event, '/public/login');
	}

	// Block management page for non-admins
	if (url.startsWith('/management') && auth?.role !== 'admin') {
		return sendRedirect(event, '/public/login');
	}
});
