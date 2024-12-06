import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get('file');

    // Check if the file is actually a PDF file
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Invalid file format or no file uploaded.' }, { status: 400 });
    }

    // Specify the path where you want to save the file (use `public/pdfs`)
    const filePath = path.join(process.cwd(), 'public', 'pdfs', file.name);
    const urlPath = file.name.slice(0, -4);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the old file
    }

    // Save the file
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    revalidatePath(`/lectures/${urlPath}`);

    return NextResponse.json({ message: 'File uploaded successfully.' }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 });
  }
}
