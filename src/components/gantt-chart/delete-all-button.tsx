'use client'

import { useMutation } from '@tanstack/react-query';
import { deletePDM } from './action';
import { toast } from 'sonner';
import { Button } from '../button';
import { usePDMContext } from './pdm-provider';

const useDeletePDMMutation = () => 
    useMutation({
        mutationFn: async () => {
            try {
                await deletePDM()
                toast.success(`PDM succesfully deleted!`);
            } catch {
                toast.error('Something went wrong!')
            }
        }
    })


export const DeletePDM = () => {
    const { setPDM } = usePDMContext()

    const deletePDM = useDeletePDMMutation()
    
    const handleOnClick = () => {
        deletePDM.mutate()
        setPDM([])
    }
    
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <p>Are you sure you want to delete PDM?</p>
            <Button
                type='button'
                onClick={handleOnClick}
                className="bg-red-500 border-2 border-red-500 text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-red-500"
            >
                Delete
            </Button>
        </div>
    )
}