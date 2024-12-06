import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";
import { userRoles } from "./users-roles";
import { relations } from "drizzle-orm";
import { userToRoles } from "./user-to-roles";

export const users = sqliteTable('Users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').notNull(),
    name: text('name').notNull(),
    uco: integer('uco').notNull()
});

export const userRelations = relations(users, ({ many }) => ({
    userToRoles: many(userToRoles)
}))

export const userSchema = createSelectSchema(users);

export type User = z.infer<typeof userSchema>;