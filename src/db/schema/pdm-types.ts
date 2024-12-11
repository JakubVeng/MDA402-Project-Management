import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";
import { pdm } from "./pdm";
import { relations } from "drizzle-orm";

export const pdmTypesEnum = z.enum([
    "fs",
    "ff",
    "ss",
    "sf",
]);

export const pdmTypes = sqliteTable('PDMTypes', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    pdmType: text('pdmType', {enum: pdmTypesEnum.options}).notNull(),
});

export const pdmTypesRelations = relations(pdmTypes, ({ many }) => ({
    pdms: many(pdm)
}))

export const pdmTypeSchema = createSelectSchema(pdmTypes);

export type PDMType = z.infer<typeof pdmTypeSchema>;