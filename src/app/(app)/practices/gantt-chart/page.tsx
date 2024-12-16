
import { Button } from "@/components/button";
import { getGanttTaskData, getPDM, getPDMRel, getPDMTask, getPDMTypes, getPertTaskNames } from "@/components/gantt-chart/action";
import { CreatePDMForm } from "@/components/gantt-chart/create-pdm-form";
import GanttChart from "@/components/gantt-chart/gantt-chart";
import { GanttPertTask, GanttTask, PDMTask } from "@/components/gantt-chart/types";
import { getAdminEmails } from "@/components/lectures/action";
import { auth } from "@/server/auth";
import { PDMProvider, usePDMContext } from "@/components/gantt-chart/pdm-provider";
import { AddPDM } from "@/components/gantt-chart/add-PDM";
import PDMTable from "@/components/gantt-chart/pdm-table";
import { GanttTaskProvider } from "@/components/gantt-chart/gantt-practice-provider";
import GanttPracticeTable from "@/components/gantt-chart/gantt-practice-table";
import { GanttPractice } from "@/components/gantt-chart/gantt-practice";

function calculateGanttTasks(tasks: GanttPertTask[], pdm: PDMTask[]): GanttTask[] {
    const businessDaysFrom = (start: Date, days: number): Date => {
        let current = new Date(start);
        let addedDays = 0;
        const amendedDays = days > 0 ? days - 1 : days + 1

        while (addedDays < Math.abs(amendedDays)) {
            current.setDate(current.getDate() + (days > 0 ? 1 : -1));
            if (current.getDay() !== 0 && current.getDay() !== 6) {
                addedDays++;
            }
        }

        return current;
    };

    const findTaskById = (id: number) => tasks.find(task => task.id === id);

    const taskDates: Record<number, { startDate: Date; endDate: Date }> = {};

    const resolveDates = (taskId: number): void => {
        if (taskDates[taskId]) return; 

        const task = findTaskById(taskId);
        if (!task) throw new Error(`Task with id ${taskId} not found`);

        let startDate = new Date(2100, 0, 1);
        let endDate = businessDaysFrom(startDate, task.calDays);

        const predecessors = pdm.filter(relation => relation.successorId === taskId);
        for (const relation of predecessors) {
            const predecessorDates = taskDates[relation.predecessorId];
            if (!predecessorDates) {
                resolveDates(relation.predecessorId); 
            }
            const { startDate: predStart, endDate: predEnd } = taskDates[relation.predecessorId];

            switch (relation.pdmType) {
                case 'fs': // Finish-to-Start
                    startDate = businessDaysFrom(predEnd, 2);
                    endDate = businessDaysFrom(startDate, task.calDays)
                    break;

                case 'ff': // Finish-to-Finish
                    endDate = predEnd;
                    startDate = businessDaysFrom(endDate, -task.calDays);
                    break;

                case 'ss': // Start-to-Start
                    startDate = predStart;
                    endDate = businessDaysFrom(startDate, task.calDays);
                    break;

                case 'sf': // Start-to-Finish
                    endDate = businessDaysFrom(predStart, 2);
                    startDate = businessDaysFrom(endDate, -task.calDays);
                    break;

                default:
                    throw new Error(`Unknown PDM type: ${relation.pdmType}`);
            }
        }

        taskDates[taskId] = { startDate, endDate };
    };

    tasks.forEach(task => resolveDates(task.id));

    return tasks
        .map(task => ({
            id: task.id,
            name: task.name,
            startDate: taskDates[task.id].startDate,
            endDate: taskDates[task.id].endDate,
        }))
        .sort((a, b) => {
            if (a.startDate.getTime() !== b.startDate.getTime()) {
                return a.startDate.getTime() - b.startDate.getTime();
            }
            return tasks.find(t => t.id === a.id)!.calDays - tasks.find(t => t.id === b.id)!.calDays;
        });
}

export default async function GanttChartPage() {

    const pdmTasks = await getPDMTask()
    const pdm = await getPDM()
    const pdmTypes = await getPDMTypes()
    const pertNames = await getPertTaskNames()
    const ganttTasks = await getGanttTaskData()
    const pdmRels = await getPDMRel()

    const session = await auth();
    const admin_emails = await getAdminEmails()

    let editor = false

    if (session?.user?.email) {
        editor = admin_emails.includes(session.user.email)
    }

    return (
        <div className="flex flex-col justify-center items-center mt-10 mb-10 w-screen space-y-6 px-8">
            <div className='flex flex-col space-y-4 justify-center items-center'>
                <div className="flex justify-center">
                    <h2 className="text-[#0101bf] text-3xl font-bold">Create Gantt chart</h2>
                </div>
                <div className="flex flex-col w-2/3 items-center space-y-4 text-justify">
                    <article>
                        <p>
                            Fourth practice will be focused on creating Gantt chart from the estimated task. In the previous practice your goal was to estimate
                            each work package and thus calculate estimated effort in calendar days. In this practice your goal is to 
                            create a Gantt chart respecting the estimate effort for each work package and also respecting 
                            relations from Precedence Programming Method that for most of the couple of tasks specifies relationship between them.
                        </p>
                    </article>
                </div>
            </div>
            {editor ? (
                <div className="w-full flex flex-col justify-center items-center space-y-12">
                    <GanttChart ganttTasks={calculateGanttTasks(ganttTasks, pdmTasks)} />
                    <div className="flex flex-col justify-center items-center w-2/3 space-y-4">
                        <div className="flex items-start justify-start">   
                            <h3 className="text-[#0101bf] text-2xl font-bold">Define PDM</h3>
                        </div>
                        <PDMProvider pdm={pdm}>
                            <AddPDM pertTasks={pertNames} pdmTypes={pdmTypes}/>
                        </PDMProvider>
                    </div>
                </div>
            ) : (
                <div className="w-full flex flex-col justify-center items-center space-y-12">
                    <PDMTable className="w-2/3" pdms={pdmRels}/>
                    <GanttTaskProvider wps={pertNames}>
                        <GanttPractice />
                    </GanttTaskProvider>
                </div>
            )}
        </div>
    )
}