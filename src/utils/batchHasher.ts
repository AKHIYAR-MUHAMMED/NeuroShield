/**
 * Batch Cryptographic Hasher for Multi-File Evidence Verification
 * Generates Merkle Root hashes for multi-file forensic evidence packages.
 */

export interface FileHashResult {
  fileName: string;
  fileSizeBytes: number;
  sha256Hash: string;
}

export interface MerkleBatchResult {
  batchId: string;
  filesProcessed: number;
  individualHashes: FileHashResult[];
  merkleRootHash: string;
  timestampUtc: string;
}

export async function computeSha256(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function processBatchHashes(
  fileEntries: { name: string; buffer: ArrayBuffer }[]
): Promise<MerkleBatchResult> {
  const individualHashes: FileHashResult[] = [];

  for (const entry of fileEntries) {
    const hash = await computeSha256(entry.buffer);
    individualHashes.push({
      fileName: entry.name,
      fileSizeBytes: entry.buffer.byteLength,
      sha256Hash: hash,
    });
  }

  const combinedString = individualHashes.map((h) => h.sha256Hash).join('');
  const encoder = new TextEncoder();
  const merkleRootHash = await computeSha256(encoder.encode(combinedString).buffer);

  return {
    batchId: `BATCH-${Date.now().toString(36).toUpperCase()}`,
    filesProcessed: individualHashes.length,
    individualHashes,
    merkleRootHash,
    timestampUtc: new Date().toISOString(),
  };
}
