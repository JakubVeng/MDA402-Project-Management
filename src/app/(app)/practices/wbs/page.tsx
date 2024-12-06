import { getAdminEmails } from "@/components/lectures/action";
import { getWPWithSubWPs } from "@/components/wbs/action";
import { auth } from "@/server/auth";


export default async function WBSPage() {

    const wps = await getWPWithSubWPs()

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
                <div className="flex flex-col w-2/3 items-center space-y-4">
                    <article>
                        <p>Second practice will focus on constructing a WBS (work breakdown structure). You can find project domain description 
                        in form of the discussion between client and a project manager. Your goal is to create WBS based on that. </p>
                    </article>
                </div>
            </div>
        </div>
    )
}