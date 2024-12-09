'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getChildlessWP, insertDataToDB, insertToPert, WorkPackageMap } from './action';
import { Button } from '../button';
import { useWPSContext } from './wps-provider';


const useAddWBSMutation = () =>
    useMutation({
        mutationFn: async (wps: WorkPackageMap) => {
            await insertDataToDB(wps)
            const ids = await getChildlessWP()
            await insertToPert(ids)
        },
        onError: (error) => {
            const errorMessage =
                error instanceof Error ? error.message : 'An unknown error occurred.';
            toast.error(errorMessage);
        },
    });


export const AddWBS = () => {
    const { wps } = useWPSContext()
    
    const addWBS = useAddWBSMutation();
    
    const onClickSubmit= () => {
        addWBS.mutate(
            wps
        )
    }
    
    return (
        <div>
            <Button
                type='button'
                onClick={onClickSubmit}
                className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-[#0101bf]"
            >
                Submit
            </Button>
        </div>
        )
    }
