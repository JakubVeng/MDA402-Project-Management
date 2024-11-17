'use server';

import { db } from '@/db';
import { rooms } from '@/db/schema/rooms';
import {revalidatePath} from "next/cache";
import {eq} from "drizzle-orm";
import {reservations} from "@/db/schema/reservations";
import { roomReservations } from '@/db/schema/room-reservations';
import { getRoomReservations } from '../dashboard/action';


export const getRooms = async () => {
    return db.select().from(rooms);
};

export const addRoom = async (capacity: number) => {
    if (capacity <= 0) {
        throw new Error('Invalid capacity');
    }

    await db.insert(rooms).values({ capacity });
    revalidatePath('/', 'layout');

    return {};
};

export const updateRoomCapacity = async (id: number, capacity: number) => {
    if (capacity <= 0) {
        throw new Error('Invalid capacity');
    }

    const occRooms = await getRoomReservations(new Date())
    const room = await db.select().from(rooms).where(eq(rooms.id, id))

    if (occRooms.some(r => r.roomId === id) && capacity < room[0].capacity) {
        throw new Error('Cannot decrease capacity of occupied room')
    }

    await db.update(rooms).set({ capacity }).where(eq(rooms.id, id));

    revalidatePath('/', 'layout');

    return {};
};
