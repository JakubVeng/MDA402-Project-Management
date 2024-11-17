'use client';

import {Reservation} from "@/db/schema/reservations";
import React, {ReactNode, useState} from "react";
import {ArrowLeft, ArrowLeftCircle, ArrowRight, ArrowRightCircle, Bed, Clock} from "lucide-react";
import {Room} from "@/db/schema/rooms";
import {RoomReservation} from "@/db/schema/room-reservations";
import { Tooltip } from 'react-tooltip'
import {CreateReservationForm} from "@/components/create-reservation/create-reservation-form";
import {ReservationDialog} from "@/components/reservation-detail/reservation-dialog";
import {useRouter} from "next/navigation";

const getDayName = (date: Date): string => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayIndex = date.getDay();
    return dayNames[dayIndex];
};


enum CellPosition {
    Start,
    Middle,
    End
}

const djb2Hash = (str: string) => {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0; // Ensure hash is a positive integer
};

// Function to generate a hexadecimal color code from a string using DJB2 hash function
const generateColorFromHash = (inputString: string) => {
    const hash = djb2Hash(inputString).toString(16); // Convert hash to hexadecimal string
     // Extract first 6 characters
    return '#' + hash.substring(0, 6);
};

const DateCell = ({ date }: { date: Date }) => {
    // get today date day number
    const today = new Date();
    const dayNumber = date.getDate();
    return (
        <th key={`thead_${dayNumber}`} colSpan={2} className="border border-slate-400">
            <div className={"flex flex-col"}>
                <span className={"text-xs font-light text-slate-500"}>{getDayName(date)}</span>
                {areDatesEqual(today, date) ? <strong className="text-red-600 text-4xl">{dayNumber}</strong> :
                    <strong className={"text-4xl"}>{dayNumber}</strong>}
                <span
                    className={"text-xs font-light text-slate-500"}>{date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}</span>
            </div>
        </th>
    );
}

const ToolTipReservation = ({ reservation }: { reservation: Reservation }) => {
    return (
        <Tooltip anchorSelect={`.tooltip_${reservation.id}`} style={{ backgroundColor: "whitesmoke", color: "#222" }}>
            <div className="flex flex-col p-2">
                <div className="flex flex-row">
                    <p className="font-semibold text-blue-600">Reservation {reservation.id}</p>
                </div>
                <div className="flex flex-row justify-between">
                    <h2>Start</h2>
                    <p>{reservation.startDate?.getDate()}. {reservation.startDate?.getMonth()! + 1}. {reservation.startDate?.getFullYear()} </p>
                </div>
                <div className="flex flex-row justify-between">
                    <h2>End</h2>
                    <p>{reservation.endDate?.getDate()}. {reservation.endDate?.getMonth()! + 1}. {reservation.endDate?.getFullYear()} </p>
                </div>
            </div>
        </Tooltip>
    );

}

const RoomReservationCell = ({date, position, color, reservation}: {
    date: Date,
    position: CellPosition, color: string, reservation: Reservation }) => {

    const [hidden, setHidden] = useState(true);
    const router = useRouter();

    if (position === CellPosition.Start) {
        return (
                <td key={`rcell_${reservation.id}_${date.toDateString()}`} colSpan={1}
                    className={`tooltip_${reservation.id} border-t border-b bg-blue-400 border-slate-400 cursor-pointer rounded-l-3xl hover:bg-opacity-75`}
                    onClick={
                        () => {
                            router.replace(`/reservation/${reservation.id}`);
                        }
                    }>
                    <ToolTipReservation reservation={reservation}/>
                </td>
        );
    } else if (position === CellPosition.End) {
        return (
                <td key={`rcell_${reservation.id}_${date.toDateString()}`} colSpan={1}
                    className={`tooltip_${reservation.id} border-t border-b border-slate-400 bg-blue-400 cursor-pointer rounded-r-3xl hover:bg-opacity-75`}
                    onClick={
                        () => {
                            router.replace(`/reservation/${reservation.id}`);
                        }
                }>
                    <ToolTipReservation reservation={reservation}/>
                </td>
        );
    } else {
        return (
            <td key={`rcell_${reservation.id}_${date.toDateString()}`} colSpan={1} className={`tooltip_${reservation.id} border-t border-b border-slate-400 bg-blue-400 cursor-pointer hover:bg-opacity-75`} onClick={
                () => {
                    router.replace(`/reservation/${reservation.id}`);
                }
            }>
                <ToolTipReservation reservation={reservation}/>
            </td>
        );
    }
}

const CalendarWeekSelect = ({ weekDates, setWeeksOffset, weekOffset }: { weekDates: Date[], setWeeksOffset: (weekOffset: number) => void, weekOffset: number }) => {
    return (
        <thead>
            <tr>
                <th key={"prev"} colSpan={1} className="w-24">
                        <button className={"bg-blue-500 rounded-xl text-white p-4"} onClick={() => setWeeksOffset(weekOffset - 1)}>
                            <ArrowLeftCircle />
                        </button>
                </th>
                {weekDates.map((date, index) => (
                    <DateCell key={index+date.toDateString()} date={date} />
                ))}
                <th key={"next"} colSpan={1} className="w-24">
                    <button className={"bg-blue-500 rounded-xl text-white p-4"} onClick={() => setWeeksOffset(weekOffset + 1)}>
                        <ArrowRightCircle />
                    </button>
                </th>
            </tr>
        </thead>
    );
};

const RoomRow = ({ room, weekDates, roomReservations, currentReservations }: { room: Room, weekDates: Date[], roomReservations: RoomReservation[], currentReservations: Reservation[] }) => {
    const roomReservationsForThisRoom = roomReservations.filter(reservation => reservation.roomId === room.id);
    const reservationsForThisRoom = currentReservations.filter(reservation => roomReservationsForThisRoom.map(roomReservation => roomReservation.reservationId).includes(reservation.id));
    const cells: ReactNode[] = [];

    console.log(weekDates.length);

    weekDates.forEach((date, index) => {
        const reservationsForDay = reservationsForThisRoom.filter(reservation => (reservation.startDate! <= date && reservation.endDate! >= date) || (areDatesEqual(reservation.startDate!, date) || areDatesEqual(reservation.endDate!, date)));

        console.log("Date is: ", date);
        console.log("Reservations for day: ", reservationsForDay);

        if(reservationsForDay.length === 0) {
            cells.push(<td key={date.toDateString()+index} colSpan={2} className={"border border-slate-400"}></td>);
        }
        else if(reservationsForDay.length === 1){
            const reservation = reservationsForDay[0];
            const color = generateColorFromHash(reservation.id.toString());

            if (areDatesEqual(reservation.startDate!, date)){
                cells.push(<td key={date.toDateString()+index} colSpan={1} className="border-t border-b border-l border-slate-400"></td>);
                cells.push(<RoomReservationCell key={index+"_1"} date={date} position={CellPosition.Start} color={color} reservation={reservation} />);
            }
            else if (areDatesEqual(reservation.endDate!, date)){
                cells.push(<RoomReservationCell key={index} date={date} position={CellPosition.End} color={color} reservation={reservation} />);
                cells.push(<td key={date.toDateString()+index+"_1"} colSpan={1} className="border-t border-b border-r border-slate-400"></td>);
            }
            else {
                cells.push(<RoomReservationCell key={date.toDateString()+index} date={date} position={CellPosition.Middle} color={color} reservation={reservation} />);
                cells.push(<RoomReservationCell key={date.toDateString()+index+"_1"} date={date} position={CellPosition.Middle} color={color} reservation={reservation} />);
            }
        }
        else if (reservationsForDay.length === 2){
            const reservation1 = reservationsForDay[0];
            const reservation2 = reservationsForDay[1];
            const color1 = generateColorFromHash(reservation1.id.toString());
            const color2 = generateColorFromHash(reservation2.id.toString());

            if(reservation1.endDate! < reservation2.endDate!){
                cells.push(<RoomReservationCell key={index} date={date} position={CellPosition.End} color={color1} reservation={reservation1} />);
                cells.push(<RoomReservationCell key={index+"_2"} date={date} position={CellPosition.Start} color={color2} reservation={reservation2} />);
            } else {
                cells.push(<RoomReservationCell key={index} date={date} position={CellPosition.End} color={color2} reservation={reservation2} />);
                cells.push(<RoomReservationCell key={index+"_2"} date={date} position={CellPosition.Start} color={color1} reservation={reservation1} />);
            }
        }
    });

    return (
        <tr>
            <td key={"room_id_" + room.id} colSpan={1}>
                    <p className="pl-2 font-semibold text-xl text-center">No. {room.id}</p>
            </td>
            {cells}
            <td key={"room_capacity_" + room.id} colSpan={1}>
                <div className={" pl-4 flex flex-row items-center justify-between"}>
                    <div className={"bg-blue-500 text-white p-2 flex flex-row gap-2 rounded-xl"}>
                        {room.capacity}
                        <Bed size={24}/>
                    </div>
                </div>
            </td>
        </tr>
    );
}

const areDatesEqual = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

const TodayButton = ({setWeekOffset, weekOffset}: {
    setWeekOffset: (weekOffset: number) => void,
    weekOffset: number
}) => {
    return weekOffset !== 0 ? (
        <button className={"bg-blue-400 rounded-xl text-white p-4 flex flex-row items-center gap-1 mb-6 h-12"}
                onClick={() => setWeekOffset(0)}>
            <Clock size={24}/>
            Today
        </button>
    ) : (
        <div className={"mb-6 h-12"}></div>
    );
}

const RoomCalendar = ({ rooms, roomReservationsProp, reservations }: { rooms: Room[], roomReservationsProp: RoomReservation[], reservations: Reservation[] }) => {
    const [weekOffset, setWeekOffset] = useState(0);
    const offset = new Date().getDay() - 1;
    const today = new Date().setDate(new Date().getDate() + weekOffset * 7);
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        return new Date(today + (i - offset) * 24 * 60 * 60 * 1000);
    });

    return (
        <div className={"flex flex-col items-center"}>
            <div>
                <TodayButton setWeekOffset={setWeekOffset} weekOffset={weekOffset}/>
            </div>
            <div>
                <table className={"w-screen h-50"}>
                    <CalendarWeekSelect weekDates={weekDates} setWeeksOffset={setWeekOffset} weekOffset={weekOffset}/>
                    <tbody>
                    {rooms.map(room => {
                        return <RoomRow key={
                            room.id
                        } room={room} weekDates={weekDates} roomReservations={roomReservationsProp}
                                        currentReservations={reservations}/>
                    })}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default RoomCalendar;
