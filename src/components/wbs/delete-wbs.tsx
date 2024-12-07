'use client';


import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '../button';
import { useWPSContext } from './wps-provider';
import { deleteWBS } from './action';

const useDeleteWBSMutation = () =>
    useMutation({
        mutationFn: async () => {
            try {
                await deleteWBS()
                toast.success('WBS deleted!')
            } catch {
                return 
            }
        },
    });


export const DeleteWBS = () => {
    
    const deleteProject = useDeleteWBSMutation();
    
    const onClickDelete = () => {
        deleteProject.mutate()
    }
    
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <p>Are you sure you want to delete WBS (you would need to then also set up new PERT practices and Gantt practice)?</p>
            <Button
                type='button'
                onClick={onClickDelete}
                className="bg-red-500 border-2 border-red-500 text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-red-500"
            >
                Confirm
            </Button>
        </div>
        )
    }
