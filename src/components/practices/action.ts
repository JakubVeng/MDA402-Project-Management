'use server'

import { db } from "@/db";
import { practices } from "@/db/schema/practices";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const editIsAvailablePractice = async({ practiceId, isAvailable } : {practiceId: number, isAvailable: boolean}) => {
    await db.update(practices)
        .set({ isAvailable: !isAvailable })
        .where(eq(practices.id, practiceId))

    revalidatePath('/practices');
    return {};
}

export const getAllPractices = async() => {
    return await db.select().from(practices)
}

export const getPracticeNarrative = async(name: string) => {
    const data = await db.select({narrative: practices.narrative}).from(practices).where(eq(practices.name, name))

    return data[0] ? data[0].narrative : ''
}

export const updatePracticeNarrative = async({ text, name } : {text: string, name: string}) => {
    await db.update(practices)
        .set({narrative: text})
        .where(eq(practices.name, name))
    
    const urlName = name.toLowerCase().replace(/\s+/g, '-')
    
    revalidatePath(`/practices/${urlName}`)
}