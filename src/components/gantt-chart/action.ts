'use server'

import { db } from "@/db";
import { allocations } from "@/db/schema/allocations";
import { PertTask, pertTasks } from "@/db/schema/pert-tasks";
import { workPackages } from "@/db/schema/work-packages";
import { aliasedTable, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { PracticeAllocation } from "../pert/type";
import { pdm } from "@/db/schema/pdm";
import { pdmTypes } from "@/db/schema/pdm-types";
import { GanttPertTask, PDMTask } from "./types";
import { AddPDMFormSchema } from "./schema";
import { revalidatePath } from "next/cache";


export const getGanttTaskData = async (): Promise<GanttPertTask[]> => {
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
        .innerJoin(workPackages, eq(pertTasks.workPackageId, workPackages.id));

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

        const calDays = Math.ceil((maxPerAllo * 1.15))

        return {
            id: task.id,
            name: task.name,
            calDays, 
        };
    });
};

export const getPDMTask = async (): Promise<PDMTask[]> => {
    return await db.select({
        id: pdm.id,
        predecessorId: pdm.predecessorId,
        successorId: pdm.successorId,
        pdmType: pdmTypes.pdmType
    }).from(pdm).innerJoin(pdmTypes, eq(pdm.pdmTypeId, pdmTypes.id))
}

export const getPDM = async () => {
    return await db.select().from(pdm)
}

export const getPDMTypes = async () => {
    return await db.select().from(pdmTypes)
}

export const getPertTaskNames = async () => {
    return await db
        .select({
            id: pertTasks.id,
            name: workPackages.name
        })
        .from(pertTasks)
        .innerJoin(workPackages, eq(pertTasks.workPackageId, workPackages.id));
}

export const addPDM = async(pdmRel: AddPDMFormSchema) => {
    if (pdmRel.pdmTypeId === '') {
        return {}
    }
    const updatedPDMS = {
            predecessorId: parseInt(pdmRel.predecessorId),
            successorId: parseInt(pdmRel.successorId),
            pdmTypeId: parseInt(pdmRel.pdmTypeId)
        }

    await db.insert(pdm).values(updatedPDMS)

    revalidatePath('/practices/gantt-chart')

    return {}
}

export const addAndUpdatePDMs = async(pdmRels: AddPDMFormSchema[]) => {
    for (const pdmRel of pdmRels) {
        if (pdmRel.pdmTypeId === '') {
            break
        }
        if (pdmRel.id === 0) {
            const updatedPDMS = {
                predecessorId: parseInt(pdmRel.predecessorId),
                successorId: parseInt(pdmRel.successorId),
                pdmTypeId: parseInt(pdmRel.pdmTypeId)
            }
    
            await db.insert(pdm).values(updatedPDMS)
        } else {
            await db.update(pdm).set({
                predecessorId: parseInt(pdmRel.predecessorId),
                successorId: parseInt(pdmRel.successorId),
                pdmTypeId: parseInt(pdmRel.pdmTypeId)
            }).where(eq(pdm.id, pdmRel.id))
        }

        revalidatePath('/practices/gantt-chart')

        return {}
    }
}

export const updatePDM = async(pdmRel: AddPDMFormSchema) => {
    await db.update(pdm).set({
        predecessorId: parseInt(pdmRel.predecessorId),
        successorId: parseInt(pdmRel.successorId),
        pdmTypeId: parseInt(pdmRel.pdmTypeId)
    }).where(eq(pdm.id, pdmRel.id))
    
    revalidatePath('/practices/gantt-chart')
}

export const deletePDM = async() => {
    await db.delete(pdm)

    revalidatePath('/practices/gantt-chart')
}

export const getPDMRel = async() => {
    const workPackages1 = aliasedTable(workPackages, "workPackages1")
    const pertTasks1 = aliasedTable(pertTasks, "pertTasks1")

    return await db.select({
        predecessor: workPackages.name,
        successor: workPackages1.name,
        pdmType: pdmTypes.pdmType
    }).from(pdm)
    .innerJoin(pdmTypes, eq(pdm.pdmTypeId, pdmTypes.id))
    .innerJoin(pertTasks, eq(pdm.predecessorId, pertTasks.id))
    .innerJoin(pertTasks1, eq(pdm.successorId, pertTasks1.id))
    .innerJoin(workPackages, eq(pertTasks.workPackageId, workPackages.id))
    .innerJoin(workPackages1, eq(pertTasks1.workPackageId, workPackages1.id))
}