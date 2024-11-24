'use client';

import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";

type  SignInButtonProps = DetailedHTMLProps<
ButtonHTMLAttributes<HTMLButtonElement>,
HTMLButtonElement
> & {
    url: string | null;
    size: number;
};

export default function SignInButton({
	url,
    size,
    ...buttonProps
}: SignInButtonProps) {
  const handleSignIn = () => {
    if (url) {
        signIn("credentials", { callbackUrl: url });
    } else {
        signIn("credentials", { callbackUrl: '/' });
    }
    
  };

  return (
    <button
        onClick={handleSignIn}
        type="button"
        {...buttonProps}
    >
        <LogIn size={size} />
        Sign In
    </button>
);
}
