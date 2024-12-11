"use server";

import { db } from "@/db";
import { comparisons } from "@/db/schema/comparisons";
import { Project, projects } from "@/db/schema/projects";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getAllCriteria = async() => {
    return await db.select().from(comparisons)
}

export const getCriteriaById = async(criteriaId: number) => {
    const criteria = await db.select().from(comparisons).where(eq(comparisons.id, criteriaId))

    return criteria[0]
}

export const getProjects = async() => {
    return await db.select().from(projects)
}

export const addProject = async(project: Project) => {
    await db.insert(projects).values({
        name: project.name,
        description: project.description,
        prince2: project.prince2,
        pmbok: project.pmbok,
        ipma: project.ipma,
        unifiedProcess: project.unifiedProcess,
        scrum: project.scrum
    })

    revalidatePath('/practices/standards-and-approaches');
    return {}
}

export const updateProject = async(projectName: string, projectDesc: string, projectId: number) => {
    await db.update(projects).set({
        name: projectName,
        description: projectDesc
    })
    .where(eq(projects.id, projectId))

    revalidatePath('/practices/standards-and-approaches');
    return {}
}

export const deleteProject = async(projectId: number) => {
    await db.delete(projects).where(eq(projects.id, projectId))

    revalidatePath('/practices/standards-and-approaches');
    return {}
}

export const updateProjectStandOrApp = async(projectId: number, standOrApp: keyof typeof projects, existingAnwer: boolean) => {

    const validColumns: Array<keyof typeof projects> = ["prince2", "pmbok", "ipma", "unifiedProcess", "scrum"];

    if (!validColumns.includes(standOrApp)) {
        throw new Error(`Invalid column name: ${standOrApp.toString()}`);
    }

    await db.update(projects).set({
        [standOrApp]: !existingAnwer
    })
    .where(eq(projects.id, projectId));

    revalidatePath('/practices/standards-and-approaches');
    return {}
}