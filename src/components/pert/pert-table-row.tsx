'use client'

import { useMutation } from "@tanstack/react-query";
import { Button } from "../button";
import { usePertContext } from "./pert-tasks-provider";
import { PertTaskDetail } from "./type";
import { Allocation } from '@/db/schema/allocations';
import { deleteAssignee, insertAssignee } from "./action";
import { toast } from "sonner";

type PertTableRowProps = {
    pertTask: PertTaskDetail;
    readOnly: boolean;
    fte: number;
}

const calculateTe = (o: number, m: number, p: number) => {
    return (parseFloat(((o + 4*m + p)/6).toFixed(2)))
}

const calculateEffortPerAss = (allo: number, total: number) => {
    return ((allo * total).toFixed(2))
}

const biggestContribution = (assignments: Allocation[]) => {
    if (assignments.length === 0) {
        return 0
    }

    const maxAllocation = Math.max(...assignments.map(a => a.allocation))

    return maxAllocation
}

const useAddAssigneeMutation = () =>
    useMutation({
        mutationFn: async (assignee: Allocation) => {
            await insertAssignee(assignee)
        },
        onError: (error) => {
            const errorMessage =
                error instanceof Error ? error.message : 'An unknown error occurred.';
            toast.error(errorMessage);
        },
    });

    const useDeleteAssigneeMutation = () =>
        useMutation({
            mutationFn: async (allocationId: number) => {
                await deleteAssignee(allocationId)
            },
            onError: (error) => {
                const errorMessage =
                    error instanceof Error ? error.message : 'An unknown error occurred.';
                toast.error(errorMessage);
            },
        });

export default function PertTableRow({ pertTask, readOnly, fte }: PertTableRowProps) {

    const {pert, setPert} = usePertContext()

    const addAssignee = useAddAssigneeMutation()
    const deleteAssignee = useDeleteAssigneeMutation()

    const handleChangeEstimation = (id: number, field: 'o' | 'm' | 'p', value: number) => {
        const newPert = pert.map(task => task.id === id ? { ...task, [field]: value } : task)
        setPert(newPert);
    };

    const handleChangeAllocation = (pertId: number, allocationId: number, newValue: number) => {
        const newPert = pert.map(task =>
            task.id === pertId ? {
                ...task,
                assignments: task.assignments.map(assignment =>
                    assignment.id === allocationId ? {
                        ...assignment, allocation: newValue
                    } : assignment
                ),
            } : task
        )
        setPert(newPert);
    };

    const addnewAssignee = (pertId: number) => {
        const assignment : Allocation = {id: 0, pertId: pertId, allocation: 0, name: 'Team member'}
        addAssignee.mutate(
            assignment
        )
        const newPert = pert.map(task => 
            task.id === pertId ? {
                ...task,
                assignments: [...task.assignments, assignment]
            } : task
        )
        setPert(newPert)
    }

    const removeAssignee = (pertId: number, allocationId: number) => {
        deleteAssignee.mutate(
            allocationId
        )
        const newPert = pert.map(task =>
            task.id === pertId ? {
                ...task,
                assignments: task.assignments.filter(assignee => assignee.id !== allocationId),
            } : task
        )
        console.log(newPert)
        setPert(newPert);
    }

    return (
        <>
            {pertTask.assignments.map((assignment, index) => (
            <tr key={`${pertTask.id}-${index}`} className="divide-x divide-gray-200">
                {index === 0 && (
                    <>
                        <td className={`px-6 whitespace-nowrap text-center text-gray-900 bg-[#d3d3ff] font-medium text-sm`} rowSpan={pertTask.assignments.length}>{pertTask.name}</td>
                        <td className={`text-center px-6 text-sm font-medium text-gray-900 bg-[#d3d3ff]`} rowSpan={pertTask.assignments.length}>
                            {readOnly ? (
                                <>{pertTask.o}</>
                            ) : (
                                <input
                                    type="number"
                                    value={pertTask.o}
                                    onChange={e => handleChangeEstimation(pertTask.id, 'o', Number(e.target.value))}
                                    className={`shadow appearance-none border rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]`}
                                />
                            )}
                        </td>
                        <td className={`text-center py-1 px-6 text-sm font-medium text-gray-900 bg-[#d3d3ff]`} rowSpan={pertTask.assignments.length}>
                            {readOnly ? (
                                <>{pertTask.m}</>
                            ) : (
                                <input
                                    type="number"
                                    value={pertTask.m}
                                    onChange={e => handleChangeEstimation(pertTask.id, 'm', Number(e.target.value))}
                                    className={`shadow appearance-none border rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]`}
                                />
                            )}
                        </td>
                        <td className={`text-center px-6 text-sm font-medium text-gray-900 bg-[#d3d3ff]`} rowSpan={pertTask.assignments.length}>
                            {readOnly ? (
                                <>{pertTask.p}</>
                            ) : (
                                <input
                                    type="number"
                                    value={pertTask.p}
                                    onChange={e => handleChangeEstimation(pertTask.id, 'p', Number(e.target.value))}
                                    className={`shadow appearance-none border rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]`}
                                />
                            )}
                        </td>
                        <td className={`px-6 whitespace-nowrap text-center text-sm font-medium text-gray-900 bg-[#d3d3ff]`} rowSpan={pertTask.assignments.length}>
                            {calculateTe(pertTask.o, pertTask.m, pertTask.p)}
                        </td>
                    </>
                )}
                <td className={`px-6 py-2 whitespace-nowrap text-center border-l border-gray-200 text-sm font-medium text-gray-900 bg-[#d3d3ff]`}>
                    {assignment.name}
                    {readOnly ? (
                        null
                    ) : (
                        <div className="flex flex-row items-center justify-between">
                    {index === pertTask.assignments.length - 1 ? (
                        <Button
                            className="flex items-center justify-center rounded-md bg-[#d3d3ff] mt-1 w-4 h-4 transition duration-200 ease-in-out hover:border-2 hover:border-[#0101bf] hover:bg-white"
                            onClick={() => addnewAssignee(pertTask.id)}
                        >
                        +
                        </Button>
                    ) : null}
                    {pertTask.assignments.length === 1 ? null : (
                        <Button
                            className="flex items-center justify-center rounded-md bg-[#d3d3ff] mt-1 w-4 h-4 transition duration-200 ease-in-out hover:border-2 hover:border-[#0101bf] hover:bg-white"
                            onClick={() => removeAssignee(pertTask.id, assignment.id)}
                        >
                        -
                        </Button>
                    )}

                    </div>
                    )}
                </td>
                <td className={`text-center px-6 text-sm font-medium text-gray-900 bg-[#d3d3ff]`}>
                    {readOnly ? (
                        <>{assignment.allocation}</>
                    ) : (
                        <input
                            type="number"
                            value={assignment.allocation}
                            onChange={e => handleChangeAllocation(pertTask.id, assignment.id, Number(e.target.value))}
                            className={`shadow appearance-none border rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]`}
                        />
                    )}
                </td>
                <td className={`px-6 whitespace-nowrap text-center text-sm font-medium text-gray-900 bg-[#d3d3ff]`}>
                    {calculateEffortPerAss(assignment.allocation, calculateTe(pertTask.o, pertTask.m, pertTask.p))}
                </td>
                {index === 0 && (
                    <td className={`px-6 whitespace-nowrap text-center text-sm font-medium text-gray-900 bg-[#d3d3ff]`} rowSpan={pertTask.assignments.length}>
                        {(biggestContribution(pertTask.assignments)*calculateTe(pertTask.o, pertTask.m, pertTask.p)*(1+fte)).toFixed(2)}
                    </td>
                )}
            </tr>
        ))}
        </>
    );
}
