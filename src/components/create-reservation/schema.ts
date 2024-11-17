import {z} from "zod";

export const createReservationFormSchema = z
    .object({
        description: z.string(),
        startDate: z.string(),
        endDate: z.string()
    });

export type CreateReservationFormSchema = z.infer<typeof createReservationFormSchema>;