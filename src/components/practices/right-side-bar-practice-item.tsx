import { Lecture } from "@/db/schema/lectures";
import { Practice } from "@/db/schema/practices";
import Link from "next/link"

type RightSideBarItemProps = {
	practice: Practice;
};

export const RightSideBarPracticeItem = ({ practice }: RightSideBarItemProps) => {
    return (
      <div>
        <Link 
            href={`/practices#${practice.id.toString()}`}
            className="rounded-lg p-2 transition duration-150 ease-in-out hover:bg-[#f3f2fe] hover:text-[#0101bf] "
        >
            {practice.name}
        </Link>
      </div>
    )
}