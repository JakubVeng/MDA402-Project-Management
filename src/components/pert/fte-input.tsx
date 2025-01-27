'use client'

import { useMutation } from "@tanstack/react-query";
import { updateFTE } from "./action";
import { useState } from "react";
import { toast } from "sonner";

type FTEInputProps = {
    fte: number
}

const useUpdateFTEMutation = () =>
    useMutation({
        mutationFn: async ({ fte }: { fte: number }) => {
            return await updateFTE(fte);
        },
    });

export const FTEInput = ({ fte } : FTEInputProps) => {

    const [initialFTE, setFTE] = useState(fte)

    const updateFTE = useUpdateFTEMutation()

    const handleChange = (fte: number) => {
        updateFTE.mutate(
            { fte: fte},
            {
                onSuccess: () => {
                    setFTE(fte); // Update local state on success
                },
                onError: () => {
                    toast.error("Something went wrong!");
                },
            }
        );
    }
    return (
        <div className="flex flex-row space-x-8 items-center justify-center">
            <p className="text-xl text-nowrap">Administrative overhead:</p>
            <input
                type="number"
                value={initialFTE}
                onChange={e => handleChange(Number(e.target.value))}
                className={`shadow appearance-none border rounded-lg p-2 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]`}
            />
        </div>
    )
};
