'use client'

import { PDMRel } from "./types";


type PDMRowProps = {
    pdm: PDMRel;
}

export default function PDMTableRow({ pdm }: PDMRowProps) {

    const renderRelationship = (rel: string) => {
        if (rel === 'ff') {
            return <p>Finish-to-finish</p>
        } else if (rel === 'fs') {
            return <p>Finish-to-start</p>
        } else if (rel === 'ss') {
            return <p>Start-to-start</p>
        } else if (rel === 'sf') {
            return <p>Start-to-finish</p>
        }
    }

    return (
        <tr className="divide-x divide-gray-200">
            <td className={`text-center px-6 py-1 text-lg font-medium text-gray-900 bg-[#d3d3ff]`}>{pdm.predecessor}</td>
            <td className={`text-center px-6 text-lg font-medium text-gray-900 bg-[#d3d3ff]`}>{pdm.successor}</td>
            <td className={`text-center px-6 text-lg font-medium text-gray-900 bg-[#d3d3ff]`}>{renderRelationship(pdm.pdmType)}</td>
        </tr>
    );
}
