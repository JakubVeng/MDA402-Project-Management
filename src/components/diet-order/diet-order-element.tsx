"use client";

import {
  DietOrder,
  dietOrderFormSchema,
  DietOrderFormSchema,
} from "@/components/diet-order/schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/form-input";
import { Select } from "@/components/select";
import { foodTypes } from "@/db/schema/food-orders";
import { dietList } from "@/db/schema/diet-orders";
import { CreateDiet, UpdateDiet } from "@/components/diet-order/crud-diets";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { MealOrderFormSchema } from "@/components/meal-order/schema";
import { CreateOrders } from "@/components/meal-order/crud-orders";

const useCreateDietOrderMutation = (reservationId: number) =>
  useMutation({
    mutationFn: async (data: DietOrderFormSchema) => {
      await CreateDiet({ reservationId, values: data });
      return;
    },
  });

const useUpdateDietOrderMutation = (dietId: number) =>
  useMutation({
    mutationFn: async (data: DietOrderFormSchema) => {
      await UpdateDiet({ dietId, values: data });
      return;
    },
  });

export const DietOrderElement = ({
  diet,
  guests,
  reservationId,
  startDate,
}: {
  diet: DietOrder | null;
  guests: { id: number; name: string | null; reservationId: number | null }[];
  reservationId: number;
  startDate: Date;
}) => {
  const form = useForm<DietOrderFormSchema>({
    resolver: zodResolver(dietOrderFormSchema),
  });

  const createDietOrder = useCreateDietOrderMutation(reservationId);
  const updateDietOrder = useUpdateDietOrderMutation(
    diet !== null ? diet.id : 0,
  );

  const router = useRouter();

  const onChange = async (value: DietOrderFormSchema) => {
    if (diet === null) {
      createDietOrder.mutate(value, {
        onSuccess: () => {
          router.refresh();
        },
      });
    } else {
      updateDietOrder.mutate(value, {
        onSuccess: () => {
          router.refresh();
        },
      });
    }
  };

  const foodType = diet === null ? undefined : diet.foodType!;
  const guest =
    diet === null
      ? undefined
      : guests.find((guest) => guest.id === diet.guestId);
  const choseDiet = diet === null ? undefined : diet.diet!;

  return (
    <>
      <div className="pr-4 w-60">
        <FormProvider {...form}>
          <form onChange={form.handleSubmit(onChange)}>
            <FormInput
              label=""
              name="date"
              type="date"
              defaultValue={
                diet?.day
                  ? new Date(diet.day).toISOString().split("T")[0]
                  : startDate.toISOString().split("T")[0]
              }
              disabled={createDietOrder.isPending || updateDietOrder.isPending}
            />
            <Select
              defaultValue={guest?.id!.toString()}
              name="guestId"
              displayName="Guest"
              optionsName={guests.map((guest) => guest.name!)}
              optionsId={guests.map((guest) => guest.id!)}
              disabled={createDietOrder.isPending || updateDietOrder.isPending}
            />
            <Select
              displayName="Meal type"
              defaultValue={foodType}
              name="foodType"
              optionsName={foodTypes.options}
              disabled={createDietOrder.isPending || updateDietOrder.isPending}
            />
            <Select
              displayName="Diet type"
              defaultValue={choseDiet}
              name="diet"
              optionsName={dietList.options}
              disabled={createDietOrder.isPending || updateDietOrder.isPending}
            />
          </form>
        </FormProvider>
      </div>
      <p className="text-green-500 pb-3">
        {diet !== null || createDietOrder.isSuccess ? "saved" : ""}
      </p>
    </>
  );
};
