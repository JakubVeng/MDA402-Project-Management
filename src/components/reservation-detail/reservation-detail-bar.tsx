import {ReservationIdParams} from "@/app/(app)/reservation/[id]/page";
import {deleteReservation, getGuests, getReservation} from "@/components/reservation-detail/action";
import {GuestList} from "@/components/reservation-detail/guest-list";
import {GuestsDialog} from "@/components/reservation-detail/guests-dialog";
import {CreateReservationForm} from "@/components/create-reservation/create-reservation-form";
import React from "react";
import {ReservationDialog} from "@/components/reservation-detail/reservation-dialog";
import {getGuestsFromReservation} from "@/components/create-room-reservation/action";
import {Printer, Search} from "lucide-react";
import Link from "next/link";
import {PageLink} from "@/components/page-link";



export default async function ReservationDetailBar({ params }: ReservationIdParams) {
    const reservationId = params.id;
    const reservation = await getReservation({ id: parseInt(reservationId) });

    if (reservation === undefined) {
        return <div>Reservation not found</div>;
    }
    const guest = await getGuestsFromReservation(parseInt(reservationId));
    const guestCount = guest.length;

    return (
        <>
            <div className="flex flex-col w-1/2"> {/* Right column */}
                <div className="p-6 bg-white rounded-xl">

                    <div className="flex flex-row mb-4 justify-between">
                        <h2 className="text-xl text-slate-500">Description</h2>
                        <div className="flex flex-col">
                            <ReservationDialog create={false}>
                                <CreateReservationForm initialData={reservation}/>
                            </ReservationDialog>
                            <Link href={`/reservation/${reservation.id}/summary`}
                                  className="p-2 text-blue-500 hover:text-blue-700 flex items-center gap-2 font-semibold">
                                <Printer />
                            </Link>
                        </div>
                    </div>
                    <div className="flex mb-1.5 flex-row justify-between overflow-auto">
                        {reservation.description}
                    </div>
                </div>

            </div>
            <div className="flex flex-col w-1/2"> {/* Right column */}
                <div className="p-6 bg-white rounded-xl">
                    <div className="flex flex-row justify-between">
                        <h2 className="text-xl text-slate-500">Check-in</h2>
                        <p className="text-xl">{reservation.startDate?.getDate()}. {reservation.startDate?.getMonth()! + 1}. {reservation.startDate?.getFullYear()} </p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <h2 className="text-xl text-slate-500">Check-out</h2>
                        <p className="text-xl">{reservation.endDate?.getDate()}. {reservation.endDate?.getMonth()! + 1}. {reservation.endDate?.getFullYear()} </p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <h2 className="text-xl text-slate-500">Guests</h2>
                        <p className="text-xl">{guestCount}</p>
                    </div>
                </div>
                <GuestsDialog>
                    <GuestList params={ params }/>
                </GuestsDialog>
            </div>
        </>
    )
}