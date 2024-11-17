'use server';

import { revalidatePath } from 'next/cache';
import {db} from "@/db";
import {Reservation, reservations} from "@/db/schema/reservations";
import {eq} from "drizzle-orm";

export const createReservationAction = async (reservation: Reservation) => {

    reservation.startDate?.setHours(15, 0, 0, 0);
    reservation.endDate?.setHours(10, 0, 0, 0);

    await db.insert(reservations).values({
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        description: reservation.description
    })

    revalidatePath('/', 'layout');
    return {};
};

export const updateReservationAction = async (reservation: Reservation & { reservationId: number }) => {
    const { reservationId, ...data } = reservation;
    data.startDate?.setHours(15, 0, 0, 0);
    data.endDate?.setHours(10, 0, 0, 0);

    await db.update(reservations).set({
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description
    }).where(eq(reservations.id, reservationId));

    revalidatePath('/', 'layout');
    return {};
}