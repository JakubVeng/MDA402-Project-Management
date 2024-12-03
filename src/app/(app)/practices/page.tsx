import Link from "next/link";
import {CurrentDate} from "@/components/dashboard/current-date";
import {getTodayReservation} from "@/components/dashboard/action";
import ReservationsTable from "@/components/dashboard/reservations-table";
import {Reservation} from "@/db/schema/reservations";
import {CreateReservationForm} from "@/components/create-reservation/create-reservation-form";
import {ReservationDialog} from "@/components/reservation-detail/reservation-dialog";
import React from "react";
import {Bed, Calendar, List} from "lucide-react";

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'RM - Home',
    description: 'Home page'
};

export default async function Home() {
    const reservations : Reservation[] = await getTodayReservation();

    return (
        <main className="flex flex-col min-h-screen p-10 w-screen">
            <div className="flex md:flex-row flex-col w-full justify-between">
                <div className="flex flex-col space-y-4">
                    <CurrentDate />
                </div>
                <div className="flex flex-col space-y-4"> {/* Right column */}
                    <ReservationDialog create={true}>
                        <CreateReservationForm initialData={null}/>
                    </ReservationDialog>
                    <Link href="/reservation/list" className="bg-blue-300 text-black text-center rounded-xl p-4 mb-4 flex flex-row gap-1"> {/* Link box */}
                        <List />
                        Show all reservations
                    </Link>
                    <Link href="/reservation/calendar" className="bg-blue-300 text-black text-center rounded-xl p-4 mb-4 flex flex-row gap-1"> {/* Link box */}
                        <Calendar />
                        Show calendar
                    </Link>
                    <Link href="/manage" className="bg-white text-black text-center rounded-xl p-4 mb-4 flex flex-row gap-1"> {/* Link box */}
                        <Bed />
                        Manage accomodation
                    </Link>
                </div>
            </div>

            <ReservationsTable reservations={reservations} />
        </main>
    );
}
