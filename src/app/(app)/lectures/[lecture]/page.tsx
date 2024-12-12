import { Metadata } from "next";
import PdfViewer from "@/components/pdf-viewer";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';
import { auth } from "@/server/auth";
import { getAdminEmails } from "@/components/lectures/action";
import { UploadLectureDialog } from "@/components/lectures/upload-lecture-dialog";
import { Dropzone } from "@/components/ui/dropzone";

export type LectureParams = Promise<{ lecture: string }>

export const metadata: Metadata = {
    title: 'MDA402 - Lecture detail',
    description: 'Lecture detail page'
};

async function isFileinFolder(fileName: string) {
    const url = `${process.env.NEXT_PUBLIC_URL}/api/file?filename=`+ fileName;
    try {
        const response = await fetch(url, {method: 'GET'});

        if (!response.ok) {
            throw new Error('Failed to fetch file existence data.');
        }
        
        const data = await response.json();

        return data.exists;
    
      } catch (error) {
        console.log('Error checking file:', error);
      }
}

export default async function LectureDetailsPage(props: { params: LectureParams }) {
    const session = await auth();
    const admin_emails = await getAdminEmails()

    let editor = false

    if (session?.user?.email) {
        editor = admin_emails.includes(session.user.email)
    }

    const { lecture } = await props.params

    const pathToPdf = `/pdfs/${lecture}.pdf`
    const fileName = `${lecture}.pdf`
    const fileExists = await isFileinFolder(fileName)

    return (
        <div className="flex flex-col justify-center items-center mt-10 w-screen space-y-6">
            <div className="flex flex-row items-center space-x-8">
                <Link 
                    href="/lectures" 
                    className="bg-[#0101bf] border-2 border-[#0101bf] text-[#f3f2fe] text-sm text-center rounded-xl py-2 px-4 flex flex-row gap-2 transition duration-200 ease-in-out hover:bg-white hover:text-[#0101bf]"
                >
                    <ArrowLeft size={20} />
                    Back
                </Link>
                {editor ? (
                    <UploadLectureDialog>
                        <Dropzone name={lecture} />
                    </UploadLectureDialog>
                ) : null}
            </div>
            {fileExists ? (
                <PdfViewer file={pathToPdf} />
            ) : (
                <p>No file uploaded yet.</p>
            )}
        </div>
    )
}