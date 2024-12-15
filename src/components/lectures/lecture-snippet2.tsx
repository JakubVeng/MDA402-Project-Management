'use client'

import { Lecture } from "@/db/schema/lectures"
import Link from "next/link"
import { ArrowRight } from 'lucide-react';
import { useMutation } from "@tanstack/react-query";
import { deleteLecture } from "./action";
import { toast } from "sonner";
import { AddLectureForm } from "./add-lecture-form";
import { AddLectureDialog } from "./add-lecture-dialog";
import { IsAvailableButton } from "./isAvailable-button";
import { DeleteDialog } from "../delete-dialog";
import { DeleteLecture } from "./delete-lecture-form";

type LectureSnippetProps = {
    lecture: Lecture; 
    editor: true | false;
}

const useDeleteLectureMutation = () =>
    useMutation({
        mutationFn: async (id: number) => {
            try {
                await deleteLecture(id)
                toast.success('Lecture deleted!')
            } catch {
                return 
            }
        }
    })
/*
<div className="flex flex-row space-x-4">
    <AddLectureDialog initialData={lecture}>
        <AddLectureForm initialData={lecture}/>
    </AddLectureDialog>
    <DeleteDialog>
        <DeleteLecture lecture={lecture} />
    </DeleteDialog>
</div>
*/

export const LectureSnippet = ({lecture, editor}: LectureSnippetProps) => {
    const dashedName = lecture.name.toLowerCase().replace(/\s+/g, '-');
    const lectureId = `${dashedName}-${lecture.orderedItem}`
    const deleteLecture = useDeleteLectureMutation();

    const onClickDelete = () => {
        deleteLecture.mutate(
            lecture.orderedItem
        )
    }

    return (
        <div id={lectureId} className="flex flex-col bg-[#f3f2fe] p-6 rounded-xl shadow-sm space-y-2 scroll-mt-20">
            <div className="flex flex-row justify-between">
                <h3 className="text-xl text-[#0101bf] font-bold">Week {lecture.orderedItem} - {lecture.name}</h3>
                {lecture.isAvailable || (!lecture.isAvailable && editor) ? (
                    <Link 
                        href={`/lectures/${dashedName}`} 
                        className="flex flex-row border-b-2 border-[#f3f2fe] items-center gap-2 text-[#0101bf] text-center transition duration-200 ease-in-out hover:border-[#0101bf]"
                    >
                        More details
                        <ArrowRight size={20} />
                    </Link>
                ) : (
                    <p className="text-[#BCBCC1]">Not available</p>
                )}
            </div>
            <p>{lecture.description}</p>
            {!editor ? null : (
                <div className='flex flex-row items-center justify-between p-1'>
                    <div className="flex flex-row space-x-4 items-center">
                        <span>Accessible by students:</span>
                        <IsAvailableButton lecture={lecture} />
                    </div>
                </div>
            )}
        </div>
    )
}