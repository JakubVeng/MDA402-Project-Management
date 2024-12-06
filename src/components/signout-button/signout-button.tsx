'use client';

import {signOutAction} from "@/components/signout-button/signout-action";
import { LogOut } from "lucide-react";

export function SignoutButton() {
    return (
        <button
            onClick={async () => {
                await signOutAction();
            }}
            type="button"
            className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-[#0101bf]"
        >
            <LogOut size={20} />
            Sign Out
        </button>
    );
}