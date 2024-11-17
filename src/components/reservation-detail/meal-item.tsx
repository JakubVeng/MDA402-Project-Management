import {PlusCircle, Utensils} from "lucide-react";
import Link from "next/link";
import {getReservation} from "@/components/reservation-detail/action";
import {ReservationIdParams} from "@/app/(app)/reservation/[id]/page";

export default async function MealItem({params}: ReservationIdParams)  {
    const reservation = await getReservation({ id: parseInt(params.id) });

    return (
        <>
            <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center w-1/2">
                <h2 className="self-start text-xl text-slate-500">Meals <Utensils className="text-black"/></h2>
                <Link className="text-4xl p-4 rounded-full bg-blue-500 text-white transition duration-200 ease-in-out hover:shadow-sm hover:shadow-blue-300 hover:bg-blue-600"
                      href={`/reservation/${reservation?.id}/meals`}>
                    <PlusCircle/>
                </Link>
            </div>
        </>
    )
}