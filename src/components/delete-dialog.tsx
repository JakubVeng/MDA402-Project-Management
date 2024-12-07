'use client';
import { useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogTrigger,
    DialogContent,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from './button';
import { type PropsWithChildren } from 'react';

type DeleteDialogProps = PropsWithChildren<{
    bgCol?: string;
}>;

export const DeleteDialog = ({ children, bgCol }: DeleteDialogProps) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const bgColour = bgCol ? bgCol : 'bg-[#f3f2fe]'

    return (
        <div>
            <Button
                className={`bg-red-500 border-2 border-red-500 text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:${bgColour} hover:text-red-500`}
                onClick={() => setIsDialogOpen(true)}
            >
                Delete
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <button className="hidden">Trigger</button>
                </DialogTrigger>
                <DialogContent style={{ width: '100vw' }} className="bg-white p-4">
                    <DialogTitle />
                    <DialogDescription as="div">
                        {children}
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>)
};
