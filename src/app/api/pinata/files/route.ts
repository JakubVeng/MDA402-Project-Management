import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config"
import { addCloudUrl } from "@/components/lectures/action";
import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { lectures } from "@/db/schema/lectures";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const lectureIdUrl = searchParams.get('lectureId');
    const lectureId = lectureIdUrl ? parseInt(lectureIdUrl) : 0

    if (lectureId === 0) {
      return NextResponse.json(
        { error: "LectureId not provided" },
        { status: 420 }
      );
    } 

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const uploadData = await pinata.upload.file(file)
    const signedUrl = await pinata.gateways.createSignedURL({
		  cid: uploadData.cid,
		  expires: 3600,
	  });
    await addCloudUrl({ lectureId: lectureId, url: signedUrl });
    return NextResponse.json(signedUrl, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const lectureId = url.searchParams.get("lectureId");

    if (!lectureId) {
      return NextResponse.json(
        { error: "Missing lectureId query parameter" },
        { status: 400 }
      );
    }

    const lecture = await db
      .select()
      .from(lectures)
      .where(eq(lectures.id, Number(lectureId)))
      .execute();

    if (!lecture || lecture.length === 0 || !lecture[0].url) {
      return NextResponse.json(
        { error: "Lecture not found or URL missing" },
        { status: 404 }
      );
    }

    const fileUrl = lecture[0].url;

    const response = await fetch(fileUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch the file from the URL" },
        { status: 500 }
      );
    }

    const tempDir = path.join(process.cwd(), "tmp");
    await fs.mkdir(tempDir, { recursive: true }); 
    const tempFilePath = path.join(tempDir, `${lectureId}_${Date.now()}.pdf`);
    const fileBuffer = await response.buffer();
    await fs.writeFile(tempFilePath, fileBuffer);

    return NextResponse.json({ message: tempFilePath }, { status: 200 });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

