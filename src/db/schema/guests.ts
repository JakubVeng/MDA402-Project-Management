import {sqliteTable, integer, text} from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm/relations';
import {z} from "zod";
import {reservations} from "@/db/schema/reservations";
import {createSelectSchema} from "drizzle-zod";

export const guests = sqliteTable('Guests', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    reservationId: integer('reservationId').references(() => reservations.id)
});

export const guestsRelations = relations(guests, ({ one }) => ({
    roomReservation: one(reservations, {
        fields: [guests.reservationId],
        references: [reservations.id]
    })
}));

export const guestSchema = createSelectSchema(guests);

export type Guest = z.infer<typeof guestSchema>;