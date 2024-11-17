import {getRoomReservations, getTodayCheckIns, getTotalRoomsCount} from "@/components/dashboard/action";

export const TodayInfo = async () => {
    const todayCheckins = await getTodayCheckIns();
    const todayRoomsOccupied = await getRoomReservations(new Date());

    const occupiedRooms = todayRoomsOccupied.length;
    const totalRooms = await getTotalRoomsCount();

    return (
        <div className="p-4 bg-white rounded-xl">
            <h2 className="mb-2">Information for today</h2>
            <div className="flex flex-row justify-between">
                <p>Today&apos;s check-in: </p>
                <p>{todayCheckins.length} </p>
            </div>
            <div className="flex flex-row justify-between">
                <p>Today&apos;s occupation: </p>
                <p> {occupiedRooms} / {totalRooms} </p>
            </div>
        </div>)
};
