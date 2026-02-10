import { db } from '../database/client';
import { account } from '../database/schema/account';
import { eq } from 'drizzle-orm';

class AccountManager {
     // Delete Functions
     public async deletebyID(id: string) {
          await db.delete(account).where(eq(account.id, id));
     }
     public deleteMany() {}
     public async deleteAll() {
          await db.delete(account);
     }

     // Create Functions
     public async create(
          owner_id: string,
          title: string,
          description?: string,
          created_at?: Date,
     ) {
          await db.insert(account).values({
               owner_id: owner_id,
               title: title,
               description: description,
               created_at: created_at,
          });
     }
     public createMany() {}

     // Get Functions
     public async getbyID(id: string) {
          const result = await db
               .select()
               .from(account)
               .where(eq(account.id, id))
               .limit(1);
          return result[0];
     }
     public async getAll() {
          const result = await db.select().from(account);
          return result;
     }

     // Modify Functions
     public modifybyID() {}
     public modifybyMany() {}
}
