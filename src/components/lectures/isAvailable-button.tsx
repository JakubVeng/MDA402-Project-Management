'use client'

import { X, Check } from 'lucide-react';

import { ButtonHTMLAttributes, DetailedHTMLProps, useState } from 'react';
import { editIsAvailable } from './action';
import { toast } from 'sonner';
import { Lecture } from '@/db/schema/lectures';
import { SpinnerCircular } from 'spinners-react';


type  IsAvailableButtonProps = DetailedHTMLProps<
ButtonHTMLAttributes<HTMLButtonElement>,
HTMLButtonElement
> & {
    lecture: Lecture;
};

async function isFileinFolder(fileName: string) {
    const url = `${process.env.NEXT_PUBLIC_URL}/api/file?filename=`+ fileName;
    try {
        const response = await fetch(url, {method: 'GET'});

        if (!response.ok) {
            throw new Error('Failed to fetch file existence data.');
        }
        
        const data = await response.json();

        return data.exists;
    
      } catch (error) {
        console.log('Error checking file:', error);
      }
}

export const IsAvailableButton = ({
	lecture: { name, isAvailable, id }
}: IsAvailableButtonProps) => {
	const [isPending, setIsPending] = useState(false);

	const Icon = isAvailable ? Check : X;

    const dashedName = (name.toLowerCase().replace(/\s+/g, '-')) + '.pdf';

	return (
		<button
			className={`btn btn-square btn-xs ${isPending ? 'border-2 border-[#f3f2fe] bg-[#f3f2fe] rounded-xl p-2 text-black' : 
                isAvailable ? 'btn-primary bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl p-2 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-[#0101bf]' 
                : 'btn-error text-white bg-red-500 border-2 border-red-500 text-[#f3f2fe] text-sm text-center rounded-xl p-2 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-red-500'}
                `}
            disabled={isPending}
			onClick={async () => {
				setIsPending(true)
                const fileExists = await isFileinFolder(dashedName)
                if (fileExists) {
                    await editIsAvailable({lectureId: id, isAvailable: isAvailable})
				    setIsPending(false)
				    if (isAvailable) {
                        toast.error('Lecture made unavailable for students!')
				    } else {
					    toast.success('Lecture made available for students!')
				    }
                } else {
                    setIsPending(false)
                    toast.error('Please upload lecture before making it available!')
                }
			}}
		>
			{isPending ? (
				<SpinnerCircular size={16} thickness={100} speed={200} color="black" still={false} secondaryColor='white' />
			) : (
				<Icon size={16} />
			)}
		</button>
	);
};