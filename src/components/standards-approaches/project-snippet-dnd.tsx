'use client'

import { DndContext } from '@dnd-kit/core';
import { DragEndEvent } from '@dnd-kit/core';
import { ArrowRight } from 'lucide-react';
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Project } from "@/db/schema/projects";
import { useEffect, useState } from "react";
import { Droppable } from '../ui/droppable';
import { Draggable } from '../ui/draggable';
import { Button } from '../button';

type ProjectSnippetDndProps = {
    projects: Project[];
}

export const ProjectSnippetDnd = ({projects}: ProjectSnippetDndProps) => {

    const [projectNumber, setProjectNumber] = useState<number>(0);
    const project = projects[projectNumber]
    const [isStandards, setIsStandards] = useState(true);

    const [isCorrect, setIsCorrect] = useState(false);
    const [isIncorrect, setIsIncorrect] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isCorrect) {
          timer = setTimeout(() => {
            setIsCorrect(false);
          }, 700);
        }

        return () => clearTimeout(timer);
      }, [isCorrect]);

      useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isIncorrect) {
          timer = setTimeout(() => {
            setIsIncorrect(false);
          }, 700);
        }

        return () => clearTimeout(timer);
      }, [isIncorrect]);

    const standards = ['prince2', 'pmbok', 'ipma']
    const approaches = ['unifiedProcess', 'scrum']

    const drop = isStandards ? standards: approaches

    const [isAnswered, setIsAnswered] = useState(0);

    function renderCorrectAnswer(value: number, project: Project) {
        const standards: Array<keyof Pick<Project, "prince2" | "pmbok" | "ipma">> = [
            "prince2",
            "pmbok",
            "ipma",
        ];
          
        const approaches: Array<keyof Pick<Project, "unifiedProcess" | "scrum">> = [
            "unifiedProcess",
            "scrum",
        ];

        const correctStandards = standards.filter(key => project[key] === true);
        const correctApproaches = approaches.filter(key => project[key] === true);

        const formattedStandards = correctStandards.map(key => key.toUpperCase()).join(', ');
        const formattedApproaches = correctApproaches
        .map(key => key === "unifiedProcess" ? "UNIFIED PROCESS" : key.toUpperCase())
        .join(', ');

        if (value === 1) {
            return (
                <div className='flex flex-row'>
                    <p className="mr-4">Correct standards: {formattedStandards}</p>
                </div>
            )
        } else if (value === 2) {
            return (
                <div className='flex flex-row'>
                    <p className="mr-4">Correct standards: {formattedStandards}</p>
                    <p className="mr-4">Correct approach: {formattedApproaches}</p>
                </div>
            )
        } else return null
    }

    function handleDragEnd(event: DragEndEvent) {
        const { over } = event;

        if (!over || over.id === 'basic') return;

        const overId = over.id as keyof Project;

        if (project[overId] === true) {
            setIsAnswered(isAnswered + 1);
            setIsCorrect(true);
            setIsStandards(false);
          } else {
            setIsIncorrect(true);
          }
    }

    const onClick = (direction: 'previous' | 'next') => {
        if (direction === 'previous') {
            setProjectNumber(projectNumber - 1)
        } else setProjectNumber(projectNumber + 1)
        setIsAnswered(0)
        setIsStandards(true)
        setIsCorrect(false)
        setIsIncorrect(false)
    }

    function renderButtons(value: number, maxValue: number) {
        if (value === 0) {
            return (
                <div className='flex flex-row space-x-4 justify-center items-center'>
                    <Button 
                        onClick={() => onClick('next')}
                        className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-[#0101bf]"
                    >
                        Next
                    </Button>
                </div>
            )
        } else if (value === maxValue) {
            return (
                <div className='flex flex-row space-x-4 justify-center items-center'>
                    <Button 
                        onClick={() => onClick('previous')}
                        className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-[#0101bf]"
                    >
                        Previous
                    </Button>
                </div>
            )
        } else {
            return (
                <div className='flex flex-row space-x-4 justify-center items-center'>
                    <Button 
                        onClick={() => onClick('previous')}
                        className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-[#0101bf]"
                    >
                        Previous
                    </Button>
                    <Button 
                        onClick={() => onClick('next')}
                        className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-[#0101bf]"
                    >
                        Next
                    </Button>
                </div>
            )
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div id={project.name} className="flex flex-col w-2/3 bg-[#f3f2fe] p-6 rounded-xl shadow-sm space-y-2 scroll-mt-20">
                <div className="flex flex-row justify-between">
                    <h3 className="text-xl text-[#0101bf] font-bold">Project {projectNumber + 1} - {project.name}</h3>
                </div>
                <p>{project.description}</p>
                {renderCorrectAnswer(isAnswered, project)}
                {isAnswered === 2 ? (
                    <div>
                        {renderButtons(projectNumber, projects.length - 1)}
                    </div>
                ) : (
                    <div className='flex flex-col justify-center items-center space-y-4'>
                        {isStandards ? (<p className='text-[#0101bf]'>Select correct standards with</p>) : (<p className='text-[#0101bf]'>Select correct approaches</p>)}
                        <Droppable id='basic' className='flex items-center justify-center '>
                            <Draggable id={project.id} disabled={false}>
                                <div className='flex items-center justify-center bg-white border-2 border-gray-300 rounded-3xl w-[190px] h-[100px]'>
                                    <p>{project.name}</p>
                                </div>
                            </Draggable>
                        </Droppable>
                        <div className='flex flex-row space-x-6 items-center justify-center'>
                            {drop.map((item, index) => (
                                <Droppable key={index} id={item} className='flex items-center justify-center bg-white '>
                                    <div>
                                        {item === 'unifiedProcess' ? <p>UNIFIED PROCESS</p> : (
                                            <p>{item.toUpperCase()}</p>
                                        )}
                                    </div>
                                </Droppable>
                            ))}
                        </div>
                        <div className={`${isIncorrect || isCorrect ? 'text-black' : 'text-[#f3f2fe]'}`}>
                            {isCorrect && !isIncorrect ? (
                                <p>Correct!</p>
                            ) : (
                                <p>Incorrect! Try again!</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DndContext>
    )
}