import RoomCalendar from "@/components/room-calendar/room-calendar";
import {getReservations, getRoomReservations, getRooms} from "@/components/room-calendar/action";
import {Reservation} from "@/db/schema/reservations";
import {Room} from "@/db/schema/rooms";
import {RoomReservation} from "@/db/schema/room-reservations";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'RM - Calendar',
    description: 'Calendar page'
};

const CalendarPage = async () => {
    const reservations: Reservation[] = await getReservations();
    const rooms: Room[] = await getRooms();
    const roomReservations: RoomReservation[] = await getRoomReservations();

    console.log(reservations);
    console.log(rooms);
    console.log(roomReservations);

    return (
            <div className={"flex flex-col h-[calc(100vh-20)] w-screen"}>
                <div className="flex flex-row w-full">
                    <h1 className="mb-6 text-3xl text-center w-full">Reservation calendar</h1>
                </div>
                <RoomCalendar reservations={reservations} rooms={rooms} roomReservationsProp={roomReservations}/>
            </div>
    );
};

export default CalendarPage;