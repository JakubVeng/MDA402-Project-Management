import {z} from "zod";

export const signInFormSchema = z.object({
    name: z.string(),
    uco: z
        .number()
        .int({ message: "UCO must be an integer." })
        .positive({message: "UCO must be positive number"})
});

export type SignInFormSchema = z.infer<typeof signInFormSchema>;