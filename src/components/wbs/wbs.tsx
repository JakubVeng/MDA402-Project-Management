import { getWPByLevels, WorkPackageMap } from "./action"


type WBSProps = {
    wps: WorkPackageMap
}

export const WBS = ({wps}: WBSProps) => {
    const levels = getWPByLevels(wps)

    return
}