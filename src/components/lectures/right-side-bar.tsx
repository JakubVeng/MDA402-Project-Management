import { Lecture } from "@/db/schema/lectures";
import { RightSideBarItem } from "./right-side-bar-item";

type RightSideBarProps = {
    lectures: Lecture[]; 
}

export const RightSidebar = ({ lectures }: RightSideBarProps) => {
    return (
        <div className="flex-col p-6">
            <h2 className='text-xl text-[#0101bf] mb-4 font-bold'>Lectures</h2>
            <nav className="space-y-2">
                {lectures.map((lecture, index) => (
                    <RightSideBarItem key={index} lecture={lecture} />
                ))}
            </nav>
        </div>
    )
}