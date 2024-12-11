'use client';

import React, {ReactNode, useState} from "react";
import { ArrowLeftCircle, ArrowRightCircle, Bed, Clock} from "lucide-react";
import { Tooltip } from 'react-tooltip'
import {useRouter} from "next/navigation";
import { GanttTask } from "./types";

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
    return hash >>> 0;
};

const generateColorFromHash = (inputString: string) => {
    const hash = djb2Hash(inputString).toString(16); 

    return '#' + hash.substring(0, 6);
};

const DateCell = ({ date }: { date: Date }) => {
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

const ToolTipTask = ({ ganttTask }: { ganttTask: GanttTask }) => {
    return (
        <Tooltip anchorSelect={`.tooltip_${ganttTask.id}`} style={{ backgroundColor: "whitesmoke", color: "#222" }}>
            <div className="flex flex-col p-2">
                <div className="flex flex-row justify-between space-x-2">
                    <h2>Start</h2>
                    <p>{ganttTask.startDate?.getDate()}. {ganttTask.startDate?.getMonth()! + 1}. {ganttTask.startDate?.getFullYear()} </p>
                </div>
                <div className="flex flex-row justify-between space-x-2">
                    <h2>End</h2>
                    <p>{ganttTask.endDate?.getDate()}. {ganttTask.endDate?.getMonth()! + 1}. {ganttTask.endDate?.getFullYear()} </p>
                </div>
            </div>
        </Tooltip>
    );

}

const GanttTaskCell = ({date, position, ganttTask}: {
    date: Date,
    position: CellPosition, color: string, ganttTask: GanttTask }) => {

    const router = useRouter();

    if (position === CellPosition.Start) {
        return (
                <td key={`rcell_${ganttTask.id}_${date.toDateString()}`} colSpan={1}
                    className={`tooltip_${ganttTask.id} border-t border-b bg-[#0101bf] border-slate-400 rounded-l-3xl hover:bg-opacity-75`}
                >
                    <ToolTipTask ganttTask={ganttTask}/>
                </td>
        );
    } else if (position === CellPosition.End) {
        return (
                <td key={`rcell_${ganttTask.id}_${date.toDateString()}`} colSpan={1}
                    className={`tooltip_${ganttTask.id} border-t border-b border-slate-400 bg-[#0101bf] rounded-r-3xl hover:bg-opacity-75`}
                >
                    <ToolTipTask ganttTask={ganttTask}/>
                </td>
        );
    } else {
        return (
            <td key={`rcell_${ganttTask.id}_${date.toDateString()}`} colSpan={1} className={`tooltip_${ganttTask.id} border-t border-b border-slate-400 bg-[#0101bf] hover:bg-opacity-75`}>
                <ToolTipTask ganttTask={ganttTask}/>
            </td>
        );
    }
}

const CalendarWeekSelect = ({ weekDates, setWeeksOffset, weekOffset }: { weekDates: Date[], setWeeksOffset: (weekOffset: number) => void, weekOffset: number }) => {
    return (
        <thead>
            <tr>
                <th key={"prev"} colSpan={1} className="w-24">
                        <button className={"border-2 border-[#0101bf] bg-[#0101bf] rounded-xl text-white p-4 hover:bg-white hover:text-[#0101bf]"} onClick={() => setWeeksOffset(weekOffset - 1)}>
                            <ArrowLeftCircle />
                        </button>
                </th>
                {weekDates.map((date, index) => (
                    <DateCell key={index+date.toDateString()} date={date} />
                ))}
                <th key={"next"} colSpan={1} className="w-24">
                    <button className={"border-2 border-[#0101bf] bg-[#0101bf] rounded-xl text-white p-4 hover:bg-white hover:text-[#0101bf]"} onClick={() => setWeeksOffset(weekOffset + 1)}>
                        <ArrowRightCircle />
                    </button>
                </th>
            </tr>
        </thead>
    );
};

const GanttTaskRow = ({ weekDates, ganttTask }: { weekDates: Date[], ganttTask: GanttTask }) => {
    const cells: ReactNode[] = [];
    
    console.log(weekDates.length);

    weekDates.forEach((date, index) => {
        const isTaskToday = (ganttTask.startDate! <= date && ganttTask.endDate! >= date) || (areDatesEqual(ganttTask.startDate!, date) || areDatesEqual(ganttTask.endDate!, date))

        console.log("Date is: ", date);
        console.log("Reservations for day: ", ganttTask);

        if (!isTaskToday) {
            cells.push(<td key={date.toDateString()+index} colSpan={2} className={"border border-slate-400"}></td>);
        }
        else {
            const color = generateColorFromHash(ganttTask.id.toString());

            if (areDatesEqual(ganttTask.startDate!, ganttTask.endDate!)) {
                cells.push(<GanttTaskCell key={index+"_1"} date={date} position={CellPosition.Start} color={color} ganttTask={ganttTask} />);
                cells.push(<GanttTaskCell key={index} date={date} position={CellPosition.End} color={color} ganttTask={ganttTask} />);
            }
            else if (areDatesEqual(ganttTask.startDate!, date)){
                cells.push(<GanttTaskCell key={index+"_1"} date={date} position={CellPosition.Start} color={color} ganttTask={ganttTask} />);
                cells.push(<GanttTaskCell key={date.toDateString()+index+"_1"} date={date} position={CellPosition.Middle} color={color} ganttTask={ganttTask} />);
            }
            else if (areDatesEqual(ganttTask.endDate!, date)){
                cells.push(<GanttTaskCell key={date.toDateString()+index} date={date} position={CellPosition.Middle} color={color} ganttTask={ganttTask} />);
                cells.push(<GanttTaskCell key={index} date={date} position={CellPosition.End} color={color} ganttTask={ganttTask} />);
            }
            else {
                cells.push(<GanttTaskCell key={date.toDateString()+index} date={date} position={CellPosition.Middle} color={color} ganttTask={ganttTask} />);
                cells.push(<GanttTaskCell key={date.toDateString()+index+"_1"} date={date} position={CellPosition.Middle} color={color} ganttTask={ganttTask} />);
            }
        }
    });

    return (
        <tr>
            <td key={"room_id_" + ganttTask.id} colSpan={1}>
                    <p className="pl-2 font-semibold text-xl text-center">{ganttTask.name}</p>
            </td>
            {cells}
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
        <button className={"border-2 border-[#0101bf] bg-[#0101bf] rounded-xl text-white p-4 flex flex-row items-center gap-1 mb-6 h-12 hover:bg-white hover:text-[#0101bf]"}
                onClick={() => setWeekOffset(0)}>
            <Clock size={24}/>
            Today
        </button>
    ) : (
        <div className={"mb-6 h-12"}></div>
    );
}

const GanttChart = ({ ganttTasks }: { ganttTasks: GanttTask[] }) => {
    const [weekOffset, setWeekOffset] = useState(0);

    const today = new Date();
    const startOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + weekOffset * 14
    );

    const startMonday = new Date(
        startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7))
    );

    const weekDates: Date[] = [];
    let currentDay = new Date(startMonday);
    while (weekDates.length < 10) {
        if (currentDay.getDay() !== 0 && currentDay.getDay() !== 6) {
            weekDates.push(new Date(currentDay));
        }
        currentDay.setDate(currentDay.getDate() + 1);
    }

    return (
        <div className={"flex flex-col items-center"}>
            <div>
                <TodayButton setWeekOffset={setWeekOffset} weekOffset={weekOffset}/>
            </div>
            <div>
                <table className={"w-screen h-50"}>
                    <CalendarWeekSelect weekDates={weekDates} setWeeksOffset={setWeekOffset} weekOffset={weekOffset}/>
                    <tbody>
                    {ganttTasks.map(task => {
                        return <GanttTaskRow key={
                            task.id
                        } weekDates={weekDates} ganttTask={task}/>
                    })}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default GanttChart;
