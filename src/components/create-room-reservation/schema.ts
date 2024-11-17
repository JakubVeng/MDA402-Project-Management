import {z} from "zod";

export const addGuestsFormSchema = z
    .object({
        names: z.array(z.object({
            name: z.string()
        })),
    });
    
export type AddGuestsFormSchema = z.infer<typeof addGuestsFormSchema>;
