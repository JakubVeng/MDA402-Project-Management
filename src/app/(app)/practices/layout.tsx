import { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import {auth, signOut} from "@/server/auth";
import {redirect} from "next/navigation";
import {SignoutButton} from "@/components/signout-button/signout-button";
import Image from "next/image";
import {SignoutIcon} from "@/components/signout-icon/signout-icon";
import {Home, HomeIcon} from "lucide-react";

const poppins = Poppins({ subsets: ['latin'], weight: ['400'] });

export const metadata: Metadata = {
    title: 'Reservation Manager'
};

const PracticesLayout = async ({
                              children
                          }: Readonly<{
    children: React.ReactNode;
}>) => {

    const session = await auth();

    if (!session?.user) {
        redirect('/api/auth/signin');
    }
    console.log(session.user);

    return (
        <body
            className={`flex min-h-screen flex-col bg-gray-200 ${poppins.className}`}
        >
        <header>
            <nav className="bg-blue-500 text-white p-4">
                <div className="container flex items-center justify-between">
                    <a href="/" className="text-xl font-semibold">
                        <p className={"hidden sm:block"}>
                            Reservation Manager
                        </p>
                        <Home className={"block sm:hidden"}/>
                    </a>
                    <div className={"flex flex-row gap-3 items-center"}>
                        <div className={"flex flex-row gap-1 items-center"}>
                            <Image src={session.user.image!} alt={"Profile picture"} width={35} height={35}
                                   className={"rounded-3xl"}/>
                            <p>{session.user.name}</p>
                        </div>
                        <div className={"hidden sm:block"}>
                            <SignoutButton/>
                        </div>
                        <div className={"block sm:hidden"}>
                            <SignoutIcon/>
                        </div>

                    </div>
                </div>
            </nav>
        </header>
        <main className="container py-10">
            {children}
        </main>
        </body>
    );
};

export default PracticesLayout;
