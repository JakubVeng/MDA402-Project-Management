'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';

import { FormInput } from '../form-input';
import { Button } from '../button';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';

import { PDM } from '@/db/schema/pdm';
import { Select } from '../select';
import { PDMType, pdmTypesEnum } from '@/db/schema/pdm-types';
import { addPDMFormSchema, AddPDMFormSchema } from './schema';
import { addPDM, updatePDM } from './action';

const useAddPDMMutation = () => 
    useMutation({
        mutationFn: async (values: AddPDMFormSchema) => {
            try {
                await addPDM(values)
                toast.success(`PDM added succesfully`);
            } catch {
                toast.error('Something went wrong!')
            }
        }
    })

const useEditPDMMutation = () =>
    useMutation({
        mutationFn: async (values: AddPDMFormSchema) => {
            try {
                await updatePDM(values)
                toast.success(`PDM updated succesfully`);
            } catch {
                toast.error('Something went wrong!')
            }
        }
    })


export const CreatePDMForm = ({
    pertTasks,
    pdm,
    pdmTypes,
}: {
    pertTasks : { id: number, name: string }[];
    pdm: PDM;
    pdmTypes: PDMType[]
}) => {

    const addPDM = useAddPDMMutation()
    const editPDM = useEditPDMMutation()

    const defaultValues = pdm ? ( pdm.pdmTypeId === -1 ? { id: 0, predecessorId: '', successorId: '', pdmTypeId: '' }  : { id: pdm.id, predecessorId: pdm.predecessorId.toString(), successorId: pdm.successorId.toString(), pdmTypeId: pdm.pdmTypeId.toString() }) : { id: 0, predecessorId: '', successorId: '', pdmTypeId: '' }
    
    const form = useForm<AddPDMFormSchema>({
        resolver: zodResolver(addPDMFormSchema),
        defaultValues: defaultValues
    });

    const onSubmit = (values: AddPDMFormSchema) => {
        if (pdm.id === 0) {
            addPDM.mutate(values,
                {
                    onSuccess: () => {}
                }
            );
        } else {
            editPDM.mutate(values,
                {
                    onSuccess: () => {}
                }
            );
        }
    };

    
    return (
        <FormProvider {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex p-4 max-h-[calc(100vh-128px)]'
            >
                <div className='flex flex-row justify-evenly justify-center items-center space-x-4'>
                    <Select 
                        defaultValue={defaultValues.predecessorId}
                        name={`predecessorId`} 
                        displayName='Predecessor WP'
                        optionsName={pertTasks.map(task => task.name)}
                        optionsId={pertTasks.map(task => task.id)}
                    />
                    <Select 
                        defaultValue={defaultValues.successorId}
                        name={`successorId`} 
                        displayName='Successor WP'
                        optionsName={pertTasks.map(task => task.name)}
                        optionsId={pertTasks.map(task => task.id)}
                    />
                    <Select 
                        defaultValue={defaultValues.pdmTypeId}
                        name={`pdmTypeId`} 
                        displayName='PDM Type'
                        optionsName={pdmTypes.map(item => item.pdmType)}
                        optionsId={pdmTypes.map(item => item.id)}
                    />
                    <Button type="submit" className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-[#0101bf]">
                        Submit
                    </Button>
                    <FormInput 
                        name='id' 
                        type="number"
                        className='hidden'
                    />
                </div>
            </form>
        </FormProvider>
    );
}