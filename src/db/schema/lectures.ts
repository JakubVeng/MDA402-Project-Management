import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";

export const lectures = sqliteTable('Lectures', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderedItem: integer('orderedItem').unique().notNull(),
    name: text('name').notNull(),
    description: text('description'),
    isAvailable: integer('isAvailable', { mode: 'boolean'}).notNull().default(false),
    url: text('url')
});

export const lectureSchema = createSelectSchema(lectures);

export type Lecture = z.infer<typeof lectureSchema>;