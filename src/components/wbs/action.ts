import { db } from "@/db"
import { workPackages } from "@/db/schema/work-packages"

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

type TaskLevelArray = string[][]

export const getWPByLevels = async(WPMap: WorkPackageMap) => {
    const rootTasks = Object.keys(WPMap).filter(task =>
        !Object.values(WPMap).some(subTasks => subTasks.includes(task))
    )

    const levels: TaskLevelArray = []
    let currentLevel = rootTasks

    while (currentLevel.length > 0) {
        levels.push(currentLevel)
        const nextLevel: string[] = []

        currentLevel.forEach(task => {
            nextLevel.push(...WPMap[task])
        });

        currentLevel = nextLevel
    }

    return levels;
};
