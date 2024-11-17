'use client';

import { useState, useEffect } from "react";

interface ClientReservationSummaryProps {
    reservationLength: number;
    guestsAmount: number;
}

const ClientReservationSummary: React.FC<ClientReservationSummaryProps> = ({ reservationLength, guestsAmount }) => {
    const [pricePerPerson, setPricePerPerson] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        setTotalPrice(reservationLength * pricePerPerson * guestsAmount);
    }, [pricePerPerson, reservationLength, guestsAmount]);

    return (
        <div className="flex flex-col space-y-4">
            <div>
                <label htmlFor="pricePerPerson" className="block text-sm font-medium text-gray-700 mb-2">
                    Price per person per day (EUR):
                </label>
                <input
                    type="number"
                    id="pricePerPerson"
                    value={pricePerPerson}
                    onChange={(e) => setPricePerPerson(parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div className="mt-4">
                <p className="text-lg font-semibold float-right">Total Price: {totalPrice.toFixed(2)} EUR</p>
            </div>
        </div>
    );
}

export default ClientReservationSummary;
