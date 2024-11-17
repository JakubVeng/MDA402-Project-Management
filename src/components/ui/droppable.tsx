'use client'

import {useDroppable} from '@dnd-kit/core';

type DroppableProps = {
    id: number | string;
    children: React.ReactNode;
    className?: string;
}

export function Droppable(props: DroppableProps) {
    const {isOver, setNodeRef} = useDroppable({
        id: props.id,
    });

    const greenOver = props.id !== 'basic' ? isOver ? 'bg-white rounded-3xl mt-1 border-solid border-4 border-green-700 w-[170px] mob:w-[220px] sm:w-[300px] lg:w-[400px]' : 'bg-white rounded-3xl mt-1 border-dashed border-2 border-gray-300 w-[170px] mob:w-[220px] sm:w-[300px] lg:w-[400px]' : 'bg-white rounded-3xl w-[170px] mob:w-[220px] sm:w-[300px] lg:w-[400px]';
    
    const styling = props.className ? props.className + greenOver : greenOver

    return (
        <div ref={setNodeRef} className={styling}>
            {props.children}
        </div>
    );
}