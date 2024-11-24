import SignInButton from '@/components/signin-button/signin-button';
import { SignoutButton } from '@/components/signout-button/signout-button';
import { auth } from '@/server/auth';
import { Metadata } from 'next';
import Link from 'next/link';
import { headers } from "next/headers";

export const metadata: Metadata = {
    title: 'MDA402 Project Management - lectures'
};

const LecturesLayout = async ({
                              children
                          }: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await auth();

    return (
        <div
            className='flex flex-col w-screen bg-white min-h-screen'
        >
            <header className="sticky z-50 top-0 left-0 bg-[#f3f2fe] py-3 px-6 shadow-md">
                <nav >
                    <div className="container flex items-center justify-between">
                        <Link 
                            href="/" 
                            className="text-[#f3f2fe] text-center px-6 flex flex-row gap-2"
                        >
                            <h1 className="flex text-xl items-center justify-center font-bold text-[#01aa00]">
                                MDA402  
                                <span className="text-primary text-[#0101bf]">&nbsp;Project Management</span>
                            </h1>
                        </Link>
                        {session?.user ? (
                            <SignoutButton />
                        ) : (
                            <SignInButton 
                                url={`${process.env.NEXT_PUBLIC_URL}/lectures`}
                                size={20}
                                className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-[#0101bf]"
                            /> 
                        )}
                    </div>
                </nav>
            </header>
            <main className="container min-h-screen">
                {children}
            </main>
        </div>
    );
};

export default LecturesLayout;
