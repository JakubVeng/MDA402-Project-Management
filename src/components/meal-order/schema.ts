import { z } from "zod";
import { foodTypes } from "@/db/schema/food-orders";

export const mealOrderFormSchema = z.object({
  breakfast: z.number().gte(0),
  snack: z.number().gte(0),
  lunch: z.number().gte(0),
  afternoonSnack: z.number().gte(0),
  dinner: z.number().gte(0),
});

export type MealOrderFormSchema = z.infer<typeof mealOrderFormSchema>;

export const mealOrder = z.object({
  id: z.number(),
  reservationId: z.number().nullable(),
  foodType: foodTypes.nullable(),
  amount: z.number().nullable(),
  day: z.date().nullable(),
});

export type MealOrder = z.infer<typeof mealOrder>;
