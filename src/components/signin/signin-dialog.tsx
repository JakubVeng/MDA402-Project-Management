'use client';

import { useEffect, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogTrigger,
    DialogContentNoClose,
    DialogDescription,
} from '@/components/ui/dialog';
import { PropsWithChildren } from 'react';

type SignInDialogProps = PropsWithChildren<{
    isOpen: boolean;
}>;

export const SignInDialog = ({ children, isOpen }: SignInDialogProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(isOpen);
    }, [isOpen]);

    return (
        <div>

            <Dialog open={visible} onOpenChange={setVisible}>
                <DialogTrigger asChild>
                    <button className="hidden">Trigger</button>
                </DialogTrigger>
                <DialogContentNoClose style={{ width: '100vw' }} className="bg-white p-4">
                    <DialogTitle />
                    <DialogDescription as="div">
                        {children}
                    </DialogDescription>
                </DialogContentNoClose>
            </Dialog>
        </div>)
};
