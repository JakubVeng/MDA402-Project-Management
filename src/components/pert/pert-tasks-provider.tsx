'use client'

import { createContext, ReactNode, useContext, useState } from "react";
import { PertTaskDetail } from "./type";

type PertContextType = {
    pert: PertTaskDetail[],
    setPert: (pertTasks: PertTaskDetail[]) => void;
};

const PertContext = createContext<PertContextType | undefined>(undefined);

export const usePertContext = () => {
    const context = useContext(PertContext);
    if (!context) {
      throw new Error('usePertContext must be used within a PertProvider');
    }
    return context;
};

export const PertProvider: React.FC<{ children: ReactNode; pertTasks: PertTaskDetail[] }> = ({ children, pertTasks }) => {
    const [pert, setPert] = useState<PertTaskDetail[]>(pertTasks);
  
    return (
      <PertContext.Provider value={{pert, setPert}}>
        {children}
      </PertContext.Provider>
    );
};