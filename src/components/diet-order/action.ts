import { FoodOrderParams } from "@/components/meal-order/action";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { DietOrder } from "@/components/diet-order/schema";
import { DietListSchema, foodOrderDiet } from "@/db/schema/diet-orders";
import { eq } from "drizzle-orm";
import { FoodTypes } from "@/db/schema/food-orders";

export const getDietOrdersOfReservation = async (
  params: FoodOrderParams,
): Promise<DietOrder[]> => {
  const diets = await db.query.foodOrderDiet.findMany({
    where: (diet, { eq }) =>
      eq(diet.reservationId, parseInt(params.idReservation)),
  });

  revalidatePath("/", "layout");
  return diets;
};

export const updateDiet = async ({
  dietId,
  diet,
  day,
  guestId,
  foodType,
}: {
  dietId: number;
  diet: DietListSchema;
  day: Date;
  guestId: number;
  foodType: FoodTypes;
}) => {
  await db
    .update(foodOrderDiet)
    .set({
      diet,
      day,
      guestId,
      foodType,
    })
    .where(eq(foodOrderDiet.id, dietId));

  revalidatePath("/", "layout");
};

export const createDietForReservation = async ({
  reservationId,
  day,
  foodType,
  diet,
  guestId,
}: {
  reservationId: number;
  day: Date;
  foodType: FoodTypes;
  diet: DietListSchema;
  guestId: number;
}) => {
  await db.insert(foodOrderDiet).values({
    day,
    foodType,
    reservationId,
    diet,
    guestId,
  });

  revalidatePath("/", "layout");
};

export const deleteDiet = async ({ dietId }: { dietId: number }) => {
  await db.delete(foodOrderDiet).where(eq(foodOrderDiet.id, dietId));
  revalidatePath("/", "layout");
};
