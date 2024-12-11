'use client';


import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { WorkPackageMap } from './action';
import { Button } from '../button';
import { useWPSContext } from './wps-provider';

type TaskLevelArray = string[][]

const getWPByLevels = (WPMap: WorkPackageMap) => {
    const rootTasks = Object.keys(WPMap).filter(task =>
        !Object.values(WPMap).some(subTasks => subTasks.includes(task))
    );

    const levels: TaskLevelArray = [];
    let currentLevel = rootTasks;

    while (currentLevel.length > 0) {
        levels.push(currentLevel);
        const nextLevel: string[] = [];

        currentLevel.forEach(task => {
            const subTasks = WPMap[task]; 
            if (Array.isArray(subTasks)) {
                nextLevel.push(...subTasks); 
            }
        });

        currentLevel = nextLevel;
    }

    return levels;
};

const useDeleteWpMutation = (
    wps: WorkPackageMap,
    setWps: (wps: WorkPackageMap) => void,
    setLevels: (levels: TaskLevelArray) => void
) =>
    useMutation({
        mutationFn: async (name: string) => {
            const deleteWpAndChildren = (wpName: string, wpsMap: WorkPackageMap): WorkPackageMap => {
                let updatedWps = { ...wpsMap };
            
                const children = updatedWps[wpName] || [];
            
                children.forEach(child => {
                    if (updatedWps[child]) {
                        updatedWps = deleteWpAndChildren(child, updatedWps);
                    }
                });
            
                delete updatedWps[wpName];
            
                Object.keys(updatedWps).forEach(parent => {
                    updatedWps[parent] = updatedWps[parent].filter(child => child !== wpName);
                });
            
                return updatedWps;
            };

            const updatedWps = deleteWpAndChildren(name, wps);
            console.log(updatedWps)
            setWps(updatedWps);

            const computedLevels = getWPByLevels(updatedWps);
            setLevels(computedLevels);

            return updatedWps;
        },
        onError: (error) => {
            const errorMessage =
                error instanceof Error ? error.message : 'An unknown error occurred.';
            toast.error(errorMessage);
        },
    });


export const DeleteWP = ({name}: {name: string}) => {
    const { wps, setWps, setLevels } = useWPSContext()
    
    const deleteProject = useDeleteWpMutation(wps, setWps, setLevels);
    
    const onClickDelete = () => {
        deleteProject.mutate(
            name
        )
    }
    
    return (
        <div>
            <Button
                type='button'
                onClick={onClickDelete}
                className="flex text-red-400 items-center justify-center bg-white mt-1 w-4 h-4 transition duration-200 ease-in-out hover:border-2 hover:border-red-400"
            >
                -
            </Button>
        </div>
        )
    }
