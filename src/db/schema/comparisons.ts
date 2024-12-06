import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";

export const comparisons = sqliteTable('Comparisons', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    prince2: integer('prince2').notNull(),
    pmbok: integer('pmbok').notNull(),
    ipma: integer('ipma').notNull(),
    unifiedProcess: integer('unifiedProcess').notNull(),
    scrum: integer('scrum').notNull(),
});

export const comparisonSchema = createSelectSchema(comparisons);

export type Comparison = z.infer<typeof comparisonSchema>;