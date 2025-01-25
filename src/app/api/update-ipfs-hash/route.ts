import { NextResponse, type NextRequest } from "next/server";
import { addCloudUrl } from "@/components/lectures/action";

export async function POST(request: NextRequest) {
    try {
      // Extract lectureId from the URL query parameters
      const { searchParams } = new URL(request.url);
      const lectureIdParam = searchParams.get("lectureId");
      const lectureId = lectureIdParam ? parseInt(lectureIdParam, 10) : 0;
  
      if (!lectureId || isNaN(lectureId)) {
        return NextResponse.json(
          { error: "Valid lectureId not provided" },
          { status: 400 }
        );
      }
  
      // Parse the JSON body to get the URL
      const body = await request.json();
      const { url } = body;
      console.log(url)
  
      // Update the database
      await addCloudUrl({ lectureId, url: url });
  
      // Return the updated URL
      return NextResponse.json({ url: url }, { status: 200 });
    } catch (error) {
      console.error("Error in POST /api/lecture/update:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }