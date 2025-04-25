import { PDFDocument } from "pdf-lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { pdfBase64, photoBase64, position = "top-left", size = "medium" } = await req.json();

    // Decode base64 to Uint8Array
    const pdfBytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
    const imageBytes = Uint8Array.from(atob(photoBase64), c => c.charCodeAt(0));

    // Load PDF and embed image
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const jpgImage = await pdfDoc.embedJpg(imageBytes);

    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();

    // Set image size in cm and convert to points
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

    const imageWidth = imageWidthCm * 28.35;
    const imageHeight = imageWidth;
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
    const mergedPdfBase64 = Buffer.from(mergedPdf).toString("base64");

    return NextResponse.json({ mergedPdfBase64 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
