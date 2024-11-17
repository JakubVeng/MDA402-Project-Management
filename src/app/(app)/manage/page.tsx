import React from "react";
import {getRooms} from "@/components/manage-accomodation/action";
import {UpdateRoomForm} from "@/components/manage-accomodation/update-room-form";
import {AddRoomForm} from "@/components/manage-accomodation/create-room-form";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'MA - Management',
    description: 'Manage accommodation page'
};

export default async function ManagePage() {
    const rooms = await getRooms();

    return (
        <main className="flex flex-col min-h-screen p-10">
            <div className="flex flex-row space-x-8">
                <div className="w-1/2 bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Add New Room</h2>
                    <AddRoomForm/>
                </div>

                <div className="w-1/2 bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Update Room Capacity</h2>
                    <UpdateRoomForm rooms={rooms}/>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {rooms.map((room) => (
                    <div key={room.id}
                         className="bg-blue-500 rounded-xl p-6 flex flex-col items-center justify-center text-white">
                        <p className="text-lg font-semibold">Room {room.id}</p>
                        <p className="text-sm">Capacity: {room.capacity}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
