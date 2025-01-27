
import { getAdminEmails } from "@/components/lectures/action";
import { getFTE, getPertPracticeData, getPertTaskData } from "@/components/pert/action";
import { FTEInput } from "@/components/pert/fte-input";
import { PertPracticeProvider } from "@/components/pert/pert-practice-provider";
import PertPracticeTable from "@/components/pert/pert-practice-table";
import PertTable from "@/components/pert/pert-table";
import { PertProvider } from "@/components/pert/pert-tasks-provider";
import { getPracticeNarrative } from "@/components/practices/action";
import { EditableTextArea } from "@/components/ui/editable-text-area";
import { auth } from "@/server/auth";


export default async function PERTPage() {

    const pertTasks = await getPertTaskData()
    const narrative = await getPracticeNarrative('PERT')
    const fte = await getFTE();
    const defFte = fte ? fte : 0.15;
    const pertPractices = await getPertPracticeData(fte ? fte : 0.15)

    const emptyPractice = pertPractices.map(practice => {
        if (practice.id % 3 === 2) {
            return {
                ...practice,
                m: 0,
                p: 0,
            };
        } else if (practice.id % 3 === 1) {
            return {
                ...practice,
                o: 0,
                p: 0,
            };
        } else if (practice.id % 3 === 0) {
            return {
                ...practice,
                o: 0,
                m: 0,
            };
        }
        return practice;
    })
    
    console.log(pertPractices, emptyPractice)

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
                        {editor ? (
                            <EditableTextArea text={narrative ? narrative : ''} type1={null} practiceName={'PERT'}/>
                        ) : (
                            <p>{narrative ? narrative : ''}</p>
                        )}
                    </article>
                </div>
                {editor ? (
                    <FTEInput fte={fte ? fte : 0.15}/>
                ) : (
                    <p className="flex flex-row items-center justify-center gap-2">Administrative overhead = <span className="text-3xl bg-[#0101bf] text-white rounded-lg p-2">{defFte*100}%</span></p>
                )}
            </div>
            {editor ? (
                <PertProvider pertTasks={pertTasks}>
                    <PertTable className="w-4/5" readOnly={false} fte={fte ? fte : 0.15}/>
                </PertProvider>
            ) : (
                <PertPracticeProvider pertTasks={emptyPractice}>
                    <PertPracticeTable correctValues={pertPractices} />
                </PertPracticeProvider>
            )}
        </div>
    )
}