'use client'

import { useMutation } from "@tanstack/react-query";
import { signInFormSchema, SignInFormSchema } from "./schema";

import { addUser, getUserRoles } from "./signin-action";
import { toast } from "sonner";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from "../form-input";
import { Button } from "../button";
import { User } from "@/db/schema/users";

const useAddUserMutation = () =>
    useMutation({
        mutationFn: async (data: SignInFormSchema & { email: string }) => {
            try {
                console.log(data)
                const userRoles = await getUserRoles()
                const studentRoleId = userRoles.filter(userRole => userRole.role === 'student').map(role => role.id)
                const newUser: User = {id: 0, name: data.name, uco: data.uco, email: data.email};
                console.log(newUser);
                await addUser(newUser, studentRoleId[0]);
                toast.success(`Successfully logged in!`);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Something went wrong!";
                toast.error(errorMessage);
            }

            return;
        }
    });

export const SignInForm = ({email}: {email: string}) => {
    const addUser = useAddUserMutation();

    const defaultValues: SignInFormSchema = {
        name: '',
        uco: 0,
    };

    const form = useForm<SignInFormSchema>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: defaultValues
    });

    const onSubmit = (values: SignInFormSchema) => {
        addUser.mutate(
            {...values, email},
            {
                onSuccess: () => {
                    form.reset();
                }
            }
        )
    }

    return (
        <div className="flex items-center justify-center w-full">
    
            <FormProvider {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='w-full justify-center'
                >
                    <h1 className="text-2xl text-center text-black mt-4 mb-8">New student registration</h1>
    
                    <FormInput 
                        label="Name" 
                        name="name" 
                        type="text"
                        className={`shadow appearance-none border rounded-lg w-full py-3 mb-5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${form.formState.errors.name ? 'ring-2 ring-red-500 ring-offset-1 ring-offset-[#e5e6eb]' : 'focus:ring-2 focus:ring-[#c4c4c6] focus:ring-offset-1 focus:ring-offset-[#e5e6eb]'}`}
                    />
    
                    <FormInput label="UCO" name="uco" type="number"/>
    
                    <div className="mt-4 justify-center">
                        <Button type='submit' disabled={addUser.isPending} className="bg-[#0101bf] w-full justify-center border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-[#0101bf]"
                        >
                            Submit
                            {addUser.isPending && <span className="loading loading-spinner"/>}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}