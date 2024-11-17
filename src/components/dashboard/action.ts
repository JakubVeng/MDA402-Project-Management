'use server';

import { revalidatePath } from 'next/cache';
import {db} from "@/db";
import {reservations} from "@/db/schema/reservations";
import {and, eq, gt, gte, inArray, lte} from "drizzle-orm";

export const getTodayReservation = async () => {

    const currentTimestamp = new Date();

    console.log(currentTimestamp);
    const todayReservations = await db.select().from(reservations)
        .where(
            and(lte(reservations.startDate, currentTimestamp), gt(reservations.endDate, currentTimestamp))
        );
    revalidatePath('/', 'layout');
    return todayReservations;
};

export const getTodayCheckIns = async () => {
    const currentTimestamp = new Date().setHours(0, 0, 0, 0);
    const currentDate: Date = new Date(currentTimestamp);

    const todayReservations = await db.select().from(reservations)
        .where(
            and(eq(reservations.startDate, currentDate))
        );
    revalidatePath('/', 'layout');
    return todayReservations;
};

export const getRoomReservations = async (date: Date) => {

    const timestamp = date.setHours(0, 0, 0, 0);
    const wantedDate: Date = new Date(timestamp);

    const wantedReservations = await db.select().from(reservations)
        .where(
            and(lte(reservations.startDate, wantedDate), gte(reservations.endDate, wantedDate))
        );

    if (wantedReservations.length === 0) return [];
    const reservationIds = wantedReservations.map(r => r.id);

    return db.query.roomReservations.findMany({
        where: (room) => inArray(room.reservationId, reservationIds)
    });
};

export const getTotalRoomsCount = async () => {

    const rooms = await db.query.rooms.findMany();
    return rooms.length;
};