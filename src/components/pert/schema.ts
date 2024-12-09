import {z} from "zod";

export const addEstimationFormSchema = z.object({
    values: z.array(z.object({
            id: z.number(),
            o: z
                .number()
        .gt(0, { message: ">0" })
        .refine(
            (value) => /^\d+(\.\d{1,2})?$/.test(value.toString()),
            { message: "Max 2 decimals." }
        ),
    m: z
        .number()
        .gt(0, { message: ">0" })
        .refine(
            (value) => /^\d+(\.\d{1,2})?$/.test(value.toString()),
            { message: "Max 2 decimals." }
    ),
    p: z
        .number()
        .gt(0, { message: ">0" })
        .refine(
            (value) => /^\d+(\.\d{1,2})?$/.test(value.toString()),
            { message: "Max 2 decimals." }
    ),
}))});

export type AddEstimationFormSchema = z.infer<typeof addEstimationFormSchema>;