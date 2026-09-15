import { NextResponse } from 'next/server';
import { inMemoryCache } from '../records/route';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { record } = body;

    if (!record || !record.id) {
      return NextResponse.json({ success: false, error: 'Missing record or record.id' }, { status: 400 });
    }

    const apiEndpoint = process.env.ASTRA_DB_API_ENDPOINT || '';
    const applicationToken = process.env.ASTRA_DB_APPLICATION_TOKEN || '';
    const collectionName = process.env.ASTRA_DB_COLLECTION || 'deepfake_embeddings';

    // Attempt real Astra DB insert
    if (apiEndpoint && applicationToken) {
      try {
        const res = await fetch(`${apiEndpoint}/api/json/v1/${collectionName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Token': applicationToken,
          },
          body: JSON.stringify({
            insertOne: {
              document: {
                _id: record.id,
                ...record,
                $vector: generatePlaceholderVector(record),
              },
            },
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (res.ok) {
          const data = await res.json();
          // Also persist locally as fallback
          insertToCache(record);
          return NextResponse.json({ success: true, source: 'astra', insertedId: data?.status?.insertedIds?.[0] || record.id });
        }
      } catch {
        // Fall through to cache insert
      }
    }

    // Fallback: in-memory cache insert
    insertToCache(record);
    return NextResponse.json({ success: true, source: 'fallback', insertedId: record.id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

function insertToCache(record: any) {
  const existing = inMemoryCache.findIndex((r) => r.id === record.id);
  if (existing >= 0) {
    inMemoryCache[existing] = record;
  } else {
    inMemoryCache.unshift(record); // prepend newest first
    if (inMemoryCache.length > 200) inMemoryCache.pop(); // cap at 200
  }
}

// Generate a minimal 1536-dim placeholder vector seeded from hash
function generatePlaceholderVector(record: any): number[] {
  const seed = record.sha256Hash || record.id || 'neuroshield';
  const vec: number[] = [];
  for (let i = 0; i < 1536; i++) {
    const v = Math.sin(i * 0.7 + seed.charCodeAt(i % seed.length) * 0.01);
    vec.push(parseFloat(v.toFixed(6)));
  }
  return vec;
}
