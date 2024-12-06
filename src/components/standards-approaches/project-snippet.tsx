'use client'

import { Project } from "@/db/schema/projects";
import { AddProjectDialog } from "./add-project-dialog";
import { AddProjectForm } from "./add-project-form";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { DeleteProject } from "./delete-project";
import { ChangeAnswerButton } from "./change-correct-answer-button";
import { ChangeAnswerDialog } from "./change-answer-dialog";

type ProjectSnippetProps = {
    project: Project;
    index: number;
}

export const ProjectSnippet = ({project, index}: ProjectSnippetProps) => {

    const standorApp: Array<keyof Pick<Project, "prince2" | "pmbok" | "ipma" | "scrum" | "unifiedProcess">> = [
        "prince2",
        "pmbok",
        "ipma",
        "unifiedProcess",
        "scrum"
    ];

    function renderStandOrApp(standOrApp: string) {
        if (standOrApp === 'unifiedProcess') {
            const correctStandOrApp = 'UNIFIED PROCESS'

            return (
                <p className="text-black">{correctStandOrApp}:</p>
            )
        } else {
            const correctStandOrApp = standOrApp.toUpperCase()
            return (
                <p className="text-black">{correctStandOrApp}:</p>
            )
        }
    }


    return (
        <div id={project.name} className="flex flex-col w-2/3 bg-[#f3f2fe] p-6 rounded-xl shadow-sm space-y-2 scroll-mt-20">
            <div className="flex flex-row justify-between">
                <h3 className="text-xl text-[#0101bf] font-bold">Project {index + 1} - {project.name}</h3>
            </div>
            <p>{project.description}</p>
            <div className='flex flex-row items-center justify-end p-1'>
                <div className="flex flex-row space-x-4">
                    <ChangeAnswerDialog>
                        <div className="flex flex-row space-x-4 justify-between items-center p-3">
                            {standorApp.map((standorApp, index) => (
                                <div key={index} className="flex flex-row space-x-2 justify-center items-center">
                                    {renderStandOrApp(standorApp)}
                                    <ChangeAnswerButton project={project} standOrApp={standorApp}/>
                                </div>
                            ))}
                        </div>
                    </ChangeAnswerDialog>
                    <AddProjectDialog initialData={project}>
                        <AddProjectForm initialData={project}/>
                    </AddProjectDialog>
                    <DeleteProjectDialog>
                        <DeleteProject  projectId={project.id}/>
                    </DeleteProjectDialog>
                </div>
            </div>
        </div>
    )
}