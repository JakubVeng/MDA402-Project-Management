import { getEmails } from '@/components/lectures/action';
import SignInButton from '@/components/signin/signin-button';
import { SignInDialog } from '@/components/signin/signin-dialog';
import { SignInForm } from '@/components/signin/signin-form';
import { SignoutButton } from '@/components/signout-button/signout-button';
import { auth } from '@/server/auth';
import { LogIn } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'MDA402 Project Management - practices'
};

const PracticesLayout = async ({
                              children
                          }: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await auth();
    const emails = await getEmails()

    if (!session?.user) {
        redirect('/api/auth/signin');
    }

    let firstTimeUser = true
    let email = ''
    let signedIn = false

    if (session?.user?.email) {
        firstTimeUser = !emails.includes(session.user.email)
        email = session.user.email
        signedIn = true
    }

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
                        {signedIn ? (
                            <div className='flex flex-row items-center space-x-4'>
                                <Link 
                                    href="/lectures" 
                                    className="w-28 justify-center bg-[#01aa00] text-[#f3f2fe] border-[#01aa00] border-2 text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-[#01aa00]"
                                >
                                    Lectures
                                </Link>
                                <SignoutButton />
                        </div>
                        ) : (
                            <SignInButton 
                                url={`${process.env.NEXT_PUBLIC_URL!}/practices`}
                                className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-[#0101bf]"
                            >
                                <LogIn size={20}/>
                                Sign In
                            </SignInButton>
                        )}
                    </div>
                </nav>
            </header>
            <main className="container min-h-screen">
                {firstTimeUser && signedIn ? (
                    <div>
                        <SignInDialog isOpen={signedIn}>
                            <SignInForm email={email}/>
                        </SignInDialog>
                    </div>
                ) : (
                    <div>
                        {children}
                    </div>
                )
                }
            </main>
        </div>
    );
};

export default PracticesLayout;
