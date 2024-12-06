import { relations } from "drizzle-orm";
import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";
import { users } from "./users";
import { userRoles } from "./users-roles";

export const userToRoles = sqliteTable('UserToRoles', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('userId').notNull().references(() => users.id),
    roleId: integer('roleId').notNull().references(() => userRoles.id),
});

export const userToRolesRelations = relations(userToRoles, ({ one }) => ({
    user: one(users, {
        fields: [userToRoles.userId],
        references: [users.id]
    }),
    role: one(userRoles, {
        fields: [userToRoles.roleId],
        references: [userRoles.id]
    })
}))

export const userToRoleSchema = createSelectSchema(userToRoles);

export type UserToRole = z.infer<typeof userToRoleSchema>;