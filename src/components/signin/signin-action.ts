'use server';

import { db } from "@/db";
import { UserToRole, userToRoles } from "@/db/schema/user-to-roles";
import { User, users } from "@/db/schema/users";
import { userRoles } from "@/db/schema/users-roles";
import { signIn } from "next-auth/react";
import { revalidatePath } from "next/cache";

export async function signInAction(url: string | null) {
    if (url) {
        await signIn('credentials', { callbackUrl: url });
    } else {
        await signIn('credentials', { callbackUrl: '/' });
    }
}

export const addUser = async(user: User, roleId: number) => {
    const insertedId = await db.insert(users).values({
        name: user.name,
        email: user.email,
        uco: user.uco
    }).returning({insertedId: users.id})

    const userId = insertedId.map(id => id.insertedId)

    await db.insert(userToRoles).values({
        userId: userId[0],
        roleId: roleId
    })

    revalidatePath('/');
    return {}
}

export const getUserRoles = async() => {
    return await db.select().from(userRoles)
}