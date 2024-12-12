import { ArcherElement } from 'react-archer';
import { AddWPDialog } from "./create-wp-dialog";
import { AddWPForm } from "./create-wp-form";
import { DeleteWP } from './delete-wp';

type WorkPackageProps = {
    level: number;
    name: string;
    subTasks?: string[];
}

export const CreateWorkPackage = ({level, name, subTasks}: WorkPackageProps) => {

    if (level === 0 && subTasks) {
        return (
            <div>
                <ArcherElement
                id={name}
                relations={
                    subTasks.map((child) => ({
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
            <AddWPDialog>
                <AddWPForm parent={name}/>
            </AddWPDialog>
            </div>
        )
    } else if (level === 0 && !subTasks) {
        return (
            <div>
                <ArcherElement
                id={name}
            >
                <div className='flex justify-center items-center p-6 rounded-lg bg-[#f3f2fe] text-xl'>
                    {name}
                </div>
            </ArcherElement>
            <AddWPDialog>
                <AddWPForm parent={name}/>
            </AddWPDialog>
            </div>
        )
    } else if (!subTasks || subTasks?.length === 0) {
        const textSize = 'text-xs'
        return (
            <div className='w-5/12'>
                <ArcherElement
                    id={name}
                >
                    <div className={`${textSize} w-full flex justify-center items-center rounded-lg bg-[#f3f2fe] p-2`}>
                        {name}
                    </div>
                </ArcherElement>
                <div className='flex flex-row justify-between'>
                    <AddWPDialog>
                        <AddWPForm parent={name}/>
                    </AddWPDialog>
                    <DeleteWP name={name} />
                </div>
            </div>
        )
    } else {
        const textSize = 'text-xs'
        return (
            <div className='w-5/12'>
                <ArcherElement
                    id={name}
                    relations={
                        subTasks.map((child) => ({
                            targetId: child,     
                            targetAnchor: 'left',     
                            sourceAnchor: 'bottom',  
                        }))
                    }
                >
                    <div className={`${textSize} w-full flex justify-center items-center rounded-lg bg-[#f3f2fe] p-2`}>
                        {name}
                    </div>
                </ArcherElement>
                <div className='flex flex-row justify-between'>
                    <AddWPDialog>
                        <AddWPForm parent={name}/>
                    </AddWPDialog>
                    <DeleteWP name={name} />
                </div>
            </div>
            
        )
    }
}