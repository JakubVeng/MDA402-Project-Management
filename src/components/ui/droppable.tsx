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

    const blueOver = props.id !== 'basic' ? (isOver ? 'rounded-3xl mt-1 border-solid border-4 border-[#0101bf] w-[200px] h-[120px]' : 'rounded-3xl mt-1 border-dashed border-2 border-gray-300 w-[200px] h-[120px]') : 'rounded-3xl w-[200px] h-[120px]';
    
    const styling = props.className ? props.className + blueOver : blueOver

    return (
        <div ref={setNodeRef} className={styling}>
            {props.children}
        </div>
    );
}