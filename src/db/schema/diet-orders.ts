import { z } from "zod";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { reservations } from "@/db/schema/reservations";
import { relations } from "drizzle-orm/relations";
import { foodTypes } from "@/db/schema/food-orders";
import { guests } from "@/db/schema/guests";

export const dietListArray = ["bezlepkova", "bezlaktozova", "vegetarianska"];

export const dietList = z.enum(["bezlepkova", "bezlaktozova", "vegetarianska"]);
export type DietListSchema = z.infer<typeof dietList>;

export const foodOrderDiet = sqliteTable("foodOrderDiet", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reservationId: integer("reservationId").references(() => reservations.id),
  foodType: text("foodType", { enum: foodTypes.options }),
  day: integer("day", { mode: "timestamp" }),
  guestId: integer("guestId").references(() => guests.id),
  diet: text("diet", { enum: dietList.options }),
});

export const foodOrderDietRelations = relations(foodOrderDiet, ({ one }) => ({
  reservation: one(reservations, {
    fields: [foodOrderDiet.reservationId],
    references: [reservations.id],
  }),
  guest: one(guests, {
    fields: [foodOrderDiet.guestId],
    references: [guests.id],
  }),
}));
