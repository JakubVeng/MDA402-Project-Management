import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { lectures } from "@/db/schema/lectures";
import { userRelations, users } from "./schema/users";
import { userRoleRelations, userRoles } from "./schema/users-roles";
import { comparisons } from "./schema/comparisons";
import { userToRoles, userToRolesRelations } from "./schema/user-to-roles";
import { workPackages, workPackagesRelations } from "./schema/work-packages";
import { pertTasks, pertTasksRelations } from "./schema/pert-tasks";
import { projects } from "./schema/projects";
import { allocations, allocationsRelations } from "./schema/allocations";
import { pdm, pdmRelations } from "./schema/pdm";
import { pdmTypes, pdmTypesRelations } from "./schema/pdm-types";
import { practices } from "./schema/practices";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.AUTH_TOKEN,
});

export const db = drizzle(client, {
  schema: {
    lectures,
    users,
    userRoles,
    comparisons,
    userToRoles,
    projects,
    workPackages,
    pertTasks,
    allocations,
    pdm,
    pdmTypes,
    practices,

    // relations
    userRelations,
    userRoleRelations,
    userToRolesRelations,
    workPackagesRelations,
    pertTasksRelations,
    allocationsRelations,
    pdmRelations,
    pdmTypesRelations
  },
});
