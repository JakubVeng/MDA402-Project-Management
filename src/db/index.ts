import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { reservationRelations, reservations } from "@/db/schema/reservations";
import {
  guestsReservations,
  guestsReservationsRelations,
} from "@/db/schema/guests-reservation";
import { guests, guestsRelations } from "@/db/schema/guests";
import { foodOrders, foodOrdersRelations } from "@/db/schema/food-orders";
import {
  roomReservationRelations,
  roomReservations,
} from "@/db/schema/room-reservations";
import { rooms, roomsRelations } from "@/db/schema/rooms";
import { foodOrderDiet, foodOrderDietRelations } from "@/db/schema/diet-orders";
import { lectures } from "@/db/schema/lectures";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.AUTH_TOKEN,
});

export const db = drizzle(client, {
  schema: {
    rooms,
    foodOrders,
    foodOrderDiet,
    roomReservations,
    reservations,
    guests,
    guestsReservations,
    lectures,

    // relations
    foodOrdersRelations,
    foodOrderDietRelations,
    guestsRelations,
    roomReservationRelations,
    roomsRelations,
    reservationRelations,
    guestsReservationsRelations,
  },
});
