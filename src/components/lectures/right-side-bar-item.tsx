import { Lecture } from "@/db/schema/lectures";
import Link from "next/link"

type RightSideBarItemProps = {
	lecture: Lecture;
};

export const RightSideBarItem = ({ lecture }: RightSideBarItemProps) => {
    const lectureId = `${lecture.name.toLowerCase().replace(/\s+/g, '-')}-${lecture.orderedItem}`
    return (
      <div>
        <Link 
            href={`/lectures#${lectureId}`}
            className="rounded-lg p-2 transition duration-150 ease-in-out hover:bg-[#f3f2fe] hover:text-[#0101bf] "
        >
            {lecture.name}
        </Link>
      </div>
    )
}