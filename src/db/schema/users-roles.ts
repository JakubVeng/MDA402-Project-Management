import { relations } from "drizzle-orm";
import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";
import { userToRoles } from "./user-to-roles";

export const userRoles = sqliteTable('UserRoles', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    role: text('role').notNull(),
});

export const userRoleRelations = relations(userRoles, ({ many }) => ({
    userToRoles: many(userToRoles)
}))

export const userRoleSchema = createSelectSchema(userRoles);

export type UserRole = z.infer<typeof userRoleSchema>;