'use client'

import { useEffect } from "react";
import PertTableRow from "./pert-table-row";
import { usePertContext } from "./pert-tasks-provider";
import { useMutation } from "@tanstack/react-query";
import { PertPracticeDetail, PertTaskDetail } from "./type";
import { toast } from "sonner";
import { updatePertEstimates } from "./action";

const usePertMutation = () =>
    useMutation({
        mutationFn: async (pert: PertTaskDetail[]) => {
            await updatePertEstimates(pert)
        },
        onError: (error) => {
            const errorMessage =
                error instanceof Error ? error.message : 'An unknown error occurred.';
            toast.error(errorMessage);
        },
    });

type PertTableProps = {
    className: string,
    readOnly: boolean
}

export default function PertTable({className, readOnly}: PertTableProps) {

    const { pert } = usePertContext()

    const addPert = usePertMutation();

    useEffect(() => {
        addPert.mutate(
            pert
        )
      }, [pert]);

    return (
        <div className={`${className} flex flex-col items-center mt-8`}>
            <table className="min-w-full divide-y divide-gray-200 shadow-lg bg-white rounded-lg overflow-hidden">
                <thead className=" bg-gray-100 text-white">
                    <tr>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">Work package</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">o</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">m</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">p</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">te (MD)</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">Assigned</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">Time allocation</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">Duration per assignmemt</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">Duration in calendar days</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pert.map((data, index) => (
                        <PertTableRow key={index} pertTask={data} readOnly={readOnly} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
