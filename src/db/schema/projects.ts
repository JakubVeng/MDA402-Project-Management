import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";

export const projects = sqliteTable('Projects', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description'),
    prince2: integer('prince2', { mode: 'boolean'}).notNull().default(false),
    pmbok: integer('pmbok', { mode: 'boolean'}).notNull().default(false),
    ipma: integer('ipma', { mode: 'boolean'}).notNull().default(false),
    unifiedProcess: integer('unifiedProcess', { mode: 'boolean'}).notNull().default(false),
    scrum: integer('scrum', { mode: 'boolean'}).notNull().default(false)
});

export const projectSchema = createSelectSchema(projects);

export type Project = z.infer<typeof projectSchema>;