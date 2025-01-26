'use client'

import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { EditTextarea } from "react-edit-text";
import { updateNarrative } from "../lectures/action";
import { toast } from "sonner";
import { updatePracticeNarrative } from "../practices/action";

type EditableTextAreaProps = {
    text: string;
    type1: 'lectures' | 'practices' | null;
    practiceName: 'Standards and approaches' | 'WBS' | 'Pert' | 'Gantt chart' | null;
};

const useUpdateNarrativeMutation = () =>
    useMutation({
        mutationFn: async ({ text, type }: { text: string; type: string }) => {
            return await updateNarrative({ text, type });
        },
    });

const useUpdatePracticeNarrativeMutation = () =>
    useMutation({
        mutationFn: async ({ text, name }: { text: string; name: string }) => {
            return await updatePracticeNarrative({ text, name });
        },
    });

export function EditableTextArea(props: EditableTextAreaProps) {
    const { text: initialText, type1, practiceName } = props;
    console.log(initialText)
    // Local state for text
    const [text, setText] = useState(initialText);

    const updateNarrative = useUpdateNarrativeMutation();
    const updatePracticeNarrative = useUpdatePracticeNarrativeMutation();

    const rowNumber = () => {
        if (type1 === 'lectures' && !practiceName) {
            return 20
        } else if (type1 === 'practices' && !practiceName){
            return 10
        } else {
            return 5
        }
    }

    const handleChange = (text1: string) => {
        if (type1) {
            updateNarrative.mutate(
                { text: text1, type: type1 },
                {
                    onSuccess: () => {
                        setText(text1); // Update local state on success
                    },
                    onError: () => {
                        toast.error("Something went wrong!");
                    },
                }
            );
        } else if (practiceName) {
            updatePracticeNarrative.mutate(
                { text: text1, name: practiceName },
                {
                    onSuccess: () => {
                        setText(text1); // Update local state on success
                    },
                    onError: () => {
                        toast.error("Something went wrong!");
                    },
                }
            )
        }
    };

    return (
        <div>
            <EditTextarea
                className="rounded-xl w-full"
                rows={rowNumber()}
                value={text} // Use local state as the value
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    );
}
