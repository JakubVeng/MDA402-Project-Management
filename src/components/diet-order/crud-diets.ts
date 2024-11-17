"use server";

import {
  createDietForReservation,
  deleteDiet,
  updateDiet,
} from "@/components/diet-order/action";
import { DietOrderFormSchema } from "@/components/diet-order/schema";
import { FoodTypes } from "@/db/schema/food-orders";
import { DietListSchema } from "@/db/schema/diet-orders";

export const UpdateDiet = async ({
  dietId,
  values,
}: {
  dietId: number;
  values: DietOrderFormSchema;
}) => {
  const day = new Date(values.date);
  await updateDiet({
    dietId,
    diet: values.diet as DietListSchema,
    day,
    guestId: parseInt(values.guestId),
    foodType: values.foodType as FoodTypes,
  });
};

export const CreateDiet = async ({
  reservationId,
  values,
}: {
  reservationId: number;
  values: DietOrderFormSchema;
}) => {
  const day = new Date(values.date);
  await createDietForReservation({
    reservationId,
    day,
    diet: values.diet as DietListSchema,
    foodType: values.foodType as FoodTypes,
    guestId: parseInt(values.guestId),
  });
};

export const DeleteDiet = async ({ dietId }: { dietId: number }) => {
  await deleteDiet({ dietId });
};
