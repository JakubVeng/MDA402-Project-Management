import { relations } from "drizzle-orm";
import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";
import { pertTasks } from "./pert-tasks";
import { pdmTypes } from "./pdm-types";

export const pdm = sqliteTable('PDM', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    predecessorId: integer('predecessorId').notNull().references(() => pertTasks.id),
    successorId: integer('successorId').notNull().references(() => pertTasks.id),
    pdmTypeId: integer('pdmTypeId').notNull().references(() => pdmTypes.id)
});

export const pdmRelations = relations(pdm, ({ one }) => ({
    predecessor: one(pertTasks, {
        fields: [pdm.predecessorId],
        references: [pertTasks.id]
    }),
    successor: one(pertTasks, {
        fields: [pdm.successorId],
        references: [pertTasks.id]
    }),
    pdmType: one(pdmTypes, {
        fields: [pdm.pdmTypeId],
        references: [pdmTypes.id]
    })
}))

export const pdmSchema = createSelectSchema(pdm);

export type PDM = z.infer<typeof pdmSchema>;