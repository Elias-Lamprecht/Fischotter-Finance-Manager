import { db } from '../../database/client';
import { user } from '../../database/schema/user';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const SALT_ROUNDS: number = parseInt(process.env.SALT_ROUNDS || '10', 10);

async function hashPassword(plainPassword: string) {
     return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export default defineEventHandler(async (event) => {
     const body = await readBody(event);

     // TODO: Add the generalized Error Messages
     if (!body.username || !body.password) {
          console.log('Username:', body.username, 'Password:', body.password);
          return { success: false, message: 'missing Fields' };
     }

     try {
          const existingUsers = await db
               .select()
               .from(user)
               .where(eq(user.username, body.username));

          // TODO: Add the generalized Error Messages
          if (existingUsers.length > 0) {
               return { success: false, message: 'Username already exists' };
          }

          const hashedPassword = await hashPassword(body.password);

          const [newUser] = await db
               .insert(user)
               .values({
                    username: body.username,
                    displayname: body.username,
                    password: hashedPassword,
                    role: 'user',
                    email: body.email,
               })
               .returning();

          // TODO: Add the generalized Error Messages
          if (!newUser) {
               return {
                    success: false,
                    message: 'A error occurred while trying to register the user please try later again.',
               };
          }

          return {
               success: true,
               user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
               },
          };
     } catch (error: any) {
          console.log('Register API Error:', error);
          return { success: false, error: error?.message ?? error };
     }
});
