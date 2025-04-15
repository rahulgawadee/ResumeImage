import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const pdfPath = path.join(uploadsDir, "resume.pdf");
    const imagePath = path.join(uploadsDir, "photo.jpg");
    const outputPath = path.join(uploadsDir, "merged.pdf");

    // Read input files
    const pdfBytes = await fs.readFile(pdfPath);
    const imageBytes = await fs.readFile(imagePath);
    // Load PDF and embed the image
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const jpgImage = await pdfDoc.embedJpg(imageBytes);

    // Get dimensions of the image and first page
    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();

    // Define dimensions and position for the image
    const imageWidth = 4 * 28.35; // 4 cm to points
    const imageHeight = 4 * 28.35; // 4 cm to points
    const margin = 20; // Margin from the top and left edge

    // Draw image on the first page (top-left corner)
    firstPage.drawImage(jpgImage, {
      x: margin,
      y: height - imageHeight - margin,
      width: imageWidth,
      height: imageHeight,
    });

    // Save the updated PDF
    const mergedPdf = await pdfDoc.save();
    await fs.writeFile(outputPath, mergedPdf);

    return NextResponse.json({ message: "Merged successfully", outputPath });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
