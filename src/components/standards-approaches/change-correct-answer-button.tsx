'use client'

import { X, Check } from 'lucide-react';

import { ButtonHTMLAttributes, DetailedHTMLProps, useState } from 'react';
import { updateProjectStandOrApp } from './action';
import { toast } from 'sonner';
import { SpinnerCircular } from 'spinners-react';
import { Project, projects } from '@/db/schema/projects';


type  ChangeAnswerButtonProps = DetailedHTMLProps<
ButtonHTMLAttributes<HTMLButtonElement>,
HTMLButtonElement
> & {
    project: Project;
    standOrApp: keyof Pick<Project, "prince2" | "pmbok" | "ipma" | "unifiedProcess" | "scrum">;
};

export const ChangeAnswerButton = ({
	project,
    standOrApp
}: ChangeAnswerButtonProps) => {
	const [isPending, setIsPending] = useState(false);

	const Icon = project[standOrApp] ? Check : X;

	return (
		<button
			className={`btn btn-square btn-xs ${isPending ? 'border-2 border-[#f3f2fe] bg-[#f3f2fe] rounded-xl p-2 text-black' : 
                project[standOrApp] ? 'btn-primary bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl p-2 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-[#0101bf]' 
                : 'btn-error text-white bg-red-500 border-2 border-red-500 text-[#f3f2fe] text-sm text-center rounded-xl p-2 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-[#f3f2fe] hover:text-red-500'}
                `}
            disabled={isPending}
			onClick={async () => {
				setIsPending(true)
                await updateProjectStandOrApp(project.id, standOrApp, project[standOrApp])
                setIsPending(false)
                toast.success('Respective PM standard or approach was updated for this project!')
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