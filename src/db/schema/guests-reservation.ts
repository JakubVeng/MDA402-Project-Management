import {sqliteTable, integer, text} from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm/relations';
import {roomReservations} from "@/db/schema/room-reservations";
import {z} from "zod";
import {reservations, reservationSchema} from "@/db/schema/reservations";
import {createSelectSchema} from "drizzle-zod";
import { guests } from './guests';

export const guestsReservations = sqliteTable('GuestsReservations', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    guestId: integer('guestId').notNull().references(() => guests.id),
    roomReservationId: integer('roomReservationId').references(() => roomReservations.id)
});

export const guestsReservationsRelations = relations(guestsReservations, ({ one }) => ({
    roomReservation: one(roomReservations, {
        fields: [guestsReservations.roomReservationId],
        references: [roomReservations.id]
    }),
    guest: one(guests, {
        fields: [guestsReservations.guestId],
        references: [guests.id]
    })
}));

export const guestReservationSchema = createSelectSchema(guestsReservations);

export type GuestReservation = z.infer<typeof guestReservationSchema>;