"use server";

import { db } from "@/db";
import { lectures } from "@/db/schema/lectures";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Lecture } from "@/db/schema/lectures";
import { users } from "@/db/schema/users";
import { userRoles } from "@/db/schema/users-roles";
import { userToRoles } from "@/db/schema/user-to-roles";
import { narrative } from "@/db/schema/narrative";

export const getAllLectures = async() => {
    return await db.select().from(lectures).orderBy(asc(lectures.orderedItem))
}

export const getLecture = async(lectureId: number) => {
    return await db.select().from(lectures).where(eq(lectures.id, lectureId))
}

export const getAdminEmails = async() => {
    const usersData = await db
        .select()
        .from(users)
        .innerJoin(userToRoles,
            eq(users.id, userToRoles.userId)
        )
        .innerJoin(userRoles,
            eq(userToRoles.roleId, userRoles.id)
        )
        .where(eq(userRoles.role, 'admin'))

    return usersData.map(user => user.Users.email);
}

export const getEmails = async() => {
    const usersData = await db.select().from(users);
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

export const editLecture = async(lecture: Lecture) => {
    await db.update(lectures)
        .set({orderedItem: lecture.orderedItem,
            name: lecture.name,
            description: lecture.description,
            isAvailable: lecture.isAvailable,
            url: lecture.url
        })
        .where(eq(lectures.id, lecture.id))
    
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

export const addCloudUrl = async({ lectureId, url } : {lectureId: number, url: string}) => {
    await db.update(lectures)
        .set({url: url})
        .where(eq(lectures.id, lectureId))
    
        revalidatePath(`/lectures/${lectureId}`);
    return {};
}

export const deleteCloudUrl = async(lectureId: number) => {
    await db.update(lectures)
        .set({url: null})
        .where(eq(lectures.id, lectureId))
    
        revalidatePath(`/lectures/${lectureId}`);
    return {};
}

export const getNarrative = async(type: string) => {
    const data = await db.select({narrative: narrative.narrative}).from(narrative).where(eq(narrative.type, type))

    return data[0] ? data[0].narrative : ''
}

export const updateNarrative = async({ text, type } : {text: string, type: string}) => {
    await db.update(narrative)
        .set({narrative: text})
        .where(eq(narrative.type, type))
    
    revalidatePath(`/${type}`)
}