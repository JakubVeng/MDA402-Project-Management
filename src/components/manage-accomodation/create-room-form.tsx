'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { addRoomSchema, AddRoomSchema } from './schema';
import { addRoom } from '@/components/manage-accomodation/action';
import { toast } from 'sonner';

export const AddRoomForm = () => {
    const form = useForm<AddRoomSchema>({
        resolver: zodResolver(addRoomSchema),
    });

    const mutation = useMutation({
        mutationFn: async (capacity: number) => {
            await addRoom(capacity);
        },
        onSuccess: () => {
            toast.success('Room added successfully');
            form.reset();
        },
        onError: () => {
            toast.error('Failed to add room');
        },
    });

    const onSubmit = (data: AddRoomSchema) => {
        mutation.mutate(data.capacity);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                        Room Capacity
                    </label>
                    <input
                        type="number"
                        id="capacity"
                        {...form.register('capacity', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    {form.formState.errors.capacity && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.capacity.message}</p>
                    )}
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Adding...' : 'Add Room'}
                </button>
            </form>
        </FormProvider>
    );
};
