import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../../database/client';
import { user } from '../../database/schema/user';
import { eq, or } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
     const body = await readBody(event);

     if (!body.username_or_email || !body.password) {
          // TODO: Add the generalized Error Messages
          return {
               success: false,
               message: 'Missing Username / Email or Password',
          };
     }

     const existingUser = await db
          .select()
          .from(user)
          .where(
               or(
                    eq(user.email, body.username_or_email),
                    eq(user.username, body.username_or_email),
               ),
          )
          .limit(1);

     // TODO: Add the generalized Error Messages
     if (existingUser.length === 0) {
          return { success: false, message: "User doesn't exist" };
     }

     const isPasswordValid = await bcrypt.compare(
          body.password,
          existingUser[0]?.password || '',
     );

     // TODO: Add the generalized Error Messages
     if (!isPasswordValid) {
          return { success: false, message: 'Invalid Credentials' };
     }

     // TODO: Add the generalized Error Messages
     if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET is not defined');
     }

     const expiresIn: SignOptions['expiresIn'] =
          (process.env.JWT_EXPIRE_TIME as SignOptions['expiresIn']) || '30m';

     const token = jwt.sign(
          {
               id: existingUser[0]?.id,
               username: existingUser[0]?.username,
               email: existingUser[0]?.email,
               role: existingUser[0]?.role,
          },
          process.env.JWT_SECRET as string,
          { expiresIn },
     );

     setCookie(event, 'auth', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
     });

     // TODO: Add the generalized Error Messages
     return { success: true, token };
});
