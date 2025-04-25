// app/api/upload/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const pdf = formData.get('pdf');
    const photo = formData.get('photo');

    // Validate that both files are provided
    if (!pdf || !photo) {
      return NextResponse.json({ error: 'Missing files' }, { status: 400 });
    }

    // Convert both files to buffer and then to base64 strings
    const pdfBuffer = Buffer.from(await pdf.arrayBuffer());
    const photoBuffer = Buffer.from(await photo.arrayBuffer());

    return NextResponse.json({
      message: 'Files received successfully',
      pdfBase64: pdfBuffer.toString('base64'),
      photoBase64: photoBuffer.toString('base64'),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
