import Link from "next/link";
import {getGuests, getRoomsForReservation} from "@/components/reservation-detail/action";
import {getGuestsFromRoomReservation, getGuestsFromReservation} from "@/components/create-room-reservation/action";

interface ReservationRowProps {
    reservationId: number;
}
export default async function ReservationRow({reservationId}: ReservationRowProps) {
    const rooms = await getRoomsForReservation(reservationId);
    const guests = await getGuestsFromRoomReservation(reservationId);
    const guestsCount = guests.length;

    return (
        <tr key={reservationId} className="hover:bg-gray-100"> {/* Hover effect */}
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{reservationId}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {rooms.map(room => (
                    <span key={room.roomId} className="bg-white border border-blue-500 text-blue-500 rounded px-2 py-1 inline-block mr-2">
                        {room.roomId}
                    </span>
                ))}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guestsCount}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                <Link href={`/reservation/${reservationId}`}>
                    Show
                </Link>
            </td>
        </tr>
    );
}
