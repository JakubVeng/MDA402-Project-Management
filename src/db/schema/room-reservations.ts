import {sqliteTable, integer} from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm/relations';
import {rooms} from "@/db/schema/rooms";
import {reservations} from "@/db/schema/reservations";
import {guestsReservations} from "@/db/schema/guests-reservation";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";

export const roomReservations = sqliteTable('RoomReservations', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    roomId: integer('roomId').references(() => rooms.id),
    reservationId: integer('reservationId').references(() => reservations.id)
});

export const roomReservationRelations = relations(roomReservations, ({ many, one }) => ({
    guestsReservations: many(guestsReservations),
    reservation: one(reservations, {
        fields: [roomReservations.reservationId],
        references: [reservations.id]
    }),
    room: one(rooms, {
        fields: [roomReservations.roomId],
        references: [rooms.id]
    })
}));

export const roomReservationSchema = createSelectSchema(roomReservations);

export type RoomReservation = z.infer<typeof roomReservationSchema>;
