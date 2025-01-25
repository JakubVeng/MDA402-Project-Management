'use client';
import {type PropsWithChildren, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogTrigger,
    DialogContent,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '../button';
import { Dropzone } from '../ui/dropzone';
import { DeletePDFButton } from './delete-lecture-pdf-button';

type UploadLectureDialogProps = {
    name: string;
    lectureId: number;
    cid: string | null;
}

export const UploadLectureDialog = ({ name, lectureId, cid }: UploadLectureDialogProps) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div>
            <div>
                {cid ? (
                    <div className='flex items-center justify-center space-x-8'>
                        <Button
                            className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-[#0101bf]"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            Re-upload
                        </Button>
                        <DeletePDFButton lectureId={lectureId} url={cid} />
                    </div>
                ) : (
                    <Button
                        className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-[#0101bf]"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Upload
                    </Button>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <button className="hidden">Trigger</button>
                </DialogTrigger>
                <DialogContent style={{ width: '80vw' }} className="bg-white p-4">
                    <DialogTitle />
                    <DialogDescription as="div">
                        <Dropzone name={name} lectureId={lectureId} setIsDialogOpen={setIsDialogOpen} cid={cid} />
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>)
};
