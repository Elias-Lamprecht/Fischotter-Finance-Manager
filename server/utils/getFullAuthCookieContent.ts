import type { H3Event } from 'h3';
import jwt from 'jsonwebtoken';

export interface AuthCookie {
     id: string;
     email: string;
     username: string;
     displayname: string;
     role: string;
     created_at: string;
}

export function getFullAuthCookieContent(event: H3Event): AuthCookie | null {
     const token = getCookie(event, 'auth');
     if (!token) return null;

     try {
          return jwt.verify(token, process.env.JWT_SECRET!, {
               algorithms: ['HS256'],
          }) as AuthCookie;
     } catch {
          return null;
     }
}
