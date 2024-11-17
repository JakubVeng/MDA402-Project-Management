import { type HTMLProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/cn';

type FormInputProps = HTMLProps<HTMLInputElement> & {
    label: string;
    name: string;
    textarea?: boolean;
};

export const FormInput = ({
                              label,
                              textarea,
                              name,
                              className,
                              ...inputProps
                          }: FormInputProps) => {
    const {
        register,
        formState: { errors }
    } = useFormContext();

    return (
        <label htmlFor={name} className="form-control w-full">
            <div className="label mb-1">
                <span className="label-text text-black">{label}</span>
            </div>
            {textarea ? (<textarea
                    id={name}
                    className={cn(
                        'mt-1 p-2 block w-full text-slate-700 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
                        errors[name] && 'border-red-600',
                        className
                    )}
                    {...register(name, {
                        valueAsNumber: inputProps.type === 'number'
                    })}
                />
            ) : (
                <input
                    id={name}
                    className={cn(
                        'mt-1 p-2 block w-full text-slate-700 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
                        errors[name] && 'border-red-600',
                        className
                    )}
                    {...inputProps}
                    {...register(name, {
                        valueAsNumber: inputProps.type === 'number'
                    })}
                />
            )}
            {errors[name] && (
                <span className="mt-1 text-sm text-red-600">
                    {errors[name]?.message?.toString()}
                </span>
            )}
        </label>
    );
};
