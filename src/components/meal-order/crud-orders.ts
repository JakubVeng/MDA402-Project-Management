"use server";

import { MealOrder, MealOrderFormSchema } from "@/components/meal-order/schema";
import {
  createOrdersForDayInReservation,
  FoodTypeAmounts,
  IdAmounts,
  updateOrdersForDayInReservation,
} from "@/components/meal-order/action";

export const CreateOrders = async (
  foodAmounts: MealOrderFormSchema,
  reservationId: string,
  date: Date,
) => {
  const foodTypeAmounts: FoodTypeAmounts[] = [
    {
      foodType: "breakfast",
      amount: foodAmounts.breakfast,
    },
    {
      foodType: "snack",
      amount: foodAmounts.snack,
    },
    {
      foodType: "lunch",
      amount: foodAmounts.lunch,
    },
    {
      foodType: "afternoon snack",
      amount: foodAmounts.afternoonSnack,
    },
    {
      foodType: "dinner",
      amount: foodAmounts.dinner,
    },
  ];

  await createOrdersForDayInReservation(
    foodTypeAmounts,
    date,
    parseInt(reservationId),
  );
};

export const UpdateOrders = async (
  foodAmounts: MealOrderFormSchema,
  mealOrders: MealOrder[],
) => {
  const idAmounts: IdAmounts[] = [
    {
      orderId: mealOrders.filter((x) => x.foodType === "breakfast")[0].id,
      amount: foodAmounts.breakfast,
    },
    {
      orderId: mealOrders.filter((x) => x.foodType === "snack")[0].id,
      amount: foodAmounts.snack,
    },
    {
      orderId: mealOrders.filter((x) => x.foodType === "lunch")[0].id,
      amount: foodAmounts.lunch,
    },
    {
      orderId: mealOrders.filter((x) => x.foodType === "afternoon snack")[0].id,
      amount: foodAmounts.afternoonSnack,
    },
    {
      orderId: mealOrders.filter((x) => x.foodType === "dinner")[0].id,
      amount: foodAmounts.dinner,
    },
  ];

  await updateOrdersForDayInReservation(idAmounts);
};
