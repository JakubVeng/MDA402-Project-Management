
import { Practice } from "@/db/schema/practices";
import { RightSideBarPracticeItem } from "./right-side-bar-practice-item";

type RightSideBarProps = {
    practices: Practice[]; 
}

export const RightSidebarPractice = ({ practices }: RightSideBarProps) => {
    return (
        <div className="flex-col p-6">
            <h2 className='text-xl text-[#0101bf] mb-4 font-bold'>Lectures</h2>
            <nav className="space-y-2">
                {practices.map((practice, index) => (
                    <RightSideBarPracticeItem key={index} practice={practice} />
                ))}
            </nav>
        </div>
    )
}