import { NextResponse } from 'next/server';
import { processBatchHashes } from '../../../../utils/batchHasher';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || !Array.isArray(body.files) || body.files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: "files" array must be non-empty.' },
        { status: 400 }
      );
    }

    const textEncoder = new TextEncoder();
    const fileEntries = body.files.map((file: { name: string; content?: string }) => {
      const name = file.name || 'unnamed_evidence';
      const contentStr = file.content || `${name}-${Date.now()}`;
      return {
        name,
        buffer: textEncoder.encode(contentStr).buffer,
      };
    });

    const result = await processBatchHashes(fileEntries);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
