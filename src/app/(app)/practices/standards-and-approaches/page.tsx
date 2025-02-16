import { getAdminEmails } from "@/components/lectures/action";
import { getPracticeNarrative } from "@/components/practices/action";
import { getAllCriteria, getProjects } from "@/components/standards-approaches/action";
import { AddProjectDialog } from "@/components/standards-approaches/add-project-dialog";
import { AddProjectForm } from "@/components/standards-approaches/add-project-form";
import ComparisonTable from "@/components/standards-approaches/compare-table";
import { ProjectSnippet } from "@/components/standards-approaches/project-snippet";
import { ProjectSnippetDnd } from "@/components/standards-approaches/project-snippet-dnd";
import { EditableTextArea } from "@/components/ui/editable-text-area";
import { auth } from "@/server/auth";


export default async function StandardsAndApproachesPage() {

    const projects = await getProjects()
    const criterias = await getAllCriteria()
    const narrative = await getPracticeNarrative('Standards and approaches')

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
                    <h2 className="text-[#0101bf] text-3xl font-bold">Select PM standard and SDLC approach</h2>
                </div>
                <div className="flex flex-col w-2/3 items-center space-y-4">
                    <article>
                        {editor ? (
                            <EditableTextArea text={narrative ? narrative : ''} type1={null} practiceName={'Standards and approaches'}/>
                        ) : (
                            <p>{narrative ? narrative : ''}</p>
                        )}
                    </article>
                </div>
            </div>
            <ComparisonTable criterias={criterias} />
            {editor ? (
                <div className="flex flex-col justify-center items-center w-full space-y-4">
                    <AddProjectDialog initialData={null}>
                        <AddProjectForm initialData={null} />
                    </AddProjectDialog>
                    {projects.map((project, index) => (
                        <ProjectSnippet project={project} index={index} key={index}/>
                    ))}
                </div>
            ) : (
                <ProjectSnippetDnd projects={projects}/>
            )}
            
        </div>
    )
}