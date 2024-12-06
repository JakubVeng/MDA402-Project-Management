'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { addProject, updateProject } from './action';
import {FormInput} from "@/components/form-input";
import { Button } from '../button';
import { addProjectFormSchema, AddProjectFormSchema } from './schema';
import { Project } from '@/db/schema/projects';


const useAddProjectMutation = () =>
    useMutation({
        mutationFn: async (data: AddProjectFormSchema) => {
            try {
                console.log(data)
                const newProject: Project = {id: 0, description: data.description, name: data.name, pmbok: false, prince2: false, ipma: false, unifiedProcess: false, scrum: false};
                console.log(newProject);
                await addProject(newProject);
                toast.success(`Project ${newProject.name} was successfully created!`);
            } catch {
                toast.error('Something went wrong!');
            }

            return;
        }
    });

const useEditProjectMutation = () =>
    useMutation({
        mutationFn: async (data: AddProjectFormSchema & {projectId: number}) => {
            try {
                console.log(data)

                await updateProject(data.name, data.description, data.projectId)

                toast.success(`Project ${data.name} was successfully updated!`);
            } catch {
                toast.error('Something went wrong!');
            }
            return;
        }
    });


export const AddProjectForm = ({initialData}: { initialData: Project  | null}) => {
    const addProject = useAddProjectMutation();
    const editProject = useEditProjectMutation();

    const defaultValues: AddProjectFormSchema = {
        description: initialData?.description || '',
        name: initialData?.name || '',
    };

    const form = useForm<AddProjectFormSchema>({
        resolver: zodResolver(addProjectFormSchema),
        defaultValues: defaultValues
    });

    const onSubmit = (values: AddProjectFormSchema) => {
        if (initialData) {
            editProject.mutate(
                { ...values, projectId: initialData.id},
                {
                    onSuccess: () => {}
                }
            );
        } else {
            addProject.mutate(values, {
                onSuccess: () => {
                    form.reset();
                }
            });
        }
    };

    return (
    <div className="flex items-center justify-center w-full">

        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-full justify-center'
            >
                {!initialData && <h1 className="text-2xl text-center text-black mt-4 mb-8">New Project</h1>}
                {initialData && <h1 className="text-2xl text-center text-black mt-4 mb-8">Edit Project</h1>}

                <FormInput 
                    label="Name" 
                    name="name" 
                    type="text"
                    className={`shadow appearance-none border rounded-lg w-full py-3 mb-5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${form.formState.errors.name ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-[#e5e6eb]' : 'focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]'}`}
                />
                <FormInput 
                    textarea={true} 
                    label="Description" 
                    name="description" 
                    type="text"
                    className={`shadow appearance-none border rounded-lg w-full py-3 mb-5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${form.formState.errors.description ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-[#e5e6eb]' : 'focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]'}`}
                />

                <div className="mt-4 justify-center">
                    <Button type='submit' disabled={addProject.isPending || editProject.isPending} className="bg-[#0101bf] w-full justify-center border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-[#0101bf]"
                    >
                        Submit
                        {addProject.isPending || editProject.isPending && <span className="loading loading-spinner"/>}
                    </Button>
                </div>
            </form>
        </FormProvider>
    </div>
    );
};
