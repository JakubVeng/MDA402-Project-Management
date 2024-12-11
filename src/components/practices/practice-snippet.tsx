'use client'

import Link from "next/link"
import { ArrowRight } from 'lucide-react';
import { Practice } from "@/db/schema/practices";
import { IsAvailablePracticeButton } from "./isAvailable-practice-button";

type PracticeSnippetProps = {
    practice: Practice; 
    editor: true | false;
}


export const PracticeSnippet = ({practice, editor}: PracticeSnippetProps) => {
    const dashedName = practice.name.toLowerCase().replace(/\s+/g, '-');

    return (
        <div id={practice.id.toString()} className="flex flex-col bg-[#f3f2fe] p-6 rounded-xl shadow-sm space-y-2 scroll-mt-20">
            <div className="flex flex-row justify-between">
                <h3 className="text-xl text-[#0101bf] font-bold">{practice.name}</h3>
                {practice.isAvailable || (!practice.isAvailable && editor) ? (
                    <Link 
                        href={`/practices/${dashedName}`} 
                        className="flex flex-row border-b-2 border-[#f3f2fe] items-center gap-2 text-[#0101bf] text-center transition duration-200 ease-in-out hover:border-[#0101bf]"
                    >
                        More details
                        <ArrowRight size={20} />
                    </Link>
                ) : (
                    <p className="text-[#BCBCC1]">Not available</p>
                )}
            </div>
            <p>{practice.description}</p>
            {!editor ? null : (
                <div className='flex flex-row items-center justify-between p-1'>
                    <div className="flex flex-row space-x-4 items-center">
                        <span>Accessible by students:</span>
                        <IsAvailablePracticeButton practice={practice} />
                    </div>
                </div>
            )}
        </div>
    )
}