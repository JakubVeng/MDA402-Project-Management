import {integer, sqliteTable, real, text} from "drizzle-orm/sqlite-core";
import {createSelectSchema} from "drizzle-zod";
import { z } from "zod";
import { pertTasks } from "./pert-tasks";
import { relations } from "drizzle-orm";

export const allocations = sqliteTable('Allocations', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    pertId: integer('pertId').notNull().references(() => pertTasks.id),
    name: text('name').notNull(),
    allocation: real('allocation').default(1).notNull()
});

export const allocationsRelations = relations(allocations, ({one}) => ({
    pertTask: one(pertTasks, {
        fields: [allocations.pertId],
        references: [pertTasks.id]
    })
}))

export const allocationSchema = createSelectSchema(allocations);

export type Allocation = z.infer<typeof allocationSchema>;