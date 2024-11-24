'use server';

import { signIn } from "next-auth/react";

export async function signInAction(url: string | null) {
    if (url) {
        await signIn('credentials', { callbackUrl: url });
    } else {
        await signIn('credentials', { callbackUrl: '/' });
    }
}