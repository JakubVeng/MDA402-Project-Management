import {auth} from "@/server/auth";

import { getAdminEmails, getAllLectures, getNarrative } from '@/components/lectures/action';
import { getAllPractices } from "@/components/practices/action";
import { PracticeSnippet } from "@/components/practices/practice-snippet";
import { RightSidebarPractice } from "@/components/practices/right-side-bar-practice";
import { EditableTextArea } from "@/components/ui/editable-text-area";


export default async function Practices() {
    const practices = await getAllPractices()
    const session = await auth();
    const admin_emails = await getAdminEmails()
    const narrative = await getNarrative('practices')

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
                            <EditableTextArea text={narrative ? narrative : ''} type1='practices' practiceName={null}/>
                        ) : (
                            <p>{narrative ? narrative : ''}</p>
                        )}
                    </article>
                </div>
                <div className='flex flex-col py-4 space-y-6'>
                    <h2 className="text-[#0101bf] text-3xl font-bold">Course practices</h2>
                    {practices.map((practice, index) => (
                        <PracticeSnippet practice={practice} editor={editor} key={index}/>
                    ))}
                </div>
            </div>
            <div className='hidden sticky top-20 h-[calc(100vh-103px)] lg:flex border-l border-[#e3e8ef] lg:w-1/4'>
                <RightSidebarPractice practices={practices} />
            </div>
        </main>
    );

}
