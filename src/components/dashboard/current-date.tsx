import { type PropsWithChildren } from 'react';
import {cn} from "@/lib/cn";

export const CurrentDate = () => {

    const date = new Date().toDateString();

    return (
    <div className="flex flex-row bg-blue-300 rounded-xl mb-4 justify-between">
        <div className="p-4">
            <h2 className="text-center">Today</h2>
        </div>
        <div className="p-4 mt-10">
            <h2 className="text-3xl">{date}</h2>
        </div>
    </div>)
};
