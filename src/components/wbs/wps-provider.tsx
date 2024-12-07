'use client'

import { createContext, ReactNode, useContext, useState } from "react";
import { WorkPackageMap } from "./action";

type TaskLevelArray = string[][]

type WPSContextType = {
    wps: WorkPackageMap;
    setWps: (wps: WorkPackageMap) => void;
    levels: TaskLevelArray;
    setLevels: (levels: TaskLevelArray) => void;
};

const WPSContext = createContext<WPSContextType | undefined>(undefined);

export const useWPSContext = () => {
    const context = useContext(WPSContext);
    if (!context) {
      throw new Error('useWPSContext must be used within a WPSProvider');
    }
    return context;
};

export const WPSProvider: React.FC<{ children: ReactNode; level0: string }> = ({ children, level0 }) => {
    const [wps, setWps] = useState<WorkPackageMap>({[level0]: []});
    const [levels, setLevels] = useState<TaskLevelArray>([[level0]]);
  
    return (
      <WPSContext.Provider value={{ wps, setWps, levels, setLevels }}>
        {children}
      </WPSContext.Provider>
    );
};