'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { updateRoomSchema, UpdateRoomSchema } from './schema';
import { updateRoomCapacity } from '@/components/manage-accomodation/action';
import { Room } from '@/db/schema/rooms';
import { toast } from 'sonner';

export const UpdateRoomForm = ({ rooms }: { rooms: Room[] }) => {
    const form = useForm<UpdateRoomSchema>({
        resolver: zodResolver(updateRoomSchema),
    });

    const mutation = useMutation({
        mutationFn: async ({ roomId, capacity }: { roomId: number; capacity: number }) => {
            await updateRoomCapacity(roomId, capacity);
        },
        onSuccess: () => {
            toast.success('Room updated successfully');
            form.reset();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const onSubmit = (data: UpdateRoomSchema) => {
        mutation.mutate(data);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Room
                    </label>
                    <select
                        id="room"
                        {...form.register('roomId', { valueAsNumber: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="" disabled>Select a room</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                Room {room.id}
                            </option>
                        ))}
                    </select>
                    {form.formState.errors.roomId && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.roomId.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                        New Capacity
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
                    {mutation.isPending ? 'Updating...' : 'Update Room'}
                </button>
            </form>
        </FormProvider>
    );
};
