import { NextResponse } from 'next/server';

export async function GET() {
  const start = Date.now();

  try {
    const apiEndpoint = process.env.ASTRA_DB_API_ENDPOINT || '';
    const applicationToken = process.env.ASTRA_DB_APPLICATION_TOKEN || '';
    const collectionName = process.env.ASTRA_DB_COLLECTION || 'deepfake_embeddings';

    if (!apiEndpoint || !applicationToken) {
      return NextResponse.json({
        connected: false,
        fallback: true,
        latencyMs: 0,
        collectionCount: 5,
        message: 'Astra DB token not configured — running in demo fallback mode',
      });
    }

    const t0 = Date.now();
    const res = await fetch(`${apiEndpoint}/api/json/v1/${collectionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Token': applicationToken,
      },
      body: JSON.stringify({ countDocuments: {} }),
      signal: AbortSignal.timeout(4000),
    });

    const latencyMs = Date.now() - t0;

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        connected: true,
        fallback: false,
        latencyMs,
        collectionCount: data?.status?.count ?? 5,
        message: 'DataStax Astra DB vector index connected',
      });
    }

    return NextResponse.json({
      connected: false,
      fallback: true,
      latencyMs,
      collectionCount: 5,
      message: 'Astra DB responded with non-200 — running in demo fallback mode',
    });
  } catch {
    return NextResponse.json({
      connected: false,
      fallback: true,
      latencyMs: Date.now() - start,
      collectionCount: 5,
      message: 'Astra DB unreachable — running in demo fallback mode',
    });
  }
}
