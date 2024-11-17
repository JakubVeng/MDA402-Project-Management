"use client";

import { DietOrder } from "@/components/diet-order/schema";
import { DietOrderElement } from "@/components/diet-order/diet-order-element";
import { Button } from "@/components/button";
import { useState } from "react";
import { DeleteDiet } from "@/components/diet-order/crud-diets";

export const DietOrderList = ({
  dietOrders,
  guests,
  reservationId,
  startDate,
}: {
  dietOrders: DietOrder[];
  guests: { id: number; reservationId: number | null; name: string | null }[];
  reservationId: number;
  startDate: Date;
}) => {
  const [dietElements, setDietElements] = useState<(DietOrder | null)[]>([
    ...dietOrders,
  ]);

  let newKey = 0;

  const onDelete = async (diet: DietOrder | null) => {
    if (diet === null) {
      const index = dietElements.indexOf(null);
      const newElements = dietElements.slice(index, index + 1);
      setDietElements((prevDietElements) => {
        return [
          ...prevDietElements.slice(0, index),
          ...prevDietElements.slice(index + 1),
        ];
      });
    } else {
      const newElements = dietElements.filter(
        (dietElement) => dietElement !== diet,
      );
      setDietElements(() => {
        return newElements;
      });
    }
    if (diet !== null) await DeleteDiet({ dietId: diet.id });
  };

  const pushNewDietElement = () => {
    setDietElements([...dietElements, null]);
  };

  return (
    <>
      <Button
        onClick={() => pushNewDietElement()}
        className="border border-gray-200 px-3 py-2 rounded-xl w-32"
      >
        Add Diet
      </Button>
      <div className="flex flex-wrap ml-5 w-full">
        {dietElements.map((diet) => {
          return (
            <div
              key={diet === null ? "diet" + newKey++ : diet.id}
              className="pl-5 py-6"
            >
              <DietOrderElement
                diet={diet}
                guests={guests}
                reservationId={reservationId}
                startDate={startDate}
              />
              <button
                type={"button"}
                onClick={async () => await onDelete(diet)}
                className="text-red-600 border border-gray-200 px-3 py-2 rounded-xl w-24"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};
