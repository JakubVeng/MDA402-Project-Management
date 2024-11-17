import { ReservationIdParams } from "@/app/(app)/reservation/[id]/page";
import { getOrdersOfReservation } from "@/components/meal-order/action";
import { getDietOrdersOfReservation } from "@/components/diet-order/action";
import { getReservation } from "@/components/reservation-detail/action";
import { Td, Th, Tr } from "@/components/table";
import { PageLink } from "@/components/page-link";
import { getGuestsFromReservation } from "@/components/create-room-reservation/action";
import { DietOrder } from "@/components/diet-order/schema";
import React from "react";
import { dietListArray } from "@/db/schema/diet-orders";
import { Print } from "@/components/meal-order-print/print-button";
import { foodTypesArray } from "@/db/schema/food-orders";
import { Metadata } from "next";
import { MealOrder } from "@/components/meal-order/schema";

export const metadata: Metadata = {
  title: "SMO - Summary of meal order",
  description: "Print summary of meal orders",
};

export const dynamic = "force-dynamic";

const dayInMilliseconds = 1000 * 60 * 60 * 24;
const PrintMealPage = async ({ params }: ReservationIdParams) => {
  const reservation = await getReservation({ id: parseInt(params.id) });
  const guests = await getGuestsFromReservation(parseInt(params.id));
  const startDate = reservation?.startDate!.getTime();
  const endDate = reservation?.endDate!.getTime();
  const durationInDays =
    startDate === undefined || endDate === undefined
      ? 0
      : Math.round((endDate - startDate) / dayInMilliseconds);
  const daysArray = Array.from({ length: durationInDays }, (_, index) => index);

  const mealOrders = await getOrdersOfReservation({
    idReservation: params.id,
  });

  const dietOrders = await getDietOrdersOfReservation({
    idReservation: params.id,
  });

  console.log("meal orders");
  console.log(mealOrders);

  const dayPrint = (date: Date, mealOrders: MealOrder[]) => {
    if (mealOrders.length === 0) {
      return (
        <>
          <Td>{date.toDateString()}</Td>
          <Td>0</Td>
          <Td>0</Td>
          <Td>0</Td>
          <Td>0</Td>
          <Td>0</Td>
        </>
      );
    }
    if (mealOrders.length !== 5)
      return (
        <>
          <Td>{date.toDateString()}</Td>
          <Td>{"Invalid data" + mealOrders.length.toString()}</Td>
        </>
      );
    return (
      <>
        <Td>{date.toDateString()}</Td>
        {foodTypesArray.map((foodType) => {
          const order = mealOrders.find((x) => x.foodType === foodType);
          return (
            <Td key={order!.id + foodType}>{"" + order?.amount?.toString()}</Td>
          );
        })}
      </>
    );
  };

  const dietPrint = (diets: DietOrder[]) => {
    return (
      <div>
        <h3 className="text-lg text-center py-6 text-blue-600">
          {guests.find((guest) => guest.id === diets[0].guestId)!.name}
        </h3>
        <table>
          <thead>
            <Tr>
              <Th>Day</Th>
              <Th>Diet</Th>
              <Th>Breakfast</Th>
              <Th>Snack</Th>
              <Th>Lunch</Th>
              <Th>Afternoon Snack</Th>
              <Th>Dinner</Th>
            </Tr>
          </thead>
          <tbody>
            {daysArray.map((day) => {
              const date = new Date(startDate! + day * dayInMilliseconds);
              date.setHours(0, 0, 0, 0);
              const dietsForDay = diets.filter((diet) => {
                const dietDate = diet.day?.setHours(0, 0, 0, 0);
                date.setHours(0, 0, 0, 0);
                return dietDate === date.getTime();
              });
              if (dietsForDay !== undefined && dietsForDay.length !== 0) {
                return dietListArray.map((d) => {
                  if (d === dietsForDay[0].diet!) {
                    return (
                      <Tr key={day + d}>
                        <Td>{"" + date.toDateString()}</Td>
                        <Td>{"" + dietsForDay[0].diet}</Td>
                        {foodTypesArray.map((foodType) => (
                          <Td key={foodType}>
                            {dietsForDay.filter((x) => x.foodType === foodType)
                              .length === 0
                              ? "0"
                              : "1"}
                          </Td>
                        ))}
                      </Tr>
                    );
                  }
                  return null; // Need to return something from the map function
                });
              }
              return null; // Need to return something from the map function
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (mealOrders.length === 0) {
    return (
      <main className="h-[calc(100vh-50px)] container ml-16">
        <PageLink
          reverse={true}
          href={`/reservation/${params.id}/meals`}
          className="rounded-xl w-36 h-14"
        >
          Back
        </PageLink>
        <h2 className="text-2xl text-center py-6 text-blue-600">
          No orders yet
        </h2>
      </main>
    );
  }

  return (
    <main className="h-[calc(100vh-50px)] container ml-16">
      <div className="p-5">
        <PageLink
          reverse={true}
          href={`/reservation/${params.id}/meals`}
          className="rounded-xl w-36 h-14"
        >
          Back
        </PageLink>
        <div className="flex flex-col items-center bg-white rounded-2xl mt-3 pb-8">
          <h2 className="text-2xl text-center py-6 text-blue-600">
            Summary of {reservation?.description} meal order
          </h2>
          <Print></Print>
          <table>
            <thead>
              <Tr>
                <Th>Day</Th>
                <Th>Breakfast</Th>
                <Th>Snack</Th>
                <Th>Lunch</Th>
                <Th>Afternoon Snack</Th>
                <Th>Dinner</Th>
              </Tr>
            </thead>
            <tbody>
              {daysArray.map((day) => {
                const date = new Date(startDate! + day * dayInMilliseconds);
                return (
                  <Tr key={day}>
                    {[
                      dayPrint(
                        date,
                        mealOrders.filter(
                          (x) => x.day?.getTime() === date.getTime(),
                        ),
                      ),
                    ]}
                  </Tr>
                );
              })}
            </tbody>
          </table>
          <h3 className="text-xl text-blue-600 my-4">
            {dietOrders.length !== 0 ? "Diets" : ""}
          </h3>
          {guests.map((guest) => {
            const diets = dietOrders.filter(
              (diet) => diet.guestId === guest.id,
            );
            if (diets.length !== 0) {
              return dietPrint(diets);
            }
          })}
        </div>
      </div>
    </main>
  );
};

export default PrintMealPage;
