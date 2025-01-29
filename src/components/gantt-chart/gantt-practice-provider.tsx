'use client'

import { createContext, ReactNode, useContext, useState } from "react";
import { GanttTaskOrdered, WP } from "./types";

type GanttTaskContextType = {
    ganttTasks: GanttTaskOrdered[],
    setGanttTasks: (ganttTasks: GanttTaskOrdered[]) => void;
};

const GanttTaskContext = createContext<GanttTaskContextType | undefined>(undefined);

export const useGanttTaskContext = () => {
    const context = useContext(GanttTaskContext);
    if (!context) {
      throw new Error('useGanttTaskContext must be used within a GanttTaskProvider');
    }
    return context;
};

export const GanttTaskProvider: React.FC<{ children: ReactNode; wps: WP[] }> = ({ children, wps }) => {

    const tasks = wps.map((item, index) => (
        {
            ...item,
            startDate: new Date(Date.UTC(2100, 0, 1)),
            endDate: new Date(Date.UTC(2100, 0, 1)),
            ordered: index+1
        }
    ))
    
    const [ganttTasks, setGanttTasks] = useState<GanttTaskOrdered[]>(tasks);
  
    return (
      <GanttTaskContext.Provider value={{ganttTasks, setGanttTasks}}>
        {children}
      </GanttTaskContext.Provider>
    );
};

