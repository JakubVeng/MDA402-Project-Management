
import { getAdminEmails } from "@/components/lectures/action";
import { getPertPracticeData, getPertTaskData } from "@/components/pert/action";
import { PertPracticeProvider } from "@/components/pert/pert-practice-provider";
import PertPracticeTable from "@/components/pert/pert-practice-table";
import PertTable from "@/components/pert/pert-table";
import { PertProvider } from "@/components/pert/pert-tasks-provider";
import { auth } from "@/server/auth";


export default async function PERTPage() {
    // fetching the data from database and from the server regarding authentication
    const pertTasks = await getPertTaskData()
    const pertPractices = await getPertPracticeData()
    console.log(pertPractices)

    const session = await auth();
    const admin_emails = await getAdminEmails()

    let editor = false

    if (session?.user?.email) {
        editor = admin_emails.includes(session.user.email)
    }

    return (
        <div className="flex flex-col justify-center items-center mt-10 mb-10 w-screen space-y-6 px-8">
            <div className='flex flex-col space-y-4 justify-center items-center'>
                <div className="flex justify-center">
                    <h2 className="text-[#0101bf] text-3xl font-bold">Complete PERT</h2>
                </div>
                <div className="flex flex-col w-2/3 items-center space-y-4 text-justify">
                    <article>
                        <p>Third practice will focus on completing a PERT (Program Evaluation Review Technique). Below you can find partially filled table with work packages. 
                        Your goal is to fill in the empty places correctly and estimate the work packages from your WBS in ManDays and also in calendar days. </p>
                    </article>
                </div>
            </div>
            {editor ? (
                <PertProvider pertTasks={pertTasks}>
                    <PertTable className="w-4/5" readOnly={false}/>
                </PertProvider>
            ) : (
                <PertPracticeProvider pertTasks={pertPractices}>
                    <PertPracticeTable correctValues={pertPractices}  pertTasks={pertTasks}/>
                </PertPracticeProvider>
            )}
        </div>
    )
}