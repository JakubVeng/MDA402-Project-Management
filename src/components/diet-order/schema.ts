import { z } from "zod";
import { foodTypes } from "@/db/schema/food-orders";
import { dietList } from "@/db/schema/diet-orders";

export const dietOrderFormSchema = z.object({
  foodType: z.string(),
  date: z.string(),
  diet: z.string(),
  guestId: z.string(),
});
export type DietOrderFormSchema = z.infer<typeof dietOrderFormSchema>;

export const dietOrder = z.object({
  id: z.number(),
  reservationId: z.number().nullable(),
  foodType: foodTypes.nullable(),
  day: z.date().nullable(),
  guestId: z.number().nullable(),
  diet: dietList.nullable(),
});

export type DietOrder = z.infer<typeof dietOrder>;
