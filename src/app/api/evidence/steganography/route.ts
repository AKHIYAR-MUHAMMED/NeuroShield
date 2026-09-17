import { NextResponse } from 'next/server';
import { scanSteganographyPayload } from '../../../../utils/steganographyDetector';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sampleBase64: string = body?.imageSample || '';
    let pixelBuffer = new Uint8Array(2048);

    if (sampleBase64.length > 0) {
      try {
        const decoded = Buffer.from(sampleBase64, 'base64');
        pixelBuffer = new Uint8Array(decoded);
      } catch {
        // Fallback default sample buffer
      }
    }

    const result = scanSteganographyPayload(pixelBuffer, 512, 512);

    return NextResponse.json(
      {
        success: true,
        scannedAt: new Date().toISOString(),
        steganography: result,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown steganography API error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
