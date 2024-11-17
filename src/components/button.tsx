import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<object>>(
    function Button({ ...props }: ButtonProps, ref) {
        return (
        <button ref={ref} {...props} />
        );
    }
)