'use client'

import { ButtonHTMLAttributes, DetailedHTMLProps, useState } from 'react';
import { Lecture } from '@/db/schema/lectures';
import { useRouter } from 'next/navigation'
import { deleteCloudUrl } from './action';
import { toast } from 'sonner';

type  DeletePDFButtonProps = DetailedHTMLProps<
ButtonHTMLAttributes<HTMLButtonElement>,
HTMLButtonElement
> & {
    lectureId: number;
    url: string
};

export const DeletePDFButton = ({
	lectureId, url 
}: DeletePDFButtonProps) => {
	const [isPending, setIsPending] = useState(false);
    const router = useRouter()

    const handleClick = async() => {
        setIsPending(true)
        try {
            // Unpin the file from IPFS
            await fetch(`${process.env.NEXT_PUBLIC_URL!}/api/pinata/files?cid=${url}`, {
              method: 'DELETE',
            })
            await deleteCloudUrl(lectureId)
            setIsPending(false)
            toast.error('File deleted!')
            router.refresh()
        }
        catch (error) {
            setIsPending(false)
            console.log(error)
        }
    }

	return (
		<button
        className={`bg-red-500 border-2 border-red-500 text-white text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-red-500`}
            disabled={isPending}
			onClick={async () => handleClick()}
		>
			Delete
		</button>
	);
};