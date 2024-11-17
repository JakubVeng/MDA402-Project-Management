import { z } from 'zod';

export const addRoomSchema = z.object({
    capacity: z.number().min(1, 'Capacity must be at least 1').max(100, 'Capacity must be less than 100'),
});

export const updateRoomSchema = z.object({
    roomId: z.number().min(1, 'Room must be selected'),
    capacity: z.number().min(1, 'Capacity must be at least 1').max(100, 'Capacity must be less than 100'),
});

export type AddRoomSchema = z.infer<typeof addRoomSchema>;
export type UpdateRoomSchema = z.infer<typeof updateRoomSchema>;
