'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { addLecture, deleteLecture } from '@/components/lectures/action';
import { addLectureFormSchema, AddLectureFormSchema } from '@/components/lectures/schema';
import {FormInput} from "@/components/form-input";
import { Lecture } from '@/db/schema/lectures';
import { Button } from '../button';

async function renameFileInFolder(fileName: string, newFileName: string) {
    const url = `${process.env.NEXT_PUBLIC_URL}/api/file?filename=`+ fileName + '&newfilename=' + newFileName;
    try {
        const response = await fetch(url, {method: 'PUT'});
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

const useAddLectureMutation = () =>
    useMutation({
        mutationFn: async (data: AddLectureFormSchema) => {
            // TODO: Space for extra checks (specially invalid date)
            try {
                console.log(data)
                const newLecture: Lecture = {id: 0, description: data.description, name: data.name, orderedItem: data.orderedItem, isAvailable: false};
                console.log(newLecture);
                await addLecture(newLecture);
                toast.success(`Lecture ${newLecture.name} was successfully created!`);
            } catch {
                toast.error('Something went wrong!');
            }

            return;
        }
    });

const useEditLectureMutation = () =>
    useMutation({
        mutationFn: async (data: AddLectureFormSchema & { orderedId: number } & {id: number} & {oldName: string}) => {
            try {
                console.log(data)

                const newLecture: Lecture = {description: data.description, name: data.name, id: 0, orderedItem: data.orderedItem, isAvailable: false};
                console.log(newLecture);

                const oldFileName = (data.oldName.toLowerCase().replace(/\s+/g, '-')) + '.pdf';
                const newFileName = (newLecture.name.toLowerCase().replace(/\s+/g, '-')) + '.pdf';

                const fileExists = await isFileinFolder(oldFileName)

                console.log(oldFileName, newFileName, fileExists)

                if (fileExists) {
                    await renameFileInFolder(oldFileName, newFileName)
                }

                await deleteLecture(data.id)
                await addLecture(newLecture);
                toast.success(`Lecture ${newLecture.name} was successfully updated!`);
            } catch {
                toast.error('Something went wrong!');
            }
            return;
        }
    });

export const AddLectureForm = ({initialData}: { initialData: Lecture  | null}) => {
    const addLecture = useAddLectureMutation();
    const editLecture = useEditLectureMutation();

    const defaultValues: AddLectureFormSchema = {
        description: initialData?.description || '',
        name: initialData?.name || '',
        orderedItem: initialData?.orderedItem || 0,
    };

    const form = useForm<AddLectureFormSchema>({
        resolver: zodResolver(addLectureFormSchema),
        defaultValues: defaultValues
    });

    const onSubmit = (values: AddLectureFormSchema) => {
        if (initialData) {
            editLecture.mutate(
                { ...values, orderedId: initialData.orderedItem, id: initialData.id, oldName: initialData.name},
                {
                    onSuccess: () => {}
                }
            );
        } else {
            addLecture.mutate(values, {
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
                {!initialData && <h1 className="text-2xl text-center text-black mt-4 mb-8">New Lecture</h1>}
                {initialData && <h1 className="text-2xl text-center text-black mt-4 mb-8">Edit Lecture</h1>}

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

                <FormInput label="Week" name="orderedItem" type="number"/>

                <div className="mt-4 justify-center">
                    <Button type='submit' disabled={addLecture.isPending || editLecture.isPending} className="bg-[#0101bf] w-full justify-center border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-[#0101bf]"
                    >
                        Submit
                        {addLecture.isPending || editLecture.isPending && <span className="loading loading-spinner"/>}
                    </Button>
                </div>
            </form>
        </FormProvider>
    </div>
)
    ;
};
