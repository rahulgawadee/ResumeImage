import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const pdfPath = path.join(uploadsDir, 'resume.pdf');
  const imagePath = path.join(uploadsDir, 'photo.jpg');
  const outputPath = path.join(uploadsDir, 'merged.pdf');

  const pdfBytes = await fs.readFile(pdfPath);
  const imageBytes = await fs.readFile(imagePath);

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const jpgImage = await pdfDoc.embedJpg(imageBytes);

  const page = pdfDoc.addPage();
  page.drawImage(jpgImage, {
    x: 50,
    y: 400,
    width: 200,
    height: 200,
  });

  const mergedPdf = await pdfDoc.save();
  await fs.writeFile(outputPath, mergedPdf);

  return NextResponse.json({ message: 'Merged successfully' });
}
