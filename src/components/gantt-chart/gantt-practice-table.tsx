'use client'

import { useGanttTaskContext } from "./gantt-practice-provider";
import GanttPracticeTableRow from "./gantt-practice-table-tow";

type GanttTaskTableProps = {
    className: string,
}

export default function GanttPracticeTable({className}: GanttTaskTableProps) {

    const { ganttTasks } = useGanttTaskContext() 

    return (
        <div className={`${className} flex flex-col items-center mt-8`}>
            <table className="min-w-full divide-y divide-gray-200 shadow-lg bg-white rounded-lg overflow-hidden">
                <thead className=" bg-gray-100 text-white">
                    <tr>
                        <th className="px-6 py-3 text-center text-md font-medium uppercase tracking-wider bg-[#0101bf]">Work Package</th>
                        <th className="px-6 py-3 text-center text-md font-medium uppercase tracking-wider bg-[#0101bf]">Order</th>
                        <th className="px-6 py-3 text-center text-md font-medium uppercase tracking-wider bg-[#0101bf]">Start Date</th>
                        <th className="px-6 py-3 text-center text-md font-medium uppercase tracking-wider bg-[#0101bf]">End Date</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {ganttTasks.sort((a, b) => a.id - b.id).map((data, index) => (
                        <GanttPracticeTableRow key={index} ganttTask={data} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
