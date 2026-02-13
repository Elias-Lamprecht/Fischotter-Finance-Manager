import { db } from '../../database/client';
import { user } from '../../database/schema/user';
import { ERRORS } from '~~/server/utils/errors';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const SALT_ROUNDS: number = parseInt(process.env.SALT_ROUNDS || '10', 10);

async function hashPassword(plainPassword: string) {
     return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export default defineEventHandler(async (event) => {
     const body = await readBody(event);

     if (!body.username || !body.password) {
          return { state: 'error', message: ERRORS.GENERAL.MISSING_DATA };
     }

     try {
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

          if (existingUser.length > 0) {
               return { state: 'error', message: ERRORS.AUTH.USERNAME_TAKEN };
          }

          const hashedPassword = await hashPassword(body.password);

          const [newUser] = await db
               .insert(user)
               .values({
                    username: body.username,
                    displayname: body.username,
                    password: hashedPassword,
                    role: 'user',
                    status: 'disabled',
                    email: body.email,
               })
               .returning();

          if (!newUser) {
               return { state: 'error', message: ERRORS.GENERAL.ERROR };
          }

          return {
               state: 'success',
               data: {
                    user: {
                         id: newUser?.id,
                         username: newUser.username,
                         email: newUser?.email,
                    },
               },
          };
     } catch (error: any) {
          console.log('Register API Error:', error);
     }
});
