'use client';

import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { signIn } from "next-auth/react";

type  SignInButtonProps = DetailedHTMLProps<
ButtonHTMLAttributes<HTMLButtonElement>,
HTMLButtonElement
> & {
    url: string | null;
};

export default function SignInButton({
	url,
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
    />
);
}
