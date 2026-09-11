import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reportId, format, custodian } = body;

    if (!reportId) {
      return NextResponse.json(
        { error: 'Missing reportId parameter' },
        { status: 400 }
      );
    }

    const exportTimestamp = new Date().toISOString();
    const exportSignature = `SIG-ISO27037-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      reportId,
      format: format || 'pdf',
      custodian: custodian || 'Authorized Forensic Analyst',
      exportTimestamp,
      exportSignature,
      downloadUrl: `/api/export-report/download?id=${reportId}&sig=${exportSignature}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process export request', details: error.message },
      { status: 500 }
    );
  }
}
