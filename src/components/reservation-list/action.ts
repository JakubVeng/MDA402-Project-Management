'use server';

import { revalidatePath } from 'next/cache';
import {db} from "@/db";

export const getReservationsAction = async () => {
    const reservations = await db.query.reservations.findMany();

    if (!reservations) {
        return { error: 'No reservations found' };
    }

    revalidatePath('/', 'layout');
    return { reservations };
};
