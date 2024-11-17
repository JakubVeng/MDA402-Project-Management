import { MealOrderForDayForm } from "@/components/meal-order/meal-order-for-day-form";
import { getReservation } from "@/components/reservation-detail/action";
import { ReservationIdParams } from "@/app/(app)/reservation/[id]/page";
import { getOrdersOfReservation } from "@/components/meal-order/action";
import { DietOrderList } from "@/components/diet-order/diet-order-list";
import { getDietOrdersOfReservation } from "@/components/diet-order/action";
import { getGuestsFromReservation } from "@/components/create-room-reservation/action";
import { PageLink } from "@/components/page-link";
import { Metadata } from "next";
import { Button } from "@/components/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

const dayInMilliseconds = 1000 * 60 * 60 * 24;

export const metadata: Metadata = {
  title: "MR - Meals reservation",
  description: "Meals reservation page",
};

const MealsPage = async ({ params }: ReservationIdParams) => {
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

  return (
    <main className="h-[calc(100vh-50px)] container ml-16">
      <div className="p-5">
        <PageLink
          reverse={true}
          href={`/reservation/${params.id}`}
          className="rounded-xl w-36 h-14"
        >
          Back
        </PageLink>
        <div className="bg-white rounded-3xl pb-8 mb-5 mt-5 flex flex-col items-center">
          <h1 className="text-2xl text-center py-6 text-blue-600">
            Meal order of {reservation?.description}
          </h1>
          <Link href={`meals/print`}>
            <Button className="border border-gray-200 px-3 py-2 mb-5 rounded-xl w-32">
              Summary
            </Button>
          </Link>
          <div className="flex flex-wrap justify-center w-full">
            {daysArray.map((day) => {
              const date = new Date(startDate! + day * dayInMilliseconds);
              return (
                <MealOrderForDayForm
                  key={day}
                  date={date}
                  reservationId={params.id}
                  mealOrders={mealOrders.filter(
                    (x) => x.day?.getTime() === date.getTime(),
                  )}
                />
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-3xl pb-8 flex flex-col items-center">
          <h2 className="text-2xl text-center py-6 text-blue-600">
            Specific diet order
          </h2>
          <DietOrderList
            guests={guests}
            reservationId={parseInt(params.id)}
            dietOrders={dietOrders.sort((a, b) => {
              return a.id - b.id;
            })}
            startDate={reservation?.startDate!}
          />
        </div>
      </div>
    </main>
  );
};

export default MealsPage;
