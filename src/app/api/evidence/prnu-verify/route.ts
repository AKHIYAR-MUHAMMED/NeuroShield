import { NextRequest, NextResponse } from 'next/server';
import { extractPrnuNoiseFingerprint } from '@/utils/prnuExtractor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { luminanceData } = body;

    const result = extractPrnuNoiseFingerprint(luminanceData || []);
    return NextResponse.json({
      status: 'success',
      result,
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 400 });
  }
}
