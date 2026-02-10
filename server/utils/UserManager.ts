import { db } from '../database/client';
import { user } from '../database/schema/user';
import { eq, or } from 'drizzle-orm';

class UserManager {
     // Delete Functions
     public async deletebyID(id: string) {
          await db.delete(user).where(eq(user.id, id));
     }
     public deleteMany() {}
     public deleteAll() {}

     // Create Functions
     public async create(
          username: string,
          displayname: string,
          hashed_password: string,
          email?: string,
          created_at?: Date,
     ) {
          await db.insert(user).values({
               username: username,
               displayname: displayname,
               password: hashed_password,
               email: email,
               created_at: created_at,
          });
     }
     public async createMany() {}

     // Get Functions
     public async getbyID(id: string) {
          const result = await db
               .select()
               .from(user)
               .where(eq(user.id, id))
               .limit(1);
          return result[0];
     }
     public async getManybyIDs() {}
     public async getbyUsername(username: string) {
          const result = await db
               .select()
               .from(user)
               .where(eq(user.username, username))
               .limit(1);
          return result[0];
     }
     public async getbyEmail(email: string) {
          const result = await db
               .select()
               .from(user)
               .where(eq(user.email, email))
               .limit(1);
          return result[0];
     }
     public async getbyEmailOrUsername(username_or_email: string) {
          const result = await db
               .select()
               .from(user)
               .where(
                    or(
                         eq(user.email, username_or_email),
                         eq(user.username, username_or_email),
                    ),
               )
               .limit(1);
          return result[0];
     }
     public async getAll() {
          const result = await db.select().from(user);
          return result;
     }

     // Modify Functions
     public async modifybyID() {}
     public async modifybyMany() {}
}

export const userManager = new UserManager();
