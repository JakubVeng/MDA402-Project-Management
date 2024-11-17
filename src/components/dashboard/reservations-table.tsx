import { Reservation } from "@/db/schema/reservations";
import ReservationRow from "@/components/dashboard/reservation-row";

interface ReservationsTableProps {
    reservations: Reservation[];
}

export default function ReservationsTable({ reservations }: ReservationsTableProps) {

    return (
        <div className="flex flex-col items-center mt-8 w-full"> {/* Centering table and full width */}
            <table className="min-w-full divide-y divide-gray-200 shadow-lg bg-white rounded-lg overflow-hidden"> {/* Shadow and rounded corners */}
                <thead className="bg-blue-500 text-white"> {/* Header with a different color */}
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Reservation ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Room Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Detail</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation, index) => (
                    <ReservationRow
                        key={index}
                        reservationId={reservation.id}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}
