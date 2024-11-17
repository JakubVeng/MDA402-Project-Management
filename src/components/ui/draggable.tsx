'use client'

import {useDraggable} from '@dnd-kit/core';

type DraggableProps = {
    id: number;
    children: React.ReactNode;
    disabled: boolean;
}

export function Draggable(props: DraggableProps) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
    disabled: props.disabled
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}