import { useMutation } from "@tanstack/react-query"
import { deleteLecture } from "./action"
import { toast } from "sonner"
import { Button } from "../button"
import { Lecture } from "@/db/schema/lectures"

async function deleteFilefromFolder(fileName: string) {
    const url = `${process.env.NEXT_PUBLIC_URL}/api/file?filename=`+ fileName;
    try {
        const response = await fetch(url, {method: 'DELETE'});
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error);
        }
        
        } catch (error) {
            console.log('Error checking file:', error);
        }
}

async function isFileinFolder(fileName: string) {
    const url = `${process.env.NEXT_PUBLIC_URL}/api/file?filename=`+ fileName;
    try {
        const response = await fetch(url, {method: 'GET'});

        if (!response.ok) {
            throw new Error('Failed to fetch file existence data.');
        }
        
        const data = await response.json();

        return data.exists;
    
      } catch (error) {
        console.log('Error checking file:', error);
      }
}

const useDeleteLectureMutation = () =>
    useMutation({
        mutationFn: async (lecture: Lecture) => {
            try {
                const fileName = (lecture.name.toLowerCase().replace(/\s+/g, '-')) + '.pdf';
                const fileExists = await isFileinFolder(fileName)
                console.log(fileExists)
                if (fileExists) {
                    await deleteFilefromFolder(fileName)
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