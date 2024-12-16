import { DeleteDialog } from "@/components/delete-dialog";
import { getAdminEmails } from "@/components/lectures/action";
import { checkLevel0Node, checkWBS, getWPWithSubWPs } from "@/components/wbs/action";
import { AddWBS } from "@/components/wbs/add-wbs-to-db";
import { CreateLevel0Form } from "@/components/wbs/create-level0";
import { CreateWBS } from "@/components/wbs/create-wbs";
import { AddWPDialog } from "@/components/wbs/create-wp-dialog";
import { DeleteWBS } from "@/components/wbs/delete-wbs";
import { WBS } from "@/components/wbs/wbs";
import { WPSProvider } from "@/components/wbs/wps-provider";
import { auth } from "@/server/auth";


export default async function WBSPage() {
    // fetching the data from database and from the server regarding authentication
    const wps = await getWPWithSubWPs()

    const level0node = await checkLevel0Node()
    console.log(level0node)

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
                    <h2 className="text-[#0101bf] text-3xl font-bold">Create WBS</h2>
                </div>
                <div className="flex flex-col w-2/3 items-center space-y-4 text-justify">
                    <article>
                        <p>Second practice will focus on constructing a WBS (work breakdown structure). You can find project domain description 
                        in form of the discussion between client and a project manager. Your goal is to create WBS based on that. </p>
                    </article>
                </div>
                <div className="flex flex-col w-2/3 items-start justify-start">
                    <h3 className="text-[#0101bf] text-2xl font-bold">Project Domain Description</h3>
                    <article className="flex flex-col space-y-2 text-justify">
                        <p className="flex flex-col">
                            <span>Q: What is your company and what is the main service that you are looking for?</span>
                            <span>A: The company is called MuscleFactory and it is basically a fitness center and the main service we are looking for is a booking system.</span>
                        </p>
                        <p className="flex flex-col">
                            <span>Q: So what kind of features are you looking for in your booking system?</span>
                            <span>
                                A: We need a system to arrange fitness classes and personal trainers with their clients. In addition to that 
                                the system should provide us with a full calendar to all events happening in the center as well as 
                                the ability for clients to sign up for events and book classes that are transferable to their own personal calendars (like google/microsoft calendar). 
                            </span>
                        </p>
                        <p className="flex flex-col">
                            <span>Q: What are the major user groups to use the system?</span>
                            <span>
                                A: There are four major groups which are the visitors, who are using the page just to view the schedule and available classes,
                                the clients, who are using the system in order to book classes/events, the trainers creating slots for the lessons they give, 
                                and the admins that manage trainers, classes, and payments.
                            </span>
                        </p>
                    </article>
                </div>
            </div>
            {editor ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                    {!(await checkWBS()) ? (
                        <DeleteDialog bgCol="bg-white">
                            <DeleteWBS />
                        </DeleteDialog>
                    ) : (
                        <AddWPDialog isLevel0={true}>
                            <CreateLevel0Form />
                        </AddWPDialog>
                    )}
                    {level0node ? (
                        <WPSProvider level0={level0node}>
                            <CreateWBS />
                            <AddWBS  />
                        </WPSProvider>
                    ) : (
                        <WBS wps={wps}/>
                    )}
                </div>
            ) : (
                <WPSProvider level0={Object.keys(wps)[0]}>
                    <CreateWBS />
                </WPSProvider>
            )}
            
        
        </div>
    )
}