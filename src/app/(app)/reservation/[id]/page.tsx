import {getGuests} from "@/components/reservation-detail/action";
import ReservationDetailBar from "@/components/reservation-detail/reservation-detail-bar";
import MealItem from "@/components/reservation-detail/meal-item";
import RoomsItem from "@/components/reservation-detail/rooms-item";
import {PageLink} from "@/components/page-link";
import React from "react";
import {Metadata} from "next";

export type ReservationIdParams = {
    params: { id: string };
};

export const metadata: Metadata = {
    title: 'RM - Reservation detail',
    description: 'Reservation detail page'
};

export default async function ReservationDetailPage({ params }: ReservationIdParams) {

    const guests = await getGuests({id: parseInt(params.id)});
    return (
        <main className="flex flex-col h-[calc(100vh-50px)] p-10 w-full">
            <div className="flex w-1/2 flex-col gap-y-2 mb-4 md:w-1/6">
                <PageLink href="/" reverse={true}>Home</PageLink>
            </div>
            <div className="flex flex-row w-full justify-center gap-8">
                <ReservationDetailBar params={params}/>
            </div>
            <div className="flex flex-row flex-grow justify-center mt-8 gap-8 h-auto"> {/* New row for large boxes */}
                <MealItem params={params}/>
                <RoomsItem params={params}/>
            </div>
        </main>
    );
}
