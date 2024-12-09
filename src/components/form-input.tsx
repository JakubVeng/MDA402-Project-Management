import { HTMLProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/cn';

type FormInputProps = HTMLProps<HTMLInputElement> & {
    label?: string;
    name: string;
    textarea?: boolean;
};

export const FormInput = ({
    label,
    textarea,
    name,
    type,
    className,
    ...inputProps
}: FormInputProps) => {
    const {
        register,
        setValue,
        getValues,
        formState: { errors }
    } = useFormContext();

    if (type === 'checkbox') {
        return (
            <label htmlFor={name} className="form-control w-full flex items-center gap-2">
                <input
                    id={name}
                    type="checkbox"
                    className={cn(
                        'checkbox checkbox-primary',
                        errors[name] && 'border-red-600',
                        className
                    )}
                    // Use register to bind with react-hook-form
                    {...register(name, {
                        setValueAs: (value) => (value ? 1 : 0), // Map true/false to 1/0
                    })}
                    onChange={() => {
                        const currentValue = getValues(name); // Get current value
                        setValue(name, currentValue === 1 ? 0 : 1); // Toggle between 0 and 1
                    }}
                    {...inputProps}
                />
                <span className="label-text text-black">{label}</span>
            </label>
        );
    }

    return (
        <label htmlFor={name} className="form-control w-full">
            <div className="label mb-1">
                <span className="label-text text-black">{label}</span>
            </div>
            {textarea ? (
                <textarea
                    id={name}
                    className={cn(
                        'mt-1 p-2 block w-full text-slate-700 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
                        errors[name] && 'border-red-600',
                        className
                    )}
                    {...register(name, {
                        valueAsNumber: type === 'number'
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
                        valueAsNumber: type === 'number'
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
