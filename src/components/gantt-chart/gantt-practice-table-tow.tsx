'use client'

import { useGanttTaskContext } from "./gantt-practice-provider";
import { GanttTaskOrdered } from "./types";
import { format } from 'date-fns';

type GanttPracticeTableRowProps = {
    ganttTask: GanttTaskOrdered;
}

export default function GanttPracticeTableRow({ ganttTask }: GanttPracticeTableRowProps) {

    const {ganttTasks, setGanttTasks} = useGanttTaskContext()

    const handleChange = (id: number, field: 'startDate' | 'endDate' | 'ordered', value: Date | number) => {
        const newGanttTasks = ganttTasks.map(task => task.id === id ? { ...task, [field]: value } : task)
        setGanttTasks(newGanttTasks);
    };

    const formatDate = (date: Date) => {
        const formattedDate = [
            String(date.getDate()).padStart(2, '0'),
            String(date.getMonth() + 1).padStart(2, '0'),
            date.getFullYear()
        ].join('/');

        return formattedDate
    }

    return (
        <tr className="divide-x divide-gray-200">
            <td className={`text-center px-6 text-lg font-medium text-gray-900 bg-[#d3d3ff]`}>{ganttTask.name}</td>
            <td className={`text-center w-1/12 px-6 py-2 text-lg font-medium text-gray-900 bg-[#d3d3ff]`}>
                <input
                    type='number'
                    value={ganttTask.ordered}
                    onChange={e => handleChange(ganttTask.id, 'ordered', Number(e.target.value))}
                    className={`shadow appearance-none border rounded-lg p-1 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]`}
                />
            </td>
            <td className={`text-center px-6 py-2 text-lg font-medium text-gray-900 bg-[#d3d3ff]`}>
                <input
                    type='date'
                    value={ganttTask.startDate.toISOString().split('T')[0]}
                    onChange={e => handleChange(ganttTask.id, 'startDate', new Date(e.target.value))}
                    className={`shadow appearance-none border rounded-lg p-1 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]`}
                />
            </td>
            <td className={`text-center px-6 text-lg font-medium text-gray-900 bg-[#d3d3ff]`}>
                <input
                    type='date'
                    value={ganttTask.endDate.toISOString().split('T')[0]}
                    onChange={e => handleChange(ganttTask.id, 'endDate', new Date(e.target.value))}
                    className={`shadow appearance-none border rounded-lg p-1 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]`}
                />
            </td>
        </tr>
    );
}
