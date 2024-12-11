
import { Comparison } from "@/db/schema/comparisons";
import { getAllCriteria } from "./action";

import CompareTableCriteriaRow from "./compare-table-row";

import { Check, X, BadgeHelp} from 'lucide-react';

import Link from 'next/link';

type CompareTableProps = {
    criterias: Comparison[];
}

export default function ComparisonTable({criterias}: CompareTableProps) {

    return (
        <div className="flex flex-col items-center mt-8 w-2/3">
            <table className="min-w-full divide-y divide-gray-200 shadow-lg bg-white rounded-lg overflow-hidden">
                <thead className=" bg-gray-100 text-white">
                    <tr>
                        <th className="" />
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#01aa00]">PRINCE2</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#01aa00]">PMBOK</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#01aa00]">IPMA</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">UNIFIED PROCESS</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">SCRUM</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {criterias.map((criteria, index) => (
                        <CompareTableCriteriaRow key={index} criteria={criteria}/>
                    ))}
                </tbody>
            </table>
            <p className="flex flex-row p-4 items-center">Legend: <Check size={18} className="ml-1 mr-1"/> - suitable; <X size={18} className="ml-1"/> - not suitable; <BadgeHelp size={18} className="mr-1 ml-1"/> - between</p>
            <p>
                Source: SALAJKOVÁ, Dita. Řízení IT projektů - kurz založený na příkladech. Online. Diplomová práce. Brno: Masarykova univerzita, Fakulta informatiky. 2019. 
                Dostupné z: 
                <Link href='https://is.muni.cz/th/sjtol/.' className="ml-1 transition duration-200 ease-in-out hover:border-b-2 hover:border-black">
                    https://is.muni.cz/th/sjtol/.
                </Link>
            </p>
        </div>
    );
}
