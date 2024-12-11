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