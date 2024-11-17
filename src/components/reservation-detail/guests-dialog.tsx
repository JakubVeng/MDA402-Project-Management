'use client';
import {type PropsWithChildren, ReactNode, useState} from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';


export const GuestsDialog = ({ children }: PropsWithChildren) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
            <div>
                <button
                    className="p-2 rounded-full mt-2 bg-blue-500 text-white float-right transition duration-200 ease-in-out hover:shadow-sm hover:shadow-blue-300 hover:bg-blue-600"
                    onClick={() => setIsDialogOpen(true)}
                >
                    Show guests
                </button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <button className="hidden">Trigger</button>
                    </DialogTrigger>
                    <DialogContent className="bg-white p-4">
                        <DialogDescription>
                            {children}
                        </DialogDescription>
                        <DialogFooter>
                            <DialogClose asChild>
                                <button className="bg-blue-500 text-white rounded-xl py-2 px-4 mb-2">Close</button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
        </div>)
};
