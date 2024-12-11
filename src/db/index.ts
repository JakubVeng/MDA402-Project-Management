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
import { userRelations, users } from "./schema/users";
import { userRoleRelations, userRoles } from "./schema/users-roles";
import { comparisons } from "./schema/comparisons";
import { userToRoles, userToRolesRelations } from "./schema/user-to-roles";
import { workPackages, workPackagesRelations } from "./schema/work-packages";
import { pertTasks, pertTasksRelations } from "./schema/pert-tasks";
import { projects } from "./schema/projects";
import { allocations, allocationsRelations } from "./schema/allocations";
import { pdm, pdmRelations } from "./schema/pdm";
import { pdmTypes, pdmTypesRelations } from "./schema/pdm-types";

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
    users,
    userRoles,
    comparisons,
    userToRoles,
    projects,
    workPackages,
    pertTasks,
    allocations,
    pdm,
    pdmTypes,

    // relations
    userRelations,
    userRoleRelations,
    userToRolesRelations,
    workPackagesRelations,
    pertTasksRelations,
    allocationsRelations,
    pdmRelations,
    pdmTypesRelations,
    foodOrdersRelations,
    foodOrderDietRelations,
    guestsRelations,
    roomReservationRelations,
    roomsRelations,
    reservationRelations,
    guestsReservationsRelations,
  },
});
