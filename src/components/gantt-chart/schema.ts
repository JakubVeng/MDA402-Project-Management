import {z} from "zod";

export const addPDMFormSchema = z.object({
    id: z.number(),
    predecessorId: z.string(),
    successorId: z.string(),
    pdmTypeId: z.string()
})

export type AddPDMFormSchema = z.infer<typeof addPDMFormSchema>;