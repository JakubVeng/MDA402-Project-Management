'use client'

import { useEffect, useState } from "react";
import { usePertPracticeContext } from "./pert-practice-provider";
import PertPracticeTableRow from "./pert-practice-row";
import { PertPracticeDetail, PertTaskDetail } from "./type";
import { Button } from "../button";
import { PertProvider } from "./pert-tasks-provider";
import PertTable from "./pert-table";

const comparePertDetailsWithIntervals = (
    correctValues: PertPracticeDetail[],
    pert: PertPracticeDetail[]
  ) => {
    if (correctValues) {
        return correctValues.map(correctTask => {
            const matchingPertTask = pert.find(task => task.id === correctTask.id);
        
            if (!matchingPertTask) {
              return {
                isMatch: false
                }
            }
        
            const teMin = correctTask.te - 2;
            const teMax = correctTask.te + 2;
            console.log(matchingPertTask.te, teMin, teMax)
        
            const isTeInRange = 
              matchingPertTask.te >= teMin && matchingPertTask.te <= teMax;
        
            const recalculatedAssignments = correctTask.assignments.map(correctAssignment => {
              const allocation = correctAssignment.allocation;
              const perAlloMin = teMin * allocation;
              const perAlloMax = teMax * allocation;
        
              return {
                ...correctAssignment,
                perAlloMin,
                perAlloMax,
              };
            });
        
            const isPerAlloMatch = recalculatedAssignments.every(correctAssignment => {
              const matchingAssignment = matchingPertTask.assignments.find(
                assignment => assignment.id === correctAssignment.id
              );
              if (!matchingAssignment) return false;
        
              const { perAlloMin, perAlloMax } = correctAssignment;
              console.log(matchingAssignment.perAllo, perAlloMin, perAlloMax)
              return (
                matchingAssignment.perAllo >= perAlloMin &&
                matchingAssignment.perAllo <= perAlloMax
              );
            });

            const biggestPerAllo = Math.max(...recalculatedAssignments.map(a => a.perAllo));
        
            const calDaysMin = correctTask.calDays - biggestPerAllo*2;
            const calDaysMax = correctTask.calDays + biggestPerAllo*2;

            console.log(matchingPertTask.calDays, calDaysMin, calDaysMax)
        
            const isCalDaysInRange = 
              matchingPertTask.calDays >= calDaysMin &&
              matchingPertTask.calDays <= calDaysMax;
        
            const isMatch = isTeInRange && isPerAlloMatch && isCalDaysInRange;
        
            return {
              isMatch
            };
          });
    } else {
        const isMatch = false
        console.log('I am here!')
        return {
            isMatch
        }
    }
};

type PertPracticeTableProps = {
    correctValues: PertPracticeDetail[],
    pertTasks: PertTaskDetail[]
}

export default function PertPracticeTable({correctValues, pertTasks}: PertPracticeTableProps) {

    const { pert } = usePertPracticeContext()

    const [isCorrect, setIsCorrect] = useState(false)
    const [show, setShow] = useState(false)
    const [showAnswer, setShowAnswer] = useState(false)

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (showAnswer) {
          timer = setTimeout(() => {
            setIsCorrect(false);
          }, 1000);
        }

        return () => clearTimeout(timer);
      }, [showAnswer]);

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
                            <p className="text-lg mb-4">Incorrect, please try again!</p>
                            <Button
                                onClick={() => setShowAnswer(true)}
                                className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-[#0101bf]"
                            >
                                Show correct answer
                            </Button>
                            {showAnswer ? (
                                <PertProvider pertTasks={pertTasks}>
                                    <PertTable className="w-full" readOnly={true} />
                                </PertProvider>
                            ) : null}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}
