"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MealOrder,
  MealOrderFormSchema,
  mealOrderFormSchema,
} from "@/components/meal-order/schema";
import { FormInput } from "@/components/form-input";
import {
  CreateOrders,
  UpdateOrders,
} from "@/components/meal-order/crud-orders";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useCreateMealOrderMutation = (reservationId: string, date: Date) =>
  useMutation({
    mutationFn: async (data: MealOrderFormSchema) => {
      await CreateOrders(data, reservationId, date);
      return;
    },
  });

const useUpdateMealOrderMutation = (mealOrders: MealOrder[]) =>
  useMutation({
    mutationFn: async (data: MealOrderFormSchema) => {
      await UpdateOrders(data, mealOrders);
      return;
    },
  });

export const MealOrderForDayForm = ({
  reservationId,
  mealOrders,
  date,
}: {
  reservationId: string;
  mealOrders: MealOrder[];
  date: Date;
}) => {
  const form = useForm<MealOrderFormSchema>({
    resolver: zodResolver(mealOrderFormSchema),
  });
  const createMealOrder = useCreateMealOrderMutation(reservationId, date);
  const updateMealOrder = useUpdateMealOrderMutation(mealOrders);

  const router = useRouter();

  const onChange = async (value: MealOrderFormSchema) => {
    if (mealOrders.length === 0) {
      createMealOrder.mutate(value, {
        onSuccess: () => {
          router.refresh();
        },
      });
    } else {
      updateMealOrder.mutate(value, {
        onSuccess: () => {
          router.refresh();
        },
      });
    }
  };

  return (
    <div className="pr-4 border-gray-200 p-4 m-2 rounded-2xl border">
      <h2 className="text-xl pb-2">{date.toDateString()}</h2>
      <FormProvider {...form}>
        <form onChange={form.handleSubmit(onChange)}>
          <FormInput
            label="Breakfast"
            name="breakfast"
            type="number"
            className="w-40 appearance-none px-1 border border-gray-200"
            disabled={createMealOrder.isPending || updateMealOrder.isPending}
            defaultValue={(() => {
              const filter = mealOrders.find((x) => x.foodType === "breakfast");
              return filter ? filter.amount! : 0;
            })()}
          />
          <FormInput
            label="Snack"
            name="snack"
            type="number"
            className="w-40 appearance-none px-1 border border-gray-200"
            disabled={createMealOrder.isPending || updateMealOrder.isPending}
            defaultValue={(() => {
              const filter = mealOrders.find((x) => x.foodType === "snack");
              return filter ? filter.amount! : 0;
            })()}
          />
          <FormInput
            label="Lunch"
            name="lunch"
            type="number"
            className="w-40 appearance-none px-1 border border-gray-200"
            disabled={createMealOrder.isPending || updateMealOrder.isPending}
            defaultValue={(() => {
              const filter = mealOrders.find((x) => x.foodType === "lunch");
              return filter ? filter.amount! : 0;
            })()}
          />
          <FormInput
            label="Afternoon Snack"
            name="afternoonSnack"
            type="number"
            className="w-40 appearance-none px-1 border border-gray-200"
            disabled={createMealOrder.isPending || updateMealOrder.isPending}
            defaultValue={(() => {
              const filter = mealOrders.find(
                (x) => x.foodType === "afternoon snack",
              );
              return filter ? filter.amount! : 0;
            })()}
          />
          <FormInput
            label="Dinner"
            name="dinner"
            type="number"
            className="w-40 appearance-none px-1 border border-gray-200"
            disabled={createMealOrder.isPending || updateMealOrder.isPending}
            defaultValue={(() => {
              const filter = mealOrders.find((x) => x.foodType === "dinner");
              return filter ? filter.amount! : 0;
            })()}
          />
        </form>
      </FormProvider>
    </div>
  );
};
