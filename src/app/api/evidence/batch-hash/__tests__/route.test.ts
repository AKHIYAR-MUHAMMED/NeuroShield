import { POST } from '../route';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test assertion failed: ${message}`);
  }
}

export async function runBatchHashApiTests() {
  console.log('[Test Suite] Running Batch Hash API Route tests...');

  // Test 1: Invalid payload (missing files array)
  const emptyReq = new Request('http://localhost/api/evidence/batch-hash', {
    method: 'POST',
    body: JSON.stringify({}),
    headers: { 'Content-Type': 'application/json' },
  });
  const errRes = await POST(emptyReq);
  assert(errRes.status === 400, 'Empty request should return status 400');
  const errJson = await errRes.json();
  assert(errJson.success === false, 'Error response success must be false');

  // Test 2: Valid payload with multi-file evidence
  const validReq = new Request('http://localhost/api/evidence/batch-hash', {
    method: 'POST',
    body: JSON.stringify({
      files: [
        { name: 'evidence_doc.pdf', content: 'Sample document payload' },
        { name: 'surveillance.mp4', content: 'Sample video stream payload' },
      ],
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const okRes = await POST(validReq);
  assert(okRes.status === 200, 'Valid request should return status 200');
  const okJson = await okRes.json();
  assert(okJson.success === true, 'Success flag must be true');
  assert(okJson.data.filesProcessed === 2, 'Must process 2 files');
  assert(okJson.data.merkleRootHash.length === 64, 'Merkle root hash must be 64 characters');

  console.log('[Test Suite] All Batch Hash API route tests passed successfully.');
}
