import {Bed, PlusCircle, User } from "lucide-react";
import Link from "next/link";
import {ReservationIdParams} from "@/app/(app)/reservation/[id]/page";
import { getRoomsFromReservation } from "../create-room-reservation/action";

export default async function RoomsItem({params}: ReservationIdParams)  {
    const roomsFromReserv = await getRoomsFromReservation(parseInt(params.id))

    return (
        <>
            <div className="bg-blue-200 rounded-xl p-6 w-1/2 gap-4 flex h-auto">
                {roomsFromReserv.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full">
                        <h2 className="self-start text-xl text-slate-500">Rooms <Bed className="text-black"/></h2>
                        <Link 
                            className="text-4xl p-4 rounded-full bg-blue-500 text-white transition duration-200 ease-in-out hover:shadow-sm hover:shadow-blue-300 hover:bg-blue-600"
                            href={`/reservation/${params.id}/rooms`}
                        >
                            <PlusCircle/>
                        </Link>
                    </div>
                ) : (
                    <div className={`flex items-center justify-between w-full ${roomsFromReserv.length === 0 ? '' : 'justify-center justify-between'}`}>
                        <h2 className="text-xl text-slate-500">Rooms <Bed className="text-black"/></h2>
                        <div className="flex items-center justify-between">
                            <div className="mr-6">
                                <Link 
                                    className="hidden lg:flex text-sm p-4 rounded-full bg-blue-500 text-white transition duration-200 ease-in-out hover:shadow-sm hover:shadow-blue-300 hover:bg-blue-600"
                                    href={`/reservation/${params.id}/rooms`}
                                >
                                    Edit rooms
                                </Link>
                                <Link 
                                    className="lg:hidden text-sm p-4 rounded-full bg-blue-500 text-white transition duration-200 ease-in-out hover:shadow-sm hover:shadow-blue-300 hover:bg-blue-600"
                                    href={`/reservation/${params.id}/rooms`}
                                >
                                    Edit
                                </Link>
                            </div>
                            <ul className="hidden md:flex flex-col list-none space-y-4 justify-center">
                                {roomsFromReserv.map((room, index) => (
                                    <li
                                        key={index}
                                        className='items-center w-full justify-center text-xl bg-white p-3 rounded-3xl mt-1 border-dashed border-2 border-gray-300'
                                    >
                                        <div className="flex gap-4 items-center justify-center">
                                            <p className="hidden xl:flex"><Bed className="mr-3" /> Room n. {room.id} - capacity: {room.capacity}</p>
                                            <p className="hidden lg:flex xl:hidden"><Bed className="mr-2" /> n. {room.id} - <User />: {room.capacity}</p>
                                            <p className="hidden md:flex md:flex-col lg:hidden"><span className="flex"><Bed className="mr-2" /> n. {room.id}</span> <span className="flex">- <User />: {room.capacity}</span></p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}