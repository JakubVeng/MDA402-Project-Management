'use client'

import { PDMType } from '@/db/schema/pdm-types';
import { usePDMContext } from './pdm-provider';
import { CreatePDMForm } from './create-pdm-form';
import { AddNewPDM } from './add-new-PDM';
import { DeleteDialog } from '../delete-dialog';
import { DeletePDM } from './delete-all-button';

export const AddPDM = ({
    pertTasks,
    pdmTypes,
}: {
    pertTasks : { id: number, name: string }[];
    pdmTypes: PDMType[]
}) => {
    
    const { pdms } = usePDMContext()
    console.log(pdms)
    
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            {pdms.map((item, index) => (
                <div key={index}>
                    <CreatePDMForm pdm={item} pdmTypes={pdmTypes} pertTasks={pertTasks}/>
                </div>
            ))}
            <div className='flex flex-row justify-center items-center space-x-4'>
                <AddNewPDM />
                <DeleteDialog>
                    <DeletePDM />
                </DeleteDialog>
            </div>
        </div>
    )
}
