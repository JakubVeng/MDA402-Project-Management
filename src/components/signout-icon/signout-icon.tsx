'use client';

import {signOutAction} from "@/components/signout-button/signout-action";
import {LogOut} from "lucide-react";

export function SignoutIcon() {
    return (
        <button
            onClick={async () => {
                await signOutAction();
            }}
            type="button"
        >
            <LogOut />
        </button>
    );
}