import { Bed } from "lucide-react"; 
import { AddGuestsDialog } from '@/components/create-room-reservation/add-guest-dialog'; 

import { getFreeRoomsForReservation, getGuestsFromReservation, getGuestsFromRoomReservation, getRoomsFromReservation, getAllGuestsFromReservation } from '@/components/create-room-reservation/action';
import { AddGuestsForm } from '@/components/create-room-reservation/add-guest-form';

import { CreateRoomReservation } from "@/components/create-room-reservation/create-room-reservation";

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'RR - Reservation Rooms Detail',
    description: 'Reservation Rooms Detail'
};

type ReservationIdParams = {
    params: { id: string };
};

export default async function RoomsReservationDetailsPage({ params }: ReservationIdParams) {
    const roomsFromReservation = await getRoomsFromReservation(parseInt(params.id))
    const allGuests = await getAllGuestsFromReservation(parseInt(params.id))
    
    const roomsFreeForReservation = await getFreeRoomsForReservation(parseInt(params.id))
    const guestFromReservation = await getGuestsFromReservation(parseInt(params.id))


    return (
        <main className='h-[calc(100vh-50px)] container ml-6 sm:ml-16 sm:mr-16'>
            <div className='flex w-full gap-4 items-center sm:justify-between sm:justify-center'>
                <AddGuestsDialog>
                    {roomsFromReservation.length > 0 ? (
                        <div className="p-4">
                            <p>{`Please remove guests from rooms before editing/adding guests (Reset)!`}</p>
                        </div>
                    ) : (
                        <AddGuestsForm initialData={guestFromReservation}/>
                    )}
                </AddGuestsDialog>
			    <h1 className="flex text-2xl mob:text-4xl gap-4 items-center font-bold">
                    {roomsFromReservation.length > 0 ? 'Edit rooms' : 'Add rooms'}
                    <Bed className="hidden mob:block text-black" size={50}/>
                    <Bed className="mob:hidden text-black" size={35}/>
                </h1>
		    </div>
            <div className='flex w-full mt-6'>
                <CreateRoomReservation guests={allGuests} freeRooms={roomsFreeForReservation} roomsFromReserv={roomsFromReservation}/>
            </div>
        </main>
    )
}