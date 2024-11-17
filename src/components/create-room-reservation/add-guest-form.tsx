'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';


import { FormInput } from '../form-input';
import { Button } from '../button';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AddGuestsFormSchema, addGuestsFormSchema } from './schema';
import { addGuestsToReservation, deleteGuestsFromReservation } from './action';

import { useParams } from 'next/navigation';
import { Guest } from '@/db/schema/guests';

const useAddGuestsToReservationMutation = () => 
    useMutation({
        mutationFn: async (values: AddGuestsFormSchema & { id: number }) => {
            try {
                const guestNames = {
                    ...values,
                    names: values.names.filter(item => item.name !== '')
                };
                if (guestNames.names.length > 0) {
                    await addGuestsToReservation({values: values, reservationId: values.id})
                    toast.success(`${guestNames.names.length} guest(s) added to the reservation`);
                } else {
                    throw new Error
                }
            } catch {
                toast.error('Please add some guests!')
            }
            return;
        }
    });

const useEditGuestsInReservationMutation = () =>
    useMutation({
        mutationFn: async (values: AddGuestsFormSchema & { id: number }) => {
            try {
                const allEmpty = values.names.every(item => item.name === '')
                if (allEmpty) {
                    await deleteGuestsFromReservation(values.id)
                    toast.success('All guests deleted!')
                } else {
                    await deleteGuestsFromReservation(values.id)
                    const guestNames = {
                        ...values,
                        names: values.names.filter(item => item.name !== '')
                    };
                    await addGuestsToReservation({values: guestNames, reservationId: values.id})
                    toast.success(`${guestNames.names.length} guest(s) added to the reservation!`);
                }
            } catch {
                toast.error('Guests were not added!');
            }
            return;
        }
    })

const useDeleteGuestsInReservationMutation = () =>
    useMutation({
        mutationFn: async (id: number ) => {
            try {
                await deleteGuestsFromReservation(id)
                toast.success('All guests deleted!')
            } catch {
                toast.error('Remove guests from rooms before deleting!');
            }
        }
    })

export type GuestNames = {
    name?: string | undefined;
}

export const AddGuestsForm = ({initialData}: { initialData: Guest[]}) => {
    const addGuests = useAddGuestsToReservationMutation();
    const editGuests = useEditGuestsInReservationMutation();
    const deleteGuests = useDeleteGuestsInReservationMutation();

    const params = useParams<{ id: string }>();
    const reservationId = parseInt(params.id);

    const defaultValues = initialData.map((guest) => { 
        const name = guest.name !== null ? guest.name : undefined;
        return { name: name } 
    })
    
    const form = useForm<AddGuestsFormSchema>({
        resolver: zodResolver(addGuestsFormSchema),
        defaultValues: {
            names: defaultValues.length > 0 ? defaultValues : [{ name: '' }],
          },
    });

    const onSubmit = (values: AddGuestsFormSchema) => {
        if (initialData.length > 0) {
            editGuests.mutate(
                {...values, id: reservationId},
                {
                    onSuccess: () => {}
                }
            );
        } else {
            addGuests.mutate(
                {...values, id: reservationId},
                {
                    onSuccess: () => {}
                }
            );
        }
    };

    const onClick = () => {
        deleteGuests.mutate(
            reservationId,
            {
                onSuccess: () => form.reset()
            }
        );
    };

    const { control } = useForm();
    const { fields, append } = useFieldArray({
        control,
        name: 'names',
    });

    useEffect(() => {
        for (let i = 0; i < initialData.length / 2; i++) {
            append({ name: '' });
        }
    }, []);
    
    return (
        <FormProvider {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className='container p-4 max-h-[calc(100vh-128px)] overflow-auto mt-4'
            >
                {fields.map((field, index) => (
                <div key={field.id} className='flex justify-between justify-center items-center space-x-4'>
                    <FormInput 
                        textarea={false} 
                        label={`Guest ${index+1}`}
                        name={`names[${index}].name`} 
                        type="text"
                        className={`shadow appearance-none border rounded-lg w-full py-3 mb-5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${form.formState.errors.names ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-[#e5e6eb]' : 'focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]'}`}
                    />
                    <Button
                        type='button'
                        onClick={() => form.setValue(`names.${index}.name`, '')}
                    >
                        Reset
                    </Button>
                </div>
                ))}
                {(fields.length === 0) ? (
                    <div className='flex w-full justify-evenly justify-center'>
                        <Button
                        type="button"
                        className='btn btn-primary w-1/3 bg-blue-500 text-white text-center rounded-xl p-2 hover:shadow-sm hover:shadow-blue-300 hover:bg-blue-600'
                        onClick={() => append({ name: '' })} 
                        >
                            Add Guest
                        </Button>
                        <Button type="submit" className='btn btn-primary w-1/3 bg-blue-500 text-white text-center rounded-xl p-2 hover:shadow-sm hover:shadow-blue-300 hover:bg-blue-600'>
                            Submit
                        </Button>
                    </div>
                ) : (
                    <div className='flex w-full justify-evenly justify-center mt-4'>
                        <Button
                        type="button"
                        className='btn btn-primary w-1/4 bg-blue-500 text-white text-center rounded-xl p-2 hover:shadow-sm hover:shadow-blue-300 hover:bg-blue-600'
                        onClick={() => append({ name: '' })} 
                        >
                            Add Guest
                        </Button>
                        <Button type="submit" className='btn btn-primary w-1/4 bg-blue-500 text-white text-center rounded-xl p-2 hover:shadow-sm hover:shadow-blue-300 hover:bg-blue-600'>
                            Submit
                        </Button>
                        <Button
                            type="button"
                            className='btn btn-primary w-1/4 bg-red-500 text-white text-center rounded-xl p-2 hover:shadow-sm hover:shadow-red-300 hover:bg-red-600'
                            onClick={onClick}
                        >
                            Delete All
                        </Button>
                    </div>
                )}
            </form>
        </FormProvider>
    );
}