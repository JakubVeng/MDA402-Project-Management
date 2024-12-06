import {z} from "zod";

export const addProjectFormSchema = z.object({
    name: z.string(),
    description: z.string()
});

export type AddProjectFormSchema = z.infer<typeof addProjectFormSchema>;