export type GanttTask = {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
};

export type GanttTaskOrdered = {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    ordered: number;
};

export type WP = {
    id: number;
    name: string;
}

export type GanttPertTask = {
    id: number;
    name: string;
    calDays: number;
};

export type PDMTask = {
    id: number;
    predecessorId: number;
    successorId: number;
    pdmType: 'fs' | 'ff' | 'ss' | 'sf';
};

export type PDMRel = {
    predecessor: string;
    successor: string;
    pdmType: 'fs' | 'ff' | 'ss' | 'sf';
}