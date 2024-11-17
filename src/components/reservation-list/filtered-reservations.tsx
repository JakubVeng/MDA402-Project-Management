'use client';

import {Reservation} from "@/db/schema/reservations";
import Link from "next/link";
import {LucideCalendarDays, Search} from "lucide-react";
import {LabeledItem} from "@/components/labeled-item";
import {useState} from "react";

const ReservationListItem = ({ reservation }: { reservation: Reservation }) => {
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

interface FilteredReservationsProps {
    reservations: Reservation[];
}

const FilteredReservations: React.FC<FilteredReservationsProps> = ({ reservations }) => {
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

    const filteredReservations = reservations.filter(reservation => {
        const startDate = reservation.startDate ? new Date(reservation.startDate).setHours(0,0,0,0) : null;
        const endDate = reservation.endDate ? new Date(reservation.endDate).setHours(0,0,0,0) : null;

        const filterStart = startDateFilter ? new Date(startDateFilter).setHours(0,0,0,0) : null;
        const filterEnd = endDateFilter ? new Date(endDateFilter).setHours(0,0,0,0) : null;

        return (!filterStart || (startDate && startDate === filterStart)) &&
            (!filterEnd || (endDate && endDate === filterEnd));
    });

    const handleClearFilters = () => {
        setStartDateFilter('');
        setEndDateFilter('');
    };

    return (
        <>
            <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg">
                <div className="flex flex-row gap-2">
                    <label className="block text-sm font-medium text-gray-700 mr-2">
                        Start Date:
                        <input
                            type="date"
                            value={startDateFilter}
                            onChange={e => setStartDateFilter(e.target.value)}
                            className="ml-2 p-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Start Date"
                        />
                    </label>
                    <label className="block text-sm font-medium text-gray-700 mr-2">
                        End Date:
                        <input
                            type="date"
                            value={endDateFilter}
                            onChange={e => setEndDateFilter(e.target.value)}
                            className="ml-2 p-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="End Date"
                        />
                    </label>
                </div>
                <button
                    onClick={handleClearFilters}
                    className="p-2 bg-blue-500 text-white rounded-xl">
                    Clear Filters
                </button>
            </div>

            <p className="px-4 py-2 text-sm text-gray-600">
                {filteredReservations.length} reservations found
            </p>
            <ul className="space-y-4">
                {filteredReservations.map(reservation => (
                    <ReservationListItem key={reservation.id} reservation={reservation}/>
                ))}
            </ul>
        </>
    );
}

export default FilteredReservations;
