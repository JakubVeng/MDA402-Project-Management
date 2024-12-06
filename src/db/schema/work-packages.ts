import { relations } from "drizzle-orm";
import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";

export const workPackages = sqliteTable('WorkPackages', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    parentId: integer('parentId').references((): any => workPackages.id),
});

export const workPackagesRelations = relations(workPackages, ({ one }) => ({
    parent: one(workPackages, {
        fields: [workPackages.parentId],
        references: [workPackages.id]
    })
}))

export const workPackageSchema = createSelectSchema(workPackages);

export type WorkPackage = z.infer<typeof workPackageSchema>;