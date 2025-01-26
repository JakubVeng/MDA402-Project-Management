import {auth} from "@/server/auth";

import { getAdminEmails, getAllLectures, getNarrative } from '@/components/lectures/action';
import { LectureSnippet } from '@/components/lectures/lecture-snippet2'
import { RightSidebar } from '@/components/lectures/right-side-bar';
import { AddLectureDialog } from "@/components/lectures/add-lecture-dialog";
import { AddLectureForm } from "@/components/lectures/add-lecture-form";
import { EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import React from 'react'
import { EditableTextArea } from "@/components/ui/editable-text-area";


export default async function Lectures() {
    const lectures = await getAllLectures()
    const session = await auth();
    const admin_emails = await getAdminEmails()
    const narrative = await getNarrative('lectures')
    console.log(narrative)

    let editor = false

    if (session?.user?.email) {
        editor = admin_emails.includes(session.user.email)
    }

    return (
        <main className="flex flex-row w-screen">
            <div className="flex flex-col py-8 px-12 w-3/4 space-y-4">
                <div className='flex flex-col space-y-6'>
                    <h2 className="text-[#0101bf] text-3xl font-bold">General information</h2>
                    <article>
                        {editor ? (
                            <EditableTextArea text={narrative ? narrative : ''} type1='lectures' practiceName={null}/>
                        ) : (
                            <p>{narrative ? narrative : ''}</p>
                        )}
                    </article>
                </div>
                <div className='flex flex-col py-4 space-y-6'>
                    <h2 className="text-[#0101bf] text-3xl font-bold">Course materials</h2>
                    {editor ? (
                        <AddLectureDialog initialData={null}>
                            <AddLectureForm initialData={null}/>
                        </AddLectureDialog>
                    ) : null }
                    {lectures.map((lecture, index) => (
                        <LectureSnippet lecture={lecture} editor={editor} key={index}/>
                    ))}
                </div>
            </div>
            <div className='hidden sticky top-20 h-[calc(100vh-103px)] lg:flex border-l border-[#e3e8ef] lg:w-1/4'>
                <RightSidebar lectures={lectures} />
            </div>
        </main>
    );

}
