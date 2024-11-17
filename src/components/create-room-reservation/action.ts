"use server";

import { db } from "@/db";
import { guests } from "@/db/schema/guests";
import { reservations } from "@/db/schema/reservations";
import { roomReservations } from "@/db/schema/room-reservations";
import { rooms } from "@/db/schema/rooms";
import { and, eq, gt, lt, notInArray, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { guestsReservations } from "@/db/schema/guests-reservation";
import { AddGuestsFormSchema } from "./schema";
import { getRoomsForReservation } from "@/components/reservation-detail/action";
import { type GuestRoomReservation } from "./create-room-reservation";

export const getFreeRoomsForReservation = async (reservationId: number) => {
  	const reservation = await db
    	.select()
    	.from(reservations)
    	.where(eq(reservations.id, reservationId));

  	const occRooms = await db
    	.select({
      	roomId: roomReservations.roomId,
    	})
    	.from(roomReservations)
    	.innerJoin(
      		reservations,
      		eq(roomReservations.reservationId, reservations.id),
    	)
    	.where(
      		and(
        		lt(reservations.startDate, reservation[0].endDate),
        		gt(reservations.endDate, reservation[0].startDate),
      		),
    	);

  	const occupiedRoomIds: number[] = occRooms.map((room) => room.roomId).filter((id) => id !== null) as number[];

  	if (occupiedRoomIds.length > 0) {
    	return db.select().from(rooms).where(notInArray(rooms.id, occupiedRoomIds));
  	} else {
    	return db.select().from(rooms);
  	}
};

export const getRoomsFromReservation = async (reservationId: number) => {
  	const roomsFromReserv = await getRoomsForReservation(reservationId);

  	const roomIds: number[] = roomsFromReserv.map((room) => room.roomId).filter((id) => id !== null) as number[];

  	if (roomIds.length > 0) {
    	return db.select().from(rooms).where(inArray(rooms.id, roomIds));
 	} else {
    	return [];
  	}
};

type addGuestsToReservationProps = {
  values: AddGuestsFormSchema;
  reservationId: number;
};

export const addGuestsToReservation = async ({
  values,
  reservationId,
}: addGuestsToReservationProps) => {
  const guestsReserv = values.names.map((name) => ({
    reservationId: reservationId,
    ...name,
  }));

  await db.insert(guests).values(guestsReserv);

  revalidatePath(`/reservation/${reservationId}/rooms`);
  return {};
};

export const deleteGuestsFromReservation = async (reservationId: number) => {
  await db.delete(guests).where(eq(guests.reservationId, reservationId));

  revalidatePath(`/reservation/${reservationId}/rooms`);
  return {};
};

export const getGuestsFromReservation = async (reservationId: number) => {
  const guestFromReserv = await db
    .select()
    .from(guests)
    .where(eq(guests.reservationId, reservationId));
  return guestFromReserv;
};

export const getGuestsFromRoomReservation = async (reservationId: number) => {
  const roomReservs = await db
    .select({
      roomReservationId: roomReservations.id,
    })
    .from(roomReservations)
    .where(eq(roomReservations.reservationId, reservationId));

  const roomReservsIds: number[] = roomReservs
    .map((rr) => rr.roomReservationId)
    .filter((id) => id !== null) as number[];

  if (roomReservsIds.length > 0) {
    const guestFromReserv = await db
      .select({
		id: guests.id,
		name: guests.name,
		roomReservationId: guestsReservations.roomReservationId,
	  })
      .from(guests)
	  .innerJoin(
		guestsReservations,
		eq(guests.id, guestsReservations.guestId))
      .where(inArray(guestsReservations.roomReservationId, roomReservsIds));

    if (guestFromReserv.length > 0) {
      return guestFromReserv;
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const getAllGuestsFromReservation = async (reservationId: number) => {
	const allGuests = await db.select({
		id: guests.id,
		name: guests.name,
		roomId: roomReservations.roomId,
	  })
		.from(guests)
		.leftJoin(
			guestsReservations, 
			eq(guests.id, guestsReservations.guestId)
		)
		.leftJoin(
		  roomReservations,
		  eq(guestsReservations.roomReservationId, roomReservations.id)
		)
		.where(eq(guests.reservationId, reservationId));
	
	return allGuests
};

export const addGuestToRoom = async (
  guestRoomReservation: GuestRoomReservation,
) => {
  const roomRe = await db
    .select()
    .from(roomReservations)
    .where(
      and(
        eq(roomReservations.reservationId, guestRoomReservation.reservationId),
        eq(roomReservations.roomId, guestRoomReservation.roomId),
      ),
    );

  if (roomRe.length === 0) {
    const roomReserv = {
      reservationId: guestRoomReservation.reservationId,
      roomId: guestRoomReservation.roomId,
    };
    const roomReservId = await db
      .insert(roomReservations)
      .values(roomReserv)
      .returning({ insertedId: roomReservations.id });
    await db.insert(guestsReservations).values({
      guestId: guestRoomReservation.guestId,
      roomReservationId: roomReservId[0].insertedId,
    });
  } else {
    await db.insert(guestsReservations).values({
      guestId: guestRoomReservation.guestId,
      roomReservationId: roomRe[0].id,
    });
  }

  revalidatePath(`/reservation/${guestRoomReservation.reservationId}`);
  revalidatePath("/", "layout");
};

export const deleteGuestsFromRooms = async (
	reservationId: number,
) => {
  const roomReserv = await db.select({id: roomReservations.id}).from(roomReservations).where(eq(roomReservations.reservationId, reservationId))
  const roomReservIds : number[] = roomReserv.map(item => item.id)

  await db
    .delete(guestsReservations)
    .where(inArray(guestsReservations.roomReservationId, roomReservIds));
  await db
    .delete(roomReservations)
    .where(eq(roomReservations.reservationId, reservationId));

  revalidatePath(`/reservation/${reservationId}`);
  revalidatePath("/", "layout");
};
