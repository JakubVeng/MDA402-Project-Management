import {z} from "zod";

export const addLectureFormSchema = z.object({
    name: z.string(),
    orderedItem: z
        .number()
        .int({ message: "Week must be an integer." })
        .gt(0, { message: "Week must be greater than 0." }),
    description: z.string()
});

export type AddLectureFormSchema = z.infer<typeof addLectureFormSchema>;