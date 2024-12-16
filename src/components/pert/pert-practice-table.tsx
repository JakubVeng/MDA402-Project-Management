'use client'

import { useState } from "react";
import { usePertPracticeContext } from "./pert-practice-provider";
import PertPracticeTableRow from "./pert-practice-row";
import { PertPracticeDetail, PertTaskDetail } from "./type";
import { Button } from "../button";

const comparePertDetailsWithIntervals = (
  correctValues: PertPracticeDetail[],
  pert: PertPracticeDetail[]
) => {
  if (!correctValues) {
    return { isMatch: false };
  }

  return correctValues.map(correctTask => {
    const matchingPertTask = pert.find(task => task.id === correctTask.id);

    if (!matchingPertTask) {
      return { isMatch: false };
    }

    const { o, m, p } = matchingPertTask;

    const oMin = m * 0.5; // 50% less than `m`
    const oMax = m * 0.9; // 10% less than `m`
    const pMin = m * 1.5; // 50% more than `m`
    const pMax = m * 3.0; // 200% more than `m`

    const isOValid = o >= oMin && o <= oMax;
    const isPValid = p >= pMin && p <= pMax;

    const isMatch = isOValid && isPValid;

    return { isMatch };
  });
};


type PertPracticeTableProps = {
    correctValues: PertPracticeDetail[],
    pertTasks: PertTaskDetail[]
}

export default function PertPracticeTable({correctValues, pertTasks}: PertPracticeTableProps) {

    const { pert } = usePertPracticeContext()

    const [isCorrect, setIsCorrect] = useState(false)
    const [show, setShow] = useState(false)

    return (
        <div className="flex flex-col items-center justify-center mt-8 w-4/5 space-y-4">
            <table className="min-w-full divide-y divide-gray-200 shadow-lg bg-white rounded-lg overflow-hidden">
                <thead className=" bg-gray-100 text-white">
                    <tr>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">Work package</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">o</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">m</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">p</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">te (MD)</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">Assigned</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">Time allocation</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">Duration per assignmemt</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">Duration in calendar days</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pert.map((data, index) => (
                        <PertPracticeTableRow key={index} pertTask={data} />
                    ))}
                </tbody>
            </table>
            <Button
                onClick={() => {
                    const comparison = comparePertDetailsWithIntervals(correctValues, pert)
                    const correctnes = Array.isArray(comparison) ? comparison.every(comp => comp.isMatch === true) : comparison.isMatch
                    setIsCorrect(correctnes)
                    setShow(true)
                }}
                className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-[#0101bf]"
            >
                Submit
            </Button>
            {show ? (
                <div>
                    {isCorrect ? (
                        <p className="text-2xl">You have CORECTLY estimated all the work packages based on the PERT principles!</p>
                    ) : (
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl mb-4">Incorrect, please try again!</p>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}
