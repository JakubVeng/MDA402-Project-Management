import { getGuests, getReservation } from "@/components/reservation-detail/action";
import React from "react";
import { Metadata } from "next";
import ClientReservationSummary from "@/components/reservation-summary/price-summary";
import {Printer} from "lucide-react";
import Link from "next/link";
import {GuestList} from "@/components/reservation-detail/guest-list";
import PrintButton from "@/components/reservation-summary/print-button";

export type ReservationIdParams = {
    params: { id: string };
};

export const metadata: Metadata = {
    title: 'RS - Reservation summary',
    description: 'Reservation summary page'
};

export default async function ReservationSummary({ params }: ReservationIdParams) {
    const guests = await getGuests({ id: parseInt(params.id) });
    const guestsAmount = guests.length;

    const reservation = await getReservation({ id: parseInt(params.id) });

    if (!reservation) {
        return <div>Reservation not found</div>;
    }

    const checkInDate = reservation.startDate ? new Date(reservation.startDate) : null;
    const checkOutDate = reservation.endDate ? new Date(reservation.endDate) : null;

    const reservationLength = checkOutDate && checkInDate
        ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;



    return (
        <main className="flex flex-col items-center h-[calc(100vh-50px)] p-10 w-full">
            <h1 className="text-4xl font-bold mb-8 text-center">Reservation {params.id}</h1>

            <div className="bg-white p-6 rounded-lg shadow-md w-full mb-8">
                <div className="flex flex-row justify-between">
                    <div className="mb-4">
                        <p className="text-lg"><strong>Check-in
                            Date:</strong> {checkInDate ? checkInDate.toLocaleDateString() : 'N/A'}</p>
                        <p className="text-lg"><strong>Check-out
                            Date:</strong> {checkOutDate ? checkOutDate.toLocaleDateString() : 'N/A'}</p>
                        <p className="text-lg"><strong>Number of Guests:</strong> {guestsAmount}</p>
                    </div>
                    <PrintButton />
                </div>

            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {guests.map((guest, index) => (
                    <div key={index} className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 mb-2">
                        <span className="text-black font-semibold">{guest.name || 'No name given'}</span>
                    </div>
                ))}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md w-full">
                <ClientReservationSummary
                    reservationLength={reservationLength}
                    guestsAmount={guestsAmount}
                />
            </div>
        </main>
    );
}
