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

    const oMin = correctTask.m * 0.5; // 50% less than `m`
    const oMax = correctTask.m * 0.9; // 10% less than `m`
    const pMin = correctTask.m * 1.5; // 50% more than `m`
    const pMax = correctTask.m * 3.0; // 200% more than `m`
    const mMin = correctTask.o * 1.1;
    const mMax = correctTask.p / 1.5

    const isOValid = o >= oMin && o <= oMax;
    const isPValid = p >= pMin && p <= pMax;
    const isMValid = m >= mMin && m <= mMax;

    const isMatch = isOValid && isPValid && isMValid;

    console.log(isMatch)

    return { isMatch };
  });
};


type PertPracticeTableProps = {
    correctValues: PertPracticeDetail[],
}

export default function PertPracticeTable({correctValues}: PertPracticeTableProps) {

    const { pert } = usePertPracticeContext()
    console.log(pert)

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
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">Effort per assignmemt</th>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider bg-[#0101bf]">Effort in calendar days</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {correctValues.map((data, index) => (
                        <PertPracticeTableRow key={index} pertTask={data} />
                    ))}
                </tbody>
            </table>
            <Button
                onClick={() => {
                    console.log(correctValues, pert)
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