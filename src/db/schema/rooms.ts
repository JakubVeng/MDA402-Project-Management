import {integer, sqliteTable} from "drizzle-orm/sqlite-core";
import {relations} from "drizzle-orm/relations";
import {roomReservations} from "@/db/schema/room-reservations";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";

export const rooms = sqliteTable('Room', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    capacity: integer('capacity').notNull()
});

export const roomsRelations = relations(rooms, ({ many }) => ({
    roomReservations: many(roomReservations)
}));

export const roomSchema = createSelectSchema(rooms);

export type Room = z.infer<typeof roomSchema>;