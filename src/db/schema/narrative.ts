import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";

export const narrative = sqliteTable('Narrative', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    type: text('type').notNull(),
    narrative: text('narrative'),
});

export const narrativeSchema = createSelectSchema(narrative);

export type Narrative = z.infer<typeof narrativeSchema>;