'use client'

import { ArcherContainer } from 'react-archer';
import { WorkPackage } from "./wp";
import { useWPSContext } from "./wps-provider";
import { AddWPDialog } from "./create-wp-dialog";
import { AddWPForm } from "./create-wp-form";
import { CreateWorkPackage } from './create-wp';

export const CreateWBS = () => {

    const { wps, levels } = useWPSContext();

    const level1Length = levels[1] ? levels[1].length : 1;
    const dynamicWidth = 100 / level1Length;

    return (
        <ArcherContainer endMarker={false} lineStyle="curve" strokeColor="#0101bf">
            <div className="flex flex-col justify-center items-center space-y-10 w-[calc(80vw)]">
                <div className="flex justify-center items-center">
                    {levels[0] ? (
                        <div className="flex flex-col items-start">
                            {wps[levels[0][0]].length < 6 ? (
                                <CreateWorkPackage level={0} name={levels[0][0]} children={wps[levels[0][0]]} />
                            ) : (
                                <WorkPackage level={0} name={levels[0][0]} children={wps[levels[0][0]]} />
                            )}
                        </div>
                    ) : null}
                </div>
                {levels[1] ? (
                    <div className="flex flex-row w-full ml-24">
                        {levels[1].map((wp, index) => (
                            <div key={index} className="flex flex-col" style={{ width: `${dynamicWidth}%` }}>
                                <CreateWorkPackage level={1} name={wp} children={wps[wp]} />
                            </div>
                        ))}
                    </div>
                ) : null}
                {levels[1] ? (
                    <div className="flex flex-row w-full ml-24">
                    {levels[1].map((wp, index) => (
                        <div key={index} className='flex flex-col items-center space-y-12' style={{ width: `${dynamicWidth}%` }}>
                            {(wps[wp] || []).map((wp1, index) => (
                                <div key={index} className="flex flex-col justify-center items-center w-full ">
                                    <CreateWorkPackage level={2} name={wp1} children={wps[wp1]} />
                                    <div className="flex flex-col justify-end items-end w-full space-y-4">
                                        {(wps[wp1] || []).map((wp2, index) => (
                                            <div key={index} className="flex flex-col justify-end items-end w-full">
                                                <WorkPackage level={3} name={wp2} children={wps[wp2]} />
                                            </div>
                                        ))}
                                    </div>
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