'use client';
import {type PropsWithChildren, useState} from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogDescription,
} from '@/components/ui/dialog';
import {PencilLine, Plus} from "lucide-react";

interface UpdateReservationDialogProps extends PropsWithChildren {
    create?: boolean;
}

export const ReservationDialog = ({ children, create = false }: UpdateReservationDialogProps) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div>
            {create && <button
                className="bg-blue-500 w-full text-white text-center rounded-xl p-4 flex flex-row gap-1"
                onClick={() => setIsDialogOpen(true)}
            >
                 <Plus /> Create reservation
            </button>}
            {!create && <button
                className="p-2 rounded-full bg-white text-blue-500 float-right"
                onClick={() => setIsDialogOpen(true)}
            >
                <PencilLine/>
            </button>}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <button className="hidden">Trigger</button>
                </DialogTrigger>
                <DialogContent style={{ width: '80vw' }} className="bg-white p-4">
                    <DialogDescription>
                        {children}
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>)
};
