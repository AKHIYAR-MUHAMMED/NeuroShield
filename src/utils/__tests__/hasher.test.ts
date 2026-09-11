import { computeSha256, processBatchHashes } from '../batchHasher';
import { parseExifHeader } from '../metadataExtractor';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test assertion failed: ${message}`);
  }
}

export async function runHasherTests() {
  console.log('[Test Suite] Running Cryptographic Evidence Hasher & Metadata Extractor tests...');

  // Test 1: SHA-256 calculation
  const textEncoder = new TextEncoder();
  const buffer = textEncoder.encode('NeuroShield ISO 27037 Evidence').buffer;
  const hash = await computeSha256(buffer);
  assert(typeof hash === 'string', 'hash must be a string');
  assert(hash.length === 64, 'hash length must be 64 characters');

  // Test 2: Merkle Root batch hashing
  const files = [
    { name: 'evidence1.jpg', buffer: textEncoder.encode('Sample 1').buffer },
    { name: 'evidence2.mp4', buffer: textEncoder.encode('Sample 2').buffer },
  ];
  const result = await processBatchHashes(files);
  assert(result.filesProcessed === 2, 'processed files count must be 2');
  assert(result.merkleRootHash.length === 64, 'merkle root length must be 64 characters');

  // Test 3: EXIF metadata parsing
  const headerBuffer = textEncoder.encode('Exif header with Midjourney v6 tags').buffer;
  const metadata = parseExifHeader(headerBuffer);
  assert(metadata.hasExifTampering === true, 'EXIF tampering should be detected');
  assert(metadata.softwareSignatures.includes('Midjourney v6 Generator'), 'Midjourney signature missing');

  console.log('[Test Suite] All evidence hasher tests passed successfully.');
}
