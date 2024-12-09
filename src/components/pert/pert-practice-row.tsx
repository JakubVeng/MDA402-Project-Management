'use client'

import { useMutation } from "@tanstack/react-query";
import { Button } from "../button";
import { usePertContext } from "./pert-tasks-provider";
import { PertPracticeDetail } from "./type";
import { Allocation } from '@/db/schema/allocations';
import { deleteAssignee, insertAssignee } from "./action";
import { toast } from "sonner";
import { usePertPracticeContext } from "./pert-practice-provider";

type PertTableRowProps = {
    pertTask: PertPracticeDetail;
}

export default function PertPracticeTableRow({ pertTask }: PertTableRowProps) {

    const {pert, setPert} = usePertPracticeContext()

    const handleChangeEstimation = (id: number, field: 'o' | 'm' | 'p' | 'te' | 'calDays', value: number) => {
        const newPert = pert.map(task => task.id === id ? { ...task, [field]: value } : task)
        setPert(newPert);
    };

    const handleChangeEffortPerAllo = (pertId: number, allocationId: number, newValue: number) => {
        const newPert = pert.map(task =>
            task.id === pertId ? {
                ...task,
                assignments: task.assignments.map(assignment =>
                    assignment.id === allocationId ? {
                        ...assignment, perAllo: newValue
                    } : assignment
                ),
            } : task
        )
        setPert(newPert);
    };

    return (
        <>
            {pertTask.assignments.map((assignment, index) => (
            <tr key={`${pertTask.id}-${index}`} className="divide-x divide-gray-200">
                {index === 0 && (
                    <>
                        <td className={`px-6 whitespace-nowrap text-center text-gray-900 bg-[#d3d3ff] font-medium text-sm`} rowSpan={pertTask.assignments.length}>{pertTask.name}</td>
                        <td className={`text-center px-6 text-sm font-medium text-gray-900 bg-[#d3d3ff]`} rowSpan={pertTask.assignments.length}>
                            {pertTask.id % 3 === 2 ? (
                                <>{pertTask.o}</>
                            ) : (
                                <input
                                    type="number"
                                    onChange={e => handleChangeEstimation(pertTask.id, 'o', Number(e.target.value))}
                                    className={`shadow appearance-none border rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]`}
                                />
                            )}
                        </td>
                        <td className={`text-center py-1 px-6 text-sm font-medium text-gray-900 bg-[#d3d3ff]`} rowSpan={pertTask.assignments.length}>
                            {pertTask.id % 3 === 1 ? (
                                <>{pertTask.m}</>
                            ) : (
                                <input
                                    type="number"
                                    onChange={e => handleChangeEstimation(pertTask.id, 'm', Number(e.target.value))}
                                    className={`shadow appearance-none border rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]`}
                                />
                            )}
                        </td>
                        <td className={`text-center px-6 text-sm font-medium text-gray-900 bg-[#d3d3ff]`} rowSpan={pertTask.assignments.length}>
                            {pertTask.id % 3 === 0 ? (
                                <>{pertTask.p}</>
                            ) : (
                                <input
                                    type="number"
                                    onChange={e => handleChangeEstimation(pertTask.id, 'p', Number(e.target.value))}
                                    className={`shadow appearance-none border rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]`}
                                />
                            )}
                        </td>
                        <td className={`px-6 whitespace-nowrap text-center text-sm font-medium text-gray-900 bg-[#d3d3ff]`} rowSpan={pertTask.assignments.length}>
                            <input
                                type="number"
                                onChange={e => handleChangeEstimation(pertTask.id, 'te', Number(e.target.value))}
                                className={`shadow appearance-none border rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]`}
                            />
                        </td>
                    </>
                )}
                <td className={`px-6 py-2 whitespace-nowrap text-center border-l border-gray-200 text-sm font-medium text-gray-900 bg-[#d3d3ff]`}>
                    {assignment.name}
                </td>
                <td className={`text-center px-6 text-sm font-medium text-gray-900 bg-[#d3d3ff]`}>
                    {assignment.allocation}
                </td>
                <td className={`px-6 whitespace-nowrap text-center text-sm font-medium text-gray-900 bg-[#d3d3ff]`}>
                    <input
                        type="number"
                        onChange={e => handleChangeEffortPerAllo(pertTask.id, assignment.id, Number(e.target.value))}
                        className={`shadow appearance-none border rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]`}
                    />
                </td>
                {index === 0 && (
                    <td className={`px-6 whitespace-nowrap text-center text-sm font-medium text-gray-900 bg-[#d3d3ff]`} rowSpan={pertTask.assignments.length}>
                        <input
                            type="number"
                            onChange={e => handleChangeEstimation(pertTask.id, 'calDays', Number(e.target.value))}
                            className={`shadow appearance-none border rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]`}
                        />
                    </td>
                )}
            </tr>
        ))}
        </>
    );
}
