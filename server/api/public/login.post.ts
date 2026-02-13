import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ERRORS } from '~~/server/utils/errors';
import { db } from '../../database/client';
import { user } from '../../database/schema/user';
import { eq, or } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
     const body = await readBody(event);

     if (!body.username_or_email || !body.password) {
          return { state: 'error', message: ERRORS.GENERAL.MISSING_DATA };
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

     if (existingUser.length === 0) {
          return { state: 'denied', message: ERRORS.AUTH.USER_NOT_FOUND };
     }

     const userRecord = existingUser[0]!;

     if (userRecord.status == 'disabled') {
          return { state: 'denied', message: ERRORS.AUTH.NOT_ACTIVE };
     }
     const isPasswordValid = await bcrypt.compare(body.password, userRecord.password);

     if (!isPasswordValid) {
          return { state: 'denied', message: ERRORS.AUTH.INVALID_CREDENTIALS };
     }

     if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');

     const token = jwt.sign(
          {
               id: userRecord.id,
               email: userRecord.email,
               username: userRecord.username,
               displayname: userRecord.displayname,
               role: userRecord.role,
               created_at: userRecord.created_at,
          },
          process.env.JWT_SECRET!,
          { expiresIn: '30m' },
     );

     setCookie(event, 'auth', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 30,
     });

     return { state: 'success', data: token };
});
