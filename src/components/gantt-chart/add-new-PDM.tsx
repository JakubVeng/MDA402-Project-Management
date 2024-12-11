'use client';


import { revalidatePath } from 'next/cache';
import { Button } from '../button';
import { usePDMContext } from './pdm-provider';


export const AddNewPDM = () => {
    
    const { pdms, setPDM } = usePDMContext()
    console.log(pdms)
    
    const handleOnClick = () => {
        const newPdms = [...pdms, { id: 0, predecessorId: -1, successorId: -1, pdmTypeId: -1 }]
        console.log(newPdms)
        setPDM(newPdms)
    }
    
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <Button
                type='button'
                onClick={handleOnClick}
                className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-[#0101bf]"
            >
                Add new PDM
            </Button>
        </div>
    )
}
