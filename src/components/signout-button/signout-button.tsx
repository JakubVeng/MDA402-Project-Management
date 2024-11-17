'use client';

import {signOutAction} from "@/components/signout-button/signout-action";

export function SignoutButton() {
    return (
        <button
            onClick={async () => {
                await signOutAction();
            }}
            type="button"
        >
            Sign out
        </button>
    );
}