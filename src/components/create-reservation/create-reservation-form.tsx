'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { cn } from '@/lib/cn';
import {createReservationFormSchema, CreateReservationFormSchema} from "@/components/create-reservation/schema";
import {createReservationAction, updateReservationAction} from "@/components/create-reservation/action";
import {FormInput} from "@/components/form-input";
import {Reservation} from "@/db/schema/reservations";

const useCreateReservationMutation = () =>
    useMutation({
        mutationFn: async (data: CreateReservationFormSchema) => {
            // TODO: Space for extra checks (specially invalid date)
            try {
                console.log(data)
                const startDate = new Date(data.startDate);
                const endDate = new Date(data.endDate);
                const newReservation: Reservation = {description: data.description, endDate: endDate, id: 0, startDate: startDate};
                console.log(newReservation);
                await createReservationAction(newReservation);
                toast.success('Reservation was created');
            } catch {
                toast.error('Reservation was not created');
            }

            return;
        }
    });

const useEditReservationMutation = () =>
    useMutation({
        mutationFn: async (data: CreateReservationFormSchema & { id: number }) => {
            try {
                console.log(data)
                const startDate = new Date(data.startDate);
                const endDate = new Date(data.endDate);
                const newReservation: Reservation = {description: data.description, endDate: endDate, id: 0, startDate: startDate};
                console.log(newReservation);

                await updateReservationAction( {reservationId: data.id, ...newReservation});
                toast.success('Reservation was updated');
            } catch {
                toast.error('Reservation was not updated');
            }
            return;
        }
    });

export const CreateReservationForm = ({initialData}: { initialData: Reservation  | null}) => {
    const createReservation = useCreateReservationMutation();
    const updateReservation = useEditReservationMutation();

    const defaultValues: CreateReservationFormSchema = {
        description: initialData?.description || '',
        startDate: initialData?.startDate ? initialData.startDate.toISOString().substring(0, 10) : '',
        endDate: initialData?.endDate ? initialData.endDate.toISOString().substring(0, 10) : '',
    };

    const form = useForm<CreateReservationFormSchema>({
        resolver: zodResolver(createReservationFormSchema),
        defaultValues: defaultValues
    });

    const onSubmit = (values: CreateReservationFormSchema) => {
        if (initialData) {
            updateReservation.mutate(
                { ...values, id: initialData.id },
                {
                    onSuccess: () => {}
                }
            );
        } else {
            createReservation.mutate(values, {
                onSuccess: () => {
                    form.reset();
                }
            });
        }
    };

    return (
    <div className="flex justify-center items-center">

        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
            >
                {!initialData && <h1 className="text-2xl text-center text-black mt-4 mb-8">New Reservation</h1>}
                {initialData && <h1 className="text-2xl text-center text-black mt-4 mb-8">Update Reservation</h1>}

                <FormInput textarea={true} label="Description" name="description" type="text"/>

                <FormInput label="Start Date" name="startDate" type="date"/>
                <FormInput label="End Date" name="endDate" type="date"/>

                <div className="mt-4">
                    <button disabled={createReservation.isPending || updateReservation.isPending} className={cn('w-full px-4 py-2 bg-blue-200 text-white rounded-xl hover:bg-blue-500 transition-colors duration-300')}
                    >
                        Submit
                        {createReservation.isPending || updateReservation.isPending && <span className="loading loading-spinner"/>}
                    </button>
                </div>
            </form>
        </FormProvider>
    </div>
)
    ;
};
