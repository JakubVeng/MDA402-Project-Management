'use client'

import { PDM } from "@/db/schema/pdm";
import { createContext, ReactNode, useContext, useState } from "react";

type PDMContextType = {
    pdms: PDM[],
    setPDM: (pdms: PDM[]) => void;
};

const PDMContext = createContext<PDMContextType | undefined>(undefined);

export const usePDMContext = () => {
    const context = useContext(PDMContext);
    if (!context) {
      throw new Error('usePDMContext must be used within a PDMProvider');
    }
    return context;
};

export const PDMProvider: React.FC<{ children: ReactNode; pdm: PDM[] }> = ({ children, pdm }) => {
    
    const [pdms, setPDM] = useState<PDM[]>(pdm);
  
    return (
      <PDMContext.Provider value={{pdms, setPDM}}>
        {children}
      </PDMContext.Provider>
    );
};