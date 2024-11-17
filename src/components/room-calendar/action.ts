import {db} from "@/db";

export const getReservations = async () => {
    const result = await db.query.reservations.findMany();
    return result;
}

export const getRoomReservations = async () => {
    const result = await db.query.roomReservations.findMany();
    return result;
}

export const getRooms = async () => {
    const result = await db.query.rooms.findMany();
    return result;
}