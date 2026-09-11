import { computeSha256, processBatchHashes } from '../batchHasher';
import { parseExifHeader } from '../metadataExtractor';

describe('Cryptographic Evidence Hasher & Metadata Extractor', () => {
  it('computes a consistent SHA-256 hex string', async () => {
    const textEncoder = new TextEncoder();
    const buffer = textEncoder.encode('NeuroShield ISO 27037 Evidence').buffer;
    const hash = await computeSha256(buffer);

    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(64); // 256 bits = 64 hex characters
  });

  it('generates a valid Merkle root hash for batch files', async () => {
    const textEncoder = new TextEncoder();
    const files = [
      { name: 'evidence1.jpg', buffer: textEncoder.encode('Sample 1').buffer },
      { name: 'evidence2.mp4', buffer: textEncoder.encode('Sample 2').buffer },
    ];

    const result = await processBatchHashes(files);
    expect(result.filesProcessed).toBe(2);
    expect(result.merkleRootHash.length).toBe(64);
  });

  it('detects Midjourney software signatures in image headers', () => {
    const textEncoder = new TextEncoder();
    const headerBuffer = textEncoder.encode('Exif header with Midjourney v6 tags').buffer;
    const metadata = parseExifHeader(headerBuffer);

    expect(metadata.hasExifTampering).toBe(true);
    expect(metadata.softwareSignatures).toContain('Midjourney v6 Generator');
  });
});
