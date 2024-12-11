import {z} from "zod";

export const addWPFormSchema = z.object({
    name: z.string()
});

export type AddWPFormSchema = z.infer<typeof addWPFormSchema>;