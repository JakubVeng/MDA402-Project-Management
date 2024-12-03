import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const filename = searchParams.get('filename');
    if (!filename) {
      return NextResponse.json({ error: 'Filename not provided.' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'pdfs', filename);

    // Check if the file exists
    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
      return NextResponse.json({ exists: true, message: 'File exists.' });
    } else {
      return NextResponse.json({ exists: false, message: 'File does not exist.' });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to check file existence.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const filename = searchParams.get('filename');
    if (!filename) {
      return NextResponse.json({ error: 'Filename not provided.' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'pdfs', filename);

    // Check if the file exists
    const fileExists = fs.existsSync(filePath);

    if (!fileExists) {
      return NextResponse.json({ error: 'File does not exist.' }, { status: 404 });
    }

    // Delete the file
    fs.unlinkSync(filePath);
    return NextResponse.json({ message: 'File deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete file.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename');
    const newFilename = searchParams.get('newfilename');

    if (!filename || !newFilename) {
      return NextResponse.json({ error: 'Both filename and newfilename are required.' }, { status: 400 });
    }

    const oldFilePath = path.join(process.cwd(), 'public', 'pdfs', filename);
    const newFilePath = path.join(process.cwd(), 'public', 'pdfs', newFilename);

    // Check if the file exists
    if (!fs.existsSync(oldFilePath)) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    }

    // Rename the file
    fs.renameSync(oldFilePath, newFilePath);
    return NextResponse.json({ message: 'File renamed successfully.' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to rename file.' }, { status: 500 });
  }
}