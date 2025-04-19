import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get("position") || "top-left";
    const size = searchParams.get("size") || "medium";

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const pdfPath = path.join(uploadsDir, "resume.pdf");
    const imagePath = path.join(uploadsDir, "photo.jpg");
    const outputPath = path.join(uploadsDir, "merged.pdf");

    const pdfBytes = await fs.readFile(pdfPath);
    const imageBytes = await fs.readFile(imagePath);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const jpgImage = await pdfDoc.embedJpg(imageBytes);

    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();

    // Set image size based on the selected option
    let imageWidthCm;
    switch (size.toLowerCase()) {
      case "small":
        imageWidthCm = 2.5;
        break;
      case "large":
        imageWidthCm = 4;
        break;
      case "medium":
      default:
        imageWidthCm = 3;
        break;
    }

    // Convert cm to points (1 cm ≈ 28.35 points)
    const imageWidth = imageWidthCm * 28.35;
    const imageHeight = imageWidth; // Keeping it square
    const margin = 20;

    const x = position === "top-left" ? margin : width - imageWidth - margin;
    const y = height - imageHeight - margin;

    firstPage.drawImage(jpgImage, {
      x,
      y,
      width: imageWidth,
      height: imageHeight,
    });

    const mergedPdf = await pdfDoc.save();
    await fs.writeFile(outputPath, mergedPdf);

    return NextResponse.json({ message: "Merged successfully", outputPath });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
