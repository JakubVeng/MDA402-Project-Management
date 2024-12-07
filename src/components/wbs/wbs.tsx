'use client'

import { WorkPackageMap } from "./action"
import { ArcherContainer } from 'react-archer';
import { WorkPackage } from "./wp";

type WBSProps = {
    wps: WorkPackageMap
}

type TaskLevelArray = string[][]

export const WBS = ({wps}: WBSProps) => {

    const getWPByLevels = (WPMap: WorkPackageMap) => {
        // Find root tasks (tasks that are not sub-tasks of any other task)
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

    const levels = getWPByLevels(wps)

    const level1Length = levels[1] ? levels[1].length : 1;
    const dynamicWidth = 100 / level1Length;

    return (
        <ArcherContainer endMarker={false} lineStyle="curve" strokeColor="#0101bf">
            <div className="flex flex-col justify-center items-center space-y-10 w-[calc(80vw)]">
            <div className="flex justify-center items-center">
                    {levels[0] ? (
                        <div className="flex flex-col items-end">
                            <WorkPackage level={0} name={levels[0][0]} children={wps[levels[0][0]]} />
                        </div>
                    ) : null}
                </div>
                {levels[1] ? (
                    <div className="flex flex-row w-full ml-24">
                        {levels[1].map((wp, index) => (
                            <div key={index} className="flex" style={{ width: `${dynamicWidth}%` }}>
                                <WorkPackage level={1} name={wp} children={wps[wp]} />
                            </div>
                        ))}
                    </div>
                ) : null}
                {levels[1] ? (
                    <div className="flex flex-row w-full ml-24">
                    {levels[1].map((wp, index) => (
                        <div key={index} className='flex flex-col items-center space-y-12' style={{ width: `${dynamicWidth}%` }}>
                            {wps[wp].map((wp1, index) => (
                                <div key={index} className="flex flex-col justify-center items-center space-y-8 w-full ">
                                    <WorkPackage level={2} name={wp1} children={wps[wp1]} />
                                    {wps[wp1].map((wp2, index) => (
                                        <div key={index} className="flex flex-col justify-end items-end space-y-4 w-full">
                                            <WorkPackage level={3} name={wp2} children={wps[wp2]} />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                    </div>
                ): null}
            </div>
        </ArcherContainer>
    )
}