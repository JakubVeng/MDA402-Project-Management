import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { z } from "zod";
import { relations } from "drizzle-orm/relations";
import { reservations } from "@/db/schema/reservations";

export const foodTypesArray = [
  "breakfast",
  "snack",
  "lunch",
  "afternoon snack",
  "dinner",
];
export const foodTypes = z.enum([
  "breakfast",
  "snack",
  "lunch",
  "afternoon snack",
  "dinner",
]);

export type FoodTypes = z.infer<typeof foodTypes>;

export const foodOrders = sqliteTable("foodOrders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reservationId: integer("reservationId").references(() => reservations.id),
  foodType: text("foodType", { enum: foodTypes.options }),
  amount: integer("amount"),
  day: integer("day", { mode: "timestamp" }),
});

export const foodOrdersRelations = relations(foodOrders, ({ one }) => ({
  reservation: one(reservations, {
    fields: [foodOrders.reservationId],
    references: [reservations.id],
  }),
}));
