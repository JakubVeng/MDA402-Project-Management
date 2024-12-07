'use server'

import { db } from "@/db"
import { WorkPackage, workPackages } from "@/db/schema/work-packages"
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache"
import { isNull } from "drizzle-orm";

export type WorkPackageMap = {
    [x : string]: string[]
}

export const getWPWithSubWPs = async() => {
    const allWP = await db.select().from(workPackages);

    const WPMap: WorkPackageMap = {};
    allWP.forEach(wp => {
        WPMap[wp.name] = []
    });

    allWP.forEach(wp => {
        if (wp.parentId !== null) {
            const parentTask = allWP.find(t => t.id === wp.parentId)
            if (parentTask) {
                WPMap[parentTask.name].push(wp.name)
            }
        }
    })

    return WPMap
};

export const deleteWBS = async() => {
    await db.delete(workPackages)

    revalidatePath('/practices/wbs')
    return
}

export const checkWBS = async() => {
    const wbs = await db.select().from(workPackages).limit(1)
    return wbs.length === 0;
}

export const addLevel0 = async(level0: WorkPackage) => {
    await db.insert(workPackages).values({
        name: level0.name,
        parentId: level0.parentId
    })

    revalidatePath('/practices/wbs');
    return {}
}

export const checkLevel0Node = async () => {
    const records = await db.select().from(workPackages)

    if (records.length === 1 && records[0].parentId === null) {
        return records[0].name; 
    }

    return false;
}

export const insertDataToDB = async (wps: WorkPackageMap) => {
    const nodesToProcess = Object.keys(wps);

    for (const node of nodesToProcess) {
        const nodeId = await db.select({field1: workPackages.id}).from(workPackages).where(eq(workPackages.name, node))
        const { field1 } = nodeId[0]

        for (const child of wps[node] || []) {
            await db.insert(workPackages).values({
                name: child,
                parentId: field1
            })
        }
    }

    revalidatePath('/practices/wbs');
    console.log('Data insertion completed successfully.');
  };
  