import Link from "next/link";
import React from "react";
import { GraduationCap, LogIn} from "lucide-react";

import { Metadata } from 'next';
import SignInButton from "@/components/signin/signin-button";

export const metadata: Metadata = {
    title: 'MDA402 Project Management - Home',
    description: 'Home page'
};

const Home = () => {

    return (
        <main className="flex flex-col items-center justify-center w-screen h-[calc(100vh-100px)]">
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center p-10">
                    <h1 className="flex text-6xl items-center justify-center p-10 font-semibold text-[#01aa00]">
                        MDA402  
                        <span className="text-primary text-[#0101bf]">&nbsp;Project Management</span>
                    </h1>
                    <p className="text-lg max-w-2xl text-center text-[#0101bf]">Welcome to the official page of MDA402 Project Management course. Discover more about managing your project.</p>
                </div>
                <div className="flex flex-row items-center space-x-8">
                    <Link 
                        href="/lectures" 
                        className="bg-[#01aa00] text-[#f3f2fe] border-[#01aa00] border-2 text-center rounded-xl p-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-[#01aa00]"
                    >
                        <GraduationCap />
                        View course materials
                    </Link>
                    <SignInButton 
                        url={`${process.env.NEXT_PUBLIC_URL!}/practices`}
                        className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-center rounded-xl p-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-[#0101bf]"
                    >
                        <LogIn size={25}/>
                        Sign In
                    </SignInButton>
                    
                </div>
            </div>
        </main>
    );
}

export default Home
