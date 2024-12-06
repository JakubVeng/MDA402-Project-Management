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
import { Lecture } from '@/db/schema/lectures';

type AddLectureDialogProps = PropsWithChildren<{
    initialData: Lecture  | null;
}>;

export const AddLectureDialog = ({ children, initialData }: AddLectureDialogProps) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div>
            {initialData ? (
                <Button
                    className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-[#0101bf]"
                    onClick={() => setIsDialogOpen(true)}
                >
                    Edit Lecture
                </Button>
            ) : (
                <Button
                    className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-[#0101bf]"
                    onClick={() => setIsDialogOpen(true)}
                >
                    Add Lecture
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
