import { relations } from "drizzle-orm";
import {integer, sqliteTable, real} from "drizzle-orm/sqlite-core";
import {createSelectSchema} from "drizzle-zod";
import { z } from "zod";
import { workPackages } from "./work-packages";
import { allocations } from "./allocations";

export const pertTasks = sqliteTable('PertTasks', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    workPackageId: integer('workPackageId').references((): any => workPackages.id),
    o: real('o').default(1).notNull(),
    m: real('m').default(1).notNull(),
    p: real('p').default(1).notNull()
});

export const pertTasksRelations = relations(pertTasks, ({ one, many }) => ({
    workPacakge: one(workPackages, {
        fields: [pertTasks.workPackageId],
        references: [workPackages.id]
    }),
    allocations: many(allocations)
}))

export const pertTaskSchema = createSelectSchema(pertTasks);

export type PertTask = z.infer<typeof pertTaskSchema>;