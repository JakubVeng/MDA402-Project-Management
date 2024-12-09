'use client'

import { createContext, ReactNode, useContext, useState } from "react";
import { PertPracticeDetail, PertTaskDetail } from "./type";

type PertPracticeContextType = {
    pert: PertPracticeDetail[],
    setPert: (pertTasks: PertPracticeDetail[]) => void;
};

const PertPracticeContext = createContext<PertPracticeContextType | undefined>(undefined);

export const usePertPracticeContext = () => {
    const context = useContext(PertPracticeContext);
    if (!context) {
      throw new Error('usePertPracticeContext must be used within a PertPracticeProvider');
    }
    return context;
};

export const PertPracticeProvider: React.FC<{ children: ReactNode; pertTasks: PertPracticeDetail[] }> = ({ children, pertTasks }) => {
    const amendedPertTasks = pertTasks.map(task => ({
        ...task,
        te: 0,
    }))
    
    const [pert, setPert] = useState<PertPracticeDetail[]>(amendedPertTasks);
  
    return (
      <PertPracticeContext.Provider value={{pert, setPert}}>
        {children}
      </PertPracticeContext.Provider>
    );
};