import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  const formData = await req.formData();
  const pdf = formData.get('pdf');
  const photo = formData.get('photo');

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });

  const pdfPath = path.join(uploadsDir, 'resume.pdf');
  const photoPath = path.join(uploadsDir, 'photo.jpg');

  await fs.writeFile(pdfPath, Buffer.from(await pdf.arrayBuffer()));
  await fs.writeFile(photoPath, Buffer.from(await photo.arrayBuffer()));

  return NextResponse.json({ message: 'Files uploaded successfully' });
}
