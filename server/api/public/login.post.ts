import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../../database/client';
import { user } from '../../database/schema/user';
import { eq, or } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
     const body = await readBody(event);

     if (!body.username_or_email || !body.password) {
          return { success: false, message: 'Missing Username / Email or Password' };
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

     const userRecord = existingUser[0]!;

     // TODO: Add the generalized Error Messages
     if (userRecord.status == 'disabled') {
          return { success: false, message: 'Account hasnt been activated' };
     }
     const isPasswordValid = await bcrypt.compare(body.password, userRecord.password);

     // TODO: Add the generalized Error Messages
     if (!isPasswordValid) {
          return { success: false, message: 'Invalid Credentials' };
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

     // TODO: Add the generalized Error Messages
     return { success: true, token };
});
