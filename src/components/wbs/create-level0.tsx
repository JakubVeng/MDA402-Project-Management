'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import {FormInput} from "@/components/form-input";
import { Button } from '../button';
import { addWPFormSchema, AddWPFormSchema } from './schema';
import { addLevel0, WorkPackageMap } from './action';
import { useWPSContext } from './wps-provider';
import { WorkPackage } from '@/db/schema/work-packages';


const useAddLevel0Mutation = (
    ) =>
    useMutation({
        mutationFn: async (data: AddWPFormSchema) => {
            const Level0: WorkPackage = {id: 0, name: data.name, parentId: null}
            await addLevel0(Level0)
        },
        onSuccess: () => {
            toast.success('Level 0 added successfully!');
        },
        onError: (error) => {
            const errorMessage =
                error instanceof Error ? error.message : 'An unknown error occurred.';
            toast.error(errorMessage);
        },
    });


export const CreateLevel0Form = () => {

    const addWP = useAddLevel0Mutation();

    const defaultValues: AddWPFormSchema = {
        name: '',
    };

    const form = useForm<AddWPFormSchema>({
        resolver: zodResolver(addWPFormSchema),
        defaultValues: defaultValues
    });

    const onSubmit = (values: AddWPFormSchema) => {
        addWP.mutate(values, {
            onSuccess: () => {
                form.reset();
            }
        });
    }

    return (
    <div className="flex items-center justify-center w-full">

        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='w-full justify-center'
            >
                <h1 className="text-2xl text-center text-black mt-4 mb-8">New Work Package</h1>

                <FormInput 
                    label="Name" 
                    name="name" 
                    type="text"
                    className={`shadow appearance-none border rounded-lg w-full py-3 mb-5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${form.formState.errors.name ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-[#e5e6eb]' : 'focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]'}`}
                />

                <div className="mt-4 justify-center">
                    <Button type='submit' disabled={addWP.isPending} className="bg-[#0101bf] w-full justify-center border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-[#0101bf]"
                    >
                        Submit
                        {addWP.isPending && <span className="loading loading-spinner"/>}
                    </Button>
                </div>
            </form>
        </FormProvider>
    </div>
    );
};
