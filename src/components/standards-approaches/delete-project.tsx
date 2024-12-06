import { useMutation } from "@tanstack/react-query"
import { deleteProject } from "./action"
import { toast } from "sonner"
import { Button } from "../button"

const useDeleteProjectMutation = () =>
    useMutation({
        mutationFn: async (projectId: number) => {
            try {
                await deleteProject(projectId)
                toast.success('Project deleted!')
            } catch {
                return 
            }
        }
    })

export const DeleteProject = ({ projectId }: {projectId: number}) => {
    const deleteProject = useDeleteProjectMutation();

    const onClickDelete = () => {
        deleteProject.mutate(
            projectId
        )
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <p>Are you sure you want to delete project?</p>
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