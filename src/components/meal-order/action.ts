import { db } from "@/db";
import { MealOrder } from "@/components/meal-order/schema";
import { revalidatePath } from "next/cache";
import { foodOrders, FoodTypes } from "@/db/schema/food-orders";
import { eq } from "drizzle-orm";

export type FoodOrderParams = {
  idReservation: string;
};

export type FoodTypeAmounts = {
  amount: number;
  foodType: FoodTypes;
};

export type IdAmounts = {
  amount: number;
  orderId: number;
};

export const getOrdersOfReservation = async (
  params: FoodOrderParams,
): Promise<MealOrder[]> => {
  const orders = await db.query.foodOrders.findMany({
    where: (order, { eq }) =>
      eq(order.reservationId, parseInt(params.idReservation)),
  });

  revalidatePath("/", "layout");
  return orders;
};

export const createOrdersForDayInReservation = async (
  foodTypeAmounts: FoodTypeAmounts[],
  day: Date,
  reservationId: number,
) => {
  foodTypeAmounts.map(
    async (foodTypeAmount) =>
      await db.insert(foodOrders).values({
        day: day,
        amount: foodTypeAmount.amount,
        foodType: foodTypeAmount.foodType,
        reservationId: reservationId,
      }),
  );

  revalidatePath("/", "layout");
};

export const updateOrdersForDayInReservation = async (
  idAmounts: IdAmounts[],
) => {
  idAmounts.map(
    async (idAmounts) =>
      await db
        .update(foodOrders)
        .set({
          amount: idAmounts.amount,
        })
        .where(eq(foodOrders.id, idAmounts.orderId)),
  );

  revalidatePath("/", "layout");
};
