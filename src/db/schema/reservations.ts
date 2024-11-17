import {sqliteTable, integer, text} from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm/relations';
import {roomReservations} from "@/db/schema/room-reservations";
import {foodOrders} from "@/db/schema/food-orders";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";
import { guests } from '@/db/schema/guests';

export const reservations = sqliteTable('Reservation', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    description: text('description'),
    startDate: integer('startDate', { mode: 'timestamp' }).notNull(),
    endDate: integer('endDate', { mode: 'timestamp' }).notNull()
});

export const reservationRelations = relations(reservations, ({ many }) => ({
    roomReservations: many(roomReservations),
    foodOrders: many(foodOrders),
    guests: many(guests)
}));

export const reservationSchema = createSelectSchema(reservations);

export type Reservation = z.infer<typeof reservationSchema>;
