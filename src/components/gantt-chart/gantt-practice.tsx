'use client'

import GanttChart from './gantt-chart';
import { useGanttTaskContext } from './gantt-practice-provider';
import GanttPracticeTable from './gantt-practice-table';
import { GanttTask } from './types';

export const GanttPractice = () => {
    
    const { ganttTasks } = useGanttTaskContext()

    const ganttTasksOrdered: GanttTask[] = ganttTasks
        .sort((a, b) => a.ordered - b.ordered)
        .map(({ id, name, startDate, endDate }) => ({ id, name, startDate, endDate }))
    
    return (
        <div className="w-2/3 flex flex-col items-center justify-center space-y-4">
            <GanttPracticeTable className="w-full" />
            <GanttChart ganttTasks={ganttTasksOrdered}/>
        </div>
    )
}
