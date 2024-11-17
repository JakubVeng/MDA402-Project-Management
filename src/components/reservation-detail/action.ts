'use server';

import {db} from "@/db";
import {eq, inArray} from "drizzle-orm";
import {reservations} from "@/db/schema/reservations";

export type ReservationParams = {
    id: number;
};

export const getReservation = async (params: ReservationParams) => {

    const dbReservations = await db.query.reservations.findMany();
    return dbReservations.find(
        r => r.id === params.id
    )
};

export const deleteReservation = async (reservationId : number) => {
    return db.delete(reservations).where(eq(reservations.id, reservationId));
};

export const getGuests = async (params: ReservationParams) => {

    const roomReservations = await db.query.roomReservations.findMany({
        where: (room, { eq }) => eq(room.reservationId, params.id),
    })
    if (roomReservations.length === 0) return [];
    const roomReservationIds = roomReservations.map(r => r.id);

    const guestsFromReserv = await db.query.guestsReservations.findMany({
        where: (guestReservation) => inArray(guestReservation.roomReservationId, roomReservationIds)
    });
    if (guestsFromReserv.length === 0) return [];
    const guestIds = guestsFromReserv.map(g => g.guestId)

    return db.query.guests.findMany({
        where: (guest) => inArray(guest.id, guestIds)
    });
};

export const getRoomsForReservation = async (reservationId: number) => {
    return db.query.roomReservations.findMany({
        where: (room) => eq(room.reservationId, reservationId)
    });
};

export const getRoomForGuest = async(guestId: number) => {
    const guest = await db.query.guestsReservations.findFirst({
        where: (guest) => eq(guest.guestId, guestId)
    });

    if (!guest || !guest.roomReservationId) {
        return null;
    }

    const roomReservations = await db.query.roomReservations.findMany();
    const roomReservation = roomReservations.find(r => r.id === guest.roomReservationId);

    if (!roomReservation || !roomReservation.roomId) {
        return null;
    }

    return roomReservation || null;
}