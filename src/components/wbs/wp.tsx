import { ArcherElement } from 'react-archer';

type WorkPackageProps = {
    level: number;
    name: string;
    children?: string[];
}

export const WorkPackage = ({level, name, children}: WorkPackageProps) => {

    if (level === 0 && children) {
        return (
            <ArcherElement
                id={name}
                relations={
                    children.map((child) => ({
                        targetId: child,     
                        targetAnchor: 'top',     
                        sourceAnchor: 'bottom',
                        style: {lineStyle: 'angle'}  
                    }))
                }
            >
                <div className='flex justify-center items-center p-6 rounded-lg bg-[#f3f2fe] text-xl'>
                    {name}
                </div>
            </ArcherElement>
        )
    } else if (level === 0 && !children) {
        return (
            <ArcherElement
                id={name}
            >
                <div className='flex justify-center items-center p-6 rounded-lg bg-[#f3f2fe] text-xl'>
                    {name}
                </div>
            </ArcherElement>
        )
    } else if (!children || children?.length === 0) {
        const textSize = level === 3 ? 'text-xs' : level === 2 ? 'text-sm' : 'text-md'
        const shift = level === 2 || level === 3 ? 'ml-6' : ''
        return (
            <ArcherElement
                id={name}
            >
                <div className={`${textSize} w-5/12 flex justify-center items-center rounded-lg bg-[#f3f2fe] p-2`}>
                    {name}
                </div>
            </ArcherElement>
        )
    } else {
        const textSize = level === 3 ? 'text-xs' : level === 2 ? 'text-sm' : 'text-md'
        const shift = level === 2 || level === 3 ? 'ml-6' : ''
        return (
            <ArcherElement
                id={name}
                relations={
                    children.map((child) => ({
                        targetId: child,     
                        targetAnchor: 'left',     
                        sourceAnchor: 'bottom',  
                    }))
                }
            >
                <div className={`${textSize} w-5/12 flex justify-center items-center rounded-lg bg-[#f3f2fe] p-2`}>
                    {name}
                </div>
            </ArcherElement>
        )
    }
}