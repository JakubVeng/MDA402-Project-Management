
import { Comparison } from "@/db/schema/comparisons";

import { Check, X, BadgeHelp} from 'lucide-react';


type CompareTableCriteriaRowProps = {
    criteria: Comparison;
}

function renderIcon(value: number) {
    if (value === 1) return <Check size={18}/>;
    if (value === 2) return <BadgeHelp size={18}/>;
    if (value === 3) return <X size={18}/>;
    return null;
}

export default async function CompareTableCriteriaRow({ criteria }: CompareTableCriteriaRowProps) {
    const section = criteria.ipma === 0 && criteria.pmbok === 0 && criteria.prince2 === 0 && criteria.unifiedProcess === 0 && criteria.scrum === 0

    return (
        <tr>
            <td className={`px-6 whitespace-nowrap text-center text-gray-900 bg-gray-100 ${section ? 'py-1 font-black text-md' : 'font-medium text-sm'}`}>{criteria.name}</td>
            <td className={`px-6 whitespace-nowrap text-sm font-medium text-gray-900 ${section ? 'py-1 bg-gray-100' : 'bg-[#cef9cd]'}`}>
                <span className="mt-1 inline-flex items-center justify-center w-full">
                    {renderIcon(criteria.prince2)}
                </span>
            </td>
            <td className={`px-6 whitespace-nowrap text-sm font-medium text-gray-900 ${section ? 'py-1 bg-gray-100' : 'bg-[#cef9cd]'}`}>
                <span className="mt-1 inline-flex items-center justify-center w-full">
                    {renderIcon(criteria.pmbok)}
                </span>
            </td>
            <td className={`px-6 whitespace-nowrap text-sm font-medium text-gray-900 ${section ? 'py-1 bg-gray-100' : 'bg-[#cef9cd]'}`}>
                <span className="mt-1 inline-flex items-center justify-center w-full">
                    {renderIcon(criteria.ipma)}
                </span>
            </td>
            <td className={`px-6 whitespace-nowrap text-sm font-medium text-gray-900 ${section ? 'py-1 bg-gray-100' : 'bg-[#d3d3ff]'}`}>
                <span className="mt-1 inline-flex items-center justify-center w-full">
                    {renderIcon(criteria.unifiedProcess)}
                </span>
            </td>
            <td className={`px-6 whitespace-nowrap text-sm font-medium text-gray-900 ${section ? 'py-1 bg-gray-100' : 'bg-[#d3d3ff]'}`}>
                <span className="mt-1 inline-flex items-center justify-center w-full">
                    {renderIcon(criteria.scrum)}
                </span>
            </td>
        </tr>
    );
}
