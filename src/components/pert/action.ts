'use server'

import { db } from "@/db";
import { PertTask, pertTasks } from "@/db/schema/pert-tasks";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { PertPracticeDetail, PertTaskDetail, PracticeAllocation } from "./type";
import { workPackages } from "@/db/schema/work-packages";
import { allocations, Allocation } from "@/db/schema/allocations";
import { Router } from "next/router";
import { practices } from "@/db/schema/practices";

export const getPertTaskData = async (): Promise<PertTaskDetail[]> => {
    const pertTasksData = await db
        .select({
            id: pertTasks.id,
            name: workPackages.name,
            o: pertTasks.o,
            m: pertTasks.m,
            p: pertTasks.p
        })
        .from(pertTasks)
        .leftJoin(workPackages, eq(pertTasks.workPackageId, workPackages.id));

    if (!pertTasksData.length) {
        return [];
    }
    
    const assignmentsData = await db
        .select()
        .from(allocations);

    const assignmentsByTaskId = assignmentsData.reduce<Record<number, Allocation[]>>(
        (acc, assignment) => {
            const { pertId } = assignment;
            if (!acc[pertId]) {
                acc[pertId] = [];
            }
            acc[pertId].push(assignment);
            return acc;
        },
        {}
    );

    return pertTasksData.map(task => ({
        id: task.id,
        name: task.name,
        o: task.o,
        m: task.m,
        p: task.p,
        assignments: assignmentsByTaskId[task.id] || [],
    }));
};

export const getPertPracticeData = async (fte: number): Promise<PertPracticeDetail[]> => {
    const pertTasksData = await db
        .select({
            id: pertTasks.id,
            name: workPackages.name,
            o: pertTasks.o,
            m: pertTasks.m,
            p: pertTasks.p,
            te: sql<number>`ROUND(((${pertTasks.o} + 4 * ${pertTasks.m} + ${pertTasks.p}) / 6), 2)`
        })
        .from(pertTasks)
        .leftJoin(workPackages, eq(pertTasks.workPackageId, workPackages.id));

    if (!pertTasksData.length) {
        return [];
    }

    const assignmentsData = await db
        .select()
        .from(allocations);

    const assignmentsByTaskId = assignmentsData.reduce<Record<number, PracticeAllocation[]>>(
        (acc, assignment) => {
            const { pertId, allocation } = assignment;
            if (!acc[pertId]) {
                acc[pertId] = [];
            }

            const pertTask = pertTasksData.find(task => task.id === pertId);
            const te = pertTask ? pertTask.te : 0;

            const perAllo = parseFloat((allocation * te).toFixed(2))

            acc[pertId].push({ ...assignment, perAllo });
            return acc;
        },
        {}
    );

    return pertTasksData.map(task => {
        const taskAssignments = assignmentsByTaskId[task.id] || [];

        const maxPerAllo = taskAssignments.reduce((max, assignment) => 
            Math.max(max, assignment.perAllo || 0), 0
        );

        const calDays = parseFloat((maxPerAllo * (1+fte)).toFixed(2));

        return {
            id: task.id,
            name: task.name,
            o: task.o,
            m: task.m,
            p: task.p,
            te: task.te,
            calDays, 
            assignments: taskAssignments,
        };
    });
};


export const updatePertEstimates = async (perts: PertTaskDetail[]) => {
    for (const task of perts) {
        await ( db.update(pertTasks)
                .set({
                    o: task.o,
                    m: task.m,
                    p: task.p
                })
                .where(eq(pertTasks.id, task.id))
        )

        for (const assignment of task.assignments) {
            await db.update(allocations)
            .set({
                allocation: assignment.allocation
            })
            .where(eq(allocations.id, assignment.id))
        }
            
    }
    return {}
}

export const insertAssignee = async(assignee: Allocation) => {
    await db.insert(allocations).values({
        name: assignee.name,
        allocation: assignee.allocation,
        pertId: assignee.pertId
    })
    
    revalidatePath('/practices/pert')
    revalidatePath("/", "layout");
    return {}
}

export const deleteAssignee = async(allocationID: number) => {
    await db.delete(allocations).where(eq(allocations.id, allocationID))

    revalidatePath('/practices/pert')
    return {}
}

export const getFTE = async() => {
    const data = await db.select({fte: practices.fte}).from(practices).where(eq(practices.name, 'Pert'))

    return data[0] ? data[0].fte : 0.15
}

export const updateFTE = async(fte: number) => {
    await db.update(practices).set({fte: fte}).where(eq(practices.name, 'Pert'))

    revalidatePath('/practices/pert')
}