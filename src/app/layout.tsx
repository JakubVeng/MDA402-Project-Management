import './globals.css';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import { Providers } from './providers';

const poppins = Poppins({ subsets: ['latin'], weight: ['400'] });

export const metadata: Metadata = {
    title: 'MDA402 Project Management'
};

const RootLayout = async ({
                              children
                          }: Readonly<{
    children: React.ReactNode;
}>) => {
    
    return (
        <html lang="en">
            <body
                className={`flex min-h-screen flex-col bg-[#f3f2fe] ${poppins.className}`}
            >
                <main className="container">
                    <Providers>{children}</Providers>
                </main>
            </body>
        </html>
    );
};

export default RootLayout;