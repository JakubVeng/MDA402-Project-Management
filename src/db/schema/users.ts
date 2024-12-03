import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";

export const users = sqliteTable('Users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull()
});

export const userSchema = createSelectSchema(users);

export type User = z.infer<typeof userSchema>;