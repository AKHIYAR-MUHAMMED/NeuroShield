import { NextResponse } from 'next/server';
import { analyzeVoiceprintBiometrics } from '../../../../utils/voiceprintBiometrics';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const pitchContour: number[] = Array.isArray(body?.pitchContour)
      ? body.pitchContour
      : [125, 128, 122, 130, 124, 121, 127];
    
    const amplitudeFrames: number[] = Array.isArray(body?.amplitudeFrames)
      ? body.amplitudeFrames
      : [0.4, 0.45, 0.39, 0.44, 0.42];

    const result = analyzeVoiceprintBiometrics(pitchContour, amplitudeFrames);

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        analysis: result,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
