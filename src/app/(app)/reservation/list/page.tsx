import {getReservationsAction} from "@/components/reservation-list/action";
import {Reservation} from "@/db/schema/reservations";
import {LabeledItem} from "@/components/labeled-item";
import Link from "next/link";
import {PageLink} from "@/components/page-link";
import {LucideCalendarDays, Search} from "lucide-react";
import FilteredReservations from "@/components/reservation-list/filtered-reservations";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'RM - Reservation list',
    description: 'Reservation list page'
};

const ReservationListItem = async ({ reservation }: { reservation: Reservation }) => {
    return (
        <li className="relative grid gap-4 rounded-lg shadow bg-white p-6 hover:bg-gray-50 transition-colors md:grid-cols-4 items-center">
            <Link href={`/reservation/${reservation.id}`}
                  className="text-blue-500 hover:text-blue-700 flex items-center gap-2 font-semibold">
                <Search />
                View Details
            </Link>
            <LabeledItem label="Description">
                <span className="">{reservation.description}</span>
            </LabeledItem>
            <LabeledItem label="Start Date">
                <LucideCalendarDays className="inline mr-2"/>
                {reservation.startDate?.toLocaleDateString()}
            </LabeledItem>
            <LabeledItem label="End Date">
                <LucideCalendarDays className="inline mr-2"/>
                {reservation.endDate?.toLocaleDateString()}
            </LabeledItem>
        </li>
    );
};

const ListPage = async () => {
    const reservations = await getReservationsAction();

    if (reservations.error !== undefined) {
        return <div>Error: {reservations.error}</div>;
    }

    const reservationList = reservations.reservations;

    return (
        <main className="flex flex-col min-h-screen p-10">
            <div className="flex flex-row w-full">
                <div className="flex w-1/2 flex-col gap-y-2 mb-4 md:w-1/6">
                    <PageLink href="/" reverse={true}>Home</PageLink>
                </div>
                <h1 className="mb-6 text-3xl text-center w-full">Reservation list</h1>
            </div>
            <FilteredReservations reservations={reservationList}/>
        </main>
    );
};

export default ListPage;
