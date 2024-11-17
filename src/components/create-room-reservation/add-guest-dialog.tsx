'use client';

import { useState} from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '../button';
import { type PropsWithChildren } from 'react';
import { PageLink } from '../page-link';
import { useParams } from 'next/navigation';
import Link from 'next/link'
import { ArrowLeft, User } from 'lucide-react';

export const AddGuestsDialog = ({children}: PropsWithChildren) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const params = useParams<{ id: string }>();
    const id = params.id;

    return (
        <div>
            <div className='flex gap-10'>
                <PageLink reverse={true} href={`/reservation/${id}`} className='hidden md:flex rounded-xl w-36 h-14'>Back</PageLink>
                <Link href={`/reservation/${id}`} className='flex flex-row-reverse gap-x-4 bg-gray-300 text-black hover:bg-gray-400 cursor-pointer items-center justify-end rounded-md px-4 py-2 text-center text-sm font-semibold uppercase transition duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 active:scale-95 rounded-xl px-1 py-1 w-auto h-14 md:hidden'><ArrowLeft /></Link>
                <Button
                    className="hidden md:flex btn btn-primary w-36 h-14 bg-blue-500 text-white text-center rounded-xl p-4 transition duration-200 ease-in-out hover:shadow-sm hover:shadow-blue-300 hover:bg-blue-600"
                    onClick={() => {
                        setIsDialogOpen(true);
                    }}
                >
                    + Add guests
                </Button>
                <Button
                    className="flex md:hidden btn btn-primary w-auto h-14 bg-blue-500 text-white text-center rounded-xl p-4 transition duration-200 ease-in-out hover:shadow-sm hover:shadow-blue-300 hover:bg-blue-600"
                    onClick={() => {
                        setIsDialogOpen(true);
                    }}
                >
                    + <User />
                </Button>
            </div>
            

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="hidden">Trigger</Button>
                </DialogTrigger>
                <DialogContent style={{ width: '100vw' }} className="bg-white p-4">
                    <DialogDescription>
                        {children}
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    )

}