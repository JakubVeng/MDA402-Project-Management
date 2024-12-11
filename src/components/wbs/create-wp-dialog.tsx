'use client';
import { useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogTrigger,
    DialogContent,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '../button';
import { PropsWithChildren } from 'react';

type CreateWPDialogProps = PropsWithChildren<{
    isLevel0?: boolean;
}>;

export const AddWPDialog = ({ children, isLevel0 }: CreateWPDialogProps) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div>
            {isLevel0 ? (
                <Button
                    className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-[#0101bf]"
                    onClick={() => setIsDialogOpen(true)}
                >
                    Add Level 0 node
                </Button>
            ) : (
                <Button
                    className="flex items-center justify-center bg-white mt-1 w-4 h-4 transition duration-200 ease-in-out hover:border-2 hover:border-black"
                    onClick={() => setIsDialogOpen(true)}
                >
                    +
                </Button>
            )}
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
