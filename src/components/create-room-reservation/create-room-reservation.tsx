'use client'

import { DndContext } from '@dnd-kit/core';
import { Room } from '@/db/schema/rooms';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageLink } from '../page-link';
import { Droppable } from '../ui/droppable';
import { Bed, User } from 'lucide-react';
import { Draggable } from '../ui/draggable';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { addGuestToRoom, deleteGuestsFromRooms } from './action';
import { Button } from '../button';

type CreateRoomReservationProps = {
    guests: GuestNameRoom[];
    roomsFromReserv: Room[];
    freeRooms: Room[];
}

type GuestRoom = {
    guestId: number;
    roomId: number;
}

export type GuestRoomReservation = {
    guestId: number;
    roomId: number;
    reservationId: number;
}

type GuestNameRoom = {
    id: number;
    name: string;
    roomId: number | null;
}

const useAddGuestToRoomMutation = () =>
    useMutation({
        mutationFn: async (guestRoomReservation: GuestRoomReservation[]) => {
            try {
                if (guestRoomReservation.length > 0) {
                    await Promise.all(guestRoomReservation.map(item => addGuestToRoom(item)));
                    toast.success('Guests added to rooms!')
                } else {
                    throw new Error
                }
            } catch {
                toast.error('Please add guests to rooms first!')
            }
        }
    })

const useEditGuestToRoomMutation = () =>
    useMutation({
        mutationFn: async (guestRoomReservation: GuestRoomReservation[]) => {
            try {
                await deleteGuestsFromRooms(guestRoomReservation[0].reservationId)
                if (guestRoomReservation[0].guestId === 0) {
                    toast.success('All guests deleted from rooms!')
                } else {
                    await Promise.all(guestRoomReservation.map(item => addGuestToRoom(item)));
                    toast.success('Guests added to rooms!')
                } 
            } catch {
                toast.error('Something went wrong!')
            }
        }
    })

const useDeleteGuestFromRoomMutation = () =>
    useMutation({
        mutationFn: async (id: number) => {
            try {
                await deleteGuestsFromRooms(id)
                toast.success('All guests from rooms deleted!')
            } catch {
                return 
            }
        }
    })

export const CreateRoomReservation = ({guests, freeRooms, roomsFromReserv}: CreateRoomReservationProps) => {
    const addGuests = useAddGuestToRoomMutation();
    const editGuests = useEditGuestToRoomMutation();
    const deleteGuests = useDeleteGuestFromRoomMutation()

    const edit = guests.some(guest => guest.roomId !== null);

    const guestRooms: GuestRoom[] = guests
        .filter(guest => guest.roomId !== null)
        .map(guest => ({ guestId: guest.id, roomId: guest.roomId as number }));

    const [guestRoom, setGuestRoom] = useState<GuestRoom[]>(guestRooms);
    const router = useRouter();

    const params = useParams<{ id: string }>();
    const id = params.id;

    const rooms = [...roomsFromReserv, ...freeRooms]


    function handleDragEnd(event: any) {
        const {over, active} = event;

        if (over === null) {
            return
        } else if (over.id === 'basic') {
            const removed : GuestRoom[] = guestRoom.filter(item => item.guestId !== active.id)
            setGuestRoom(removed)
        } else {
            const occ = guestRoom.filter(item => item.roomId === over.id).length;
            const cap = rooms.filter(room => room.id === over.id)[0].capacity
            if (occ === cap) {
                toast.error('Capacity of this room is full!')
                return
            } else {
                if (guestRoom.some(item => item.guestId === active.id)) {
                    const removed : GuestRoom[] = guestRoom.filter(item => item.guestId !== active.id)
                    setGuestRoom(removed)
                } 
                const newGuestRoom : GuestRoom = {guestId: active.id, roomId: over.id}
                setGuestRoom(prevGuestRooms => [...prevGuestRooms, newGuestRoom]);
                console.log(guestRoom)
            }
        }
    }

    const guestRoomReservation = guestRoom.length === 0 ? [{reservationId: parseInt(id), guestId: 0, roomId: 0}] : guestRoom.map(item => ({...item, reservationId: parseInt(id)}))

    const onClick = () => {
        if (edit) {
            editGuests.mutate(
                guestRoomReservation,
                {
                    onSuccess: () => {
                        router.push(`/reservation/${guestRoomReservation[0].reservationId}`); 
                    }
                }
            )
        } else {
            addGuests.mutate(
                guestRoomReservation,
                {
                    onSuccess: () => {
                        router.push(`/reservation/${guestRoomReservation[0].reservationId}`); 
                    }
                }
            )
        }
    }

    const onClickReset = () => {
        deleteGuests.mutate(
            parseInt(id),
            {
                onSuccess: () => {
                    setGuestRoom([])
                }
            }
        )
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className='flex flex-col md:flex-row w-full justify-between justify-center'>
                <div className='flex flex-row mb-6 mr-6 justify-between md:flex-col md:justify-normal gap-10'>
                    <Button
                        type='button'
                        onClick={onClick}
                        className='flex items-center justify-center btn btn-primary h-14 w-36 bg-blue-500 text-white text-center rounded-xl p-4 transition duration-200 ease-in-out hover:shadow-sm hover:shadow-blue-300 hover:bg-blue-600'
                    >
                        Submit
                    </Button>
                    <Button
                        type='button'
                        onClick={onClickReset}
                        className='flex items-center justify-center btn btn-primary h-14 w-36 bg-blue-500 text-white text-center rounded-xl p-4 transition duration-200 ease-in-out hover:shadow-sm hover:shadow-blue-300 hover:bg-blue-600'
                    >
                        Reset
                    </Button>
                </div>
                <div className='flex flex-row w-full mr-6 justify-evenly gap-10 justify-center'>
                    <div className="w-1/3 space-y-4 justify-center items-center mr-6">
                        <h2 className="text-2xl text-center">Guests</h2>
                        <Droppable id='basic' className='h-[calc(100vh-128px)] bg-white'>
                            <div className='h-full'>
                                <ul className="list-none space-y-4 justify-center">
                                    {guests.map((guest, index) => (
                                        <div key={guest.id}>
                                            {!guestRoom.some(item => item.guestId === guest.id) ? (
                                                <Draggable id={guest.id} key={index} disabled={false}>
                                                    <li className="flex items-center bg-white rounded-3xl h-[47px] mt-1 border-2 border-gray-500 w-[150px] mob:w-[200px] sm:w-[280px] lg:w-[380px]">
                                                        <div className="flex gap-3 ml-4 justify-center items-center">
                                                            <User />
                                                            <p className='text-sm mob:text-lg'>{guest.name}</p>
                                                        </div>
                                                    </li>
                                                </Draggable>
                                            ) : (
                                                null
                                            )}
                                        </div>
                                    ))}
                                </ul>
                            </div>
                        </Droppable>
                    </div>
                    {rooms.length === 0 ? (
                        <div className="w-1/3 items-center space-y-4 justify-center">
                            <h2 className="text-2xl text-center">Rooms</h2>
                            <p className="text-justify" >There are no free rooms during selected time period! Please return to reservation detail and change reservation dates!</p>
                            <PageLink reverse={true} href={`/reservation/${id}`} >Back to Reservation Detail</PageLink>
                        </div>
                    ) : (
                        <div className="w-1/3 items-center space-y-4 justify-center mr-10">
                            <h2 className="text-2xl text-center">Rooms</h2>
                            <ul className="list-none space-y-4 justify-center">
                                {rooms.map((room, index) => (
                                    <Droppable key={index+1} id={room.id}>
                                        <li 
                                            className='items-top justify-center h-60'
                                            style={{ height: `calc(${(room.capacity+1) * 47}px)` }}
                                        >
                                            <div className="ml-5 mt-2 flex gap-4">
                                                <p className='hidden mob:flex gap-4'><Bed className='mr-1' /> Room n. {room.id}  <span className='flex'><User size={20} />: {room.capacity}</span></p>
                                                <p className='flex mob:hidden gap-4'><Bed className='mr-1' />n. {room.id}  <span className='flex'><User size={20} />: {room.capacity}</span></p>
                                            </div>
                                            {guests.map((guest, index) => (
                                                <div key={guest.id} className='ml-2'>
                                                    {guestRoom.some(item => item.guestId === guest.id && item.roomId === room.id) ? (
                                                        <Draggable id={guest.id} key={index} disabled={false}>
                                                            <li className="flex items-center bg-white rounded-3xl h-[47px] mt-1 border-2 border-gray-500 w-[150px] mob:w-[200px] sm:w-[280px] lg:w-[380px]">
                                                                <div className="flex gap-3 ml-4 justify-center items-center">
                                                                    <User />
                                                                    <p className='text-sm mob:text-lg'>{guest.name}</p>
                                                                </div>
                                                            </li>
                                                        </Draggable>
                                                    ) : (
                                                        null
                                                    )}
                                                </div>
                                            ))}
                                        </li>
                                    </Droppable>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </DndContext>
    )
}