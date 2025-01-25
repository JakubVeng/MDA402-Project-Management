import { useMutation } from "@tanstack/react-query"
import { deleteLecture } from "./action"
import { toast } from "sonner"
import { Button } from "../button"
import { Lecture } from "@/db/schema/lectures"


const useDeleteLectureMutation = () =>
    useMutation({
        mutationFn: async (lecture: Lecture) => {
            try {
                if (lecture.url) {
                    await fetch(`${process.env.NEXT_PUBLIC_URL!}/api/pinata/files?cid=${lecture.url}`, {
                        method: 'DELETE',
                      })
                    await deleteLecture(lecture.id)
                    toast.success('Lecture deleted!')
                } else {
                    console.log(lecture.id)
                    await deleteLecture(lecture.id)
                    toast.success('Lecture deleted!')
                }
            } catch {
                return 
            }
        }
    })

export const DeleteLecture = ({ lecture }: {lecture: Lecture}) => {
    const deleteLecture = useDeleteLectureMutation();

    const onClickDelete = () => {
        deleteLecture.mutate(
            lecture
        )
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <p>Are you sure you want to delete lecture (lecture file will be also deleted if uploaded)?</p>
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