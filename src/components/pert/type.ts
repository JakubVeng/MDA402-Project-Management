import { Allocation } from "@/db/schema/allocations";

export type PertTaskDetail = {
    id: number; 
    name: string | null; 
    o: number; 
    m: number; 
    p: number; 
    assignments: Allocation[]; 
};

export type PracticeAllocation = {
    id: number;
    pertId: number;
    name: string;
    allocation: number;
    perAllo: number;
}

export type PertPracticeDetail = {
    id: number; 
    name: string | null; 
    o: number; 
    m: number; 
    p: number; 
    te: number;
    calDays: number;
    assignments: PracticeAllocation[]; 
};