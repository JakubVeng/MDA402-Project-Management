import { getRoomForGuest } from "@/components/reservation-detail/action";
import {ReservationIdParams} from "@/app/(app)/reservation/[id]/page";
import {getGuestsFromReservation} from "@/components/create-room-reservation/action";
import {Guest} from "@/db/schema/guests";

const GuestRow = async ({guest}: { guest: Guest }) => {
    const guestReservation = await getRoomForGuest(guest.id);
    return (
        <>
            <div className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 mb-2">
                <span className="text-black font-semibold">{guest.name || 'No name given'}</span>
                <span className="text-black">{guestReservation?.roomId || 'No room yet'}</span>
            </div>
        </>
    );
}
export const GuestList = async ({params}: ReservationIdParams) => {

    const reservationId = params.id;
    const guests = await getGuestsFromReservation(parseInt(reservationId));

    if (guests.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-4">
                No guests found
            </div>
        )
    }

    return (
        <div className="mt-4 max-h-[calc(100vh-128px)] overflow-auto">
            {guests.map((guest, index) => (
                <GuestRow key={index} guest={guest}/>
            ))}
        </div>)
};
