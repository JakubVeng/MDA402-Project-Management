'use client'

import { PDMRel } from "./types";
import PDMTableRow from "./pdm-table-row";

type PertTableProps = {
    className: string,
    pdms: PDMRel[]
}

export default function PDMTable({className, pdms}: PertTableProps) {

    return (
        <div className={`${className} flex flex-col items-center mt-8`}>
            <table className="min-w-full divide-y divide-gray-200 shadow-lg bg-white rounded-lg overflow-hidden">
                <thead className=" bg-gray-100 text-white">
                    <tr>
                        <th className="px-6 py-3 text-center text-md font-medium uppercase tracking-wider bg-[#0101bf]">Predecessor WP</th>
                        <th className="px-6 py-3 text-center text-md font-medium uppercase tracking-wider bg-[#0101bf]">Successor WP</th>
                        <th className="px-6 py-3 text-center text-md font-medium uppercase tracking-wider bg-[#0101bf]">Relationship</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pdms.map((data, index) => (
                        <PDMTableRow key={index} pdm={data} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
