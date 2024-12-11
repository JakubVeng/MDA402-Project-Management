import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";

export const practices = sqliteTable('Practices', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description'),
    isAvailable: integer('isAvailable', { mode: 'boolean'}).notNull().default(false)
});

export const practiceSchema = createSelectSchema(practices);

export type Practice = z.infer<typeof practiceSchema>;