import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config"
import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { lectures } from "@/db/schema/lectures";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");

    // Check if the request has multipart form data
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type. Expected multipart/form-data." },
        { status: 400 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file found in the request body." },
        { status: 400 }
      );
    }

    // Upload the file to Pinata
    const result = await pinata.upload.file(file);

    // Return the response
    return NextResponse.json({
      message: "File uploaded successfully!",
      IpfsHash: result.IpfsHash,
      PinSize: result.PinSize,
      Timestamp: result.Timestamp,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file to Pinata."},
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
      const cidParam = searchParams.get("cid");
  
      if (!cidParam) {
        return NextResponse.json(
          { error: "Valid CID not provided" },
          { status: 400 }
        );
      }

    // Upload the file to Pinata
    const result = await pinata.unpin([cidParam])

    // Return the response
    return NextResponse.json({
      message: "File deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file from Pinata."},
      { status: 500 }
    );
  }
}
