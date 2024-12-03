"use server";

import { db } from "@/db";
import { lectures } from "@/db/schema/lectures";
import { users } from "@/db/schema/users";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Lecture } from "@/db/schema/lectures";

export const getAllLectures = async() => {
    return await db.select().from(lectures).orderBy(asc(lectures.orderedItem))
}

export const getAdminEmails = async() => {
    const usersData = await db.select().from(users); // Fetch all user data
    return usersData.map(user => user.email);
}

export const deleteLecture = async(lectureId: number) => {
    await db.delete(lectures).where(eq(lectures.id, lectureId))

    revalidatePath('/lectures');
    return {};
}

export const addLecture = async(lecture: Lecture) => {
    await db.insert(lectures).values({
        name: lecture.name,
        description: lecture.description,
        orderedItem: lecture.orderedItem,
        isAvailable: lecture.isAvailable
    });

  revalidatePath('/lectures');
  return {};
}

export const editIsAvailable = async({ lectureId, isAvailable } : {lectureId: number, isAvailable: boolean}) => {
    await db.update(lectures)
        .set({ isAvailable: !isAvailable })
        .where(eq(lectures.id, lectureId))

    revalidatePath('/lectures');
    return {};
}