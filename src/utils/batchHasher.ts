/**
 * Batch Cryptographic Hasher for Multi-File Evidence Verification
 * Generates Merkle Root hashes for multi-file forensic evidence packages.
 */

export interface FileHashResult {
  fileName: string;
  fileSizeBytes: number;
  sha256Hash: string;
}

export interface BatchHasherProgress {
  filesCompleted: number;
  totalFiles: number;
  percent: number;
  bytesProcessed: number;
  totalBytes: number;
  throughputMBps: number;
  estimatedTimeRemainingSec: number;
}

export type BatchProgressCallback = (progress: BatchHasherProgress) => void;

export interface MerkleBatchResult {
  batchId: string;
  filesProcessed: number;
  totalSizeBytes: number;
  individualHashes: FileHashResult[];
  merkleRootHash: string;
  timestampUtc: string;
  elapsedMs: number;
  throughputMBps: number;
}

export async function computeSha256(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculates throughput speed in Megabytes per second (MB/s).
 */
export function calculateBatchThroughput(totalBytes: number, elapsedMs: number): number {
  if (elapsedMs <= 0 || totalBytes <= 0) return 0;
  const megabytes = totalBytes / (1024 * 1024);
  const seconds = elapsedMs / 1000;
  return parseFloat((megabytes / seconds).toFixed(2));
}

export async function processBatchHashes(
  fileEntries: { name: string; buffer: ArrayBuffer }[],
  onProgress?: BatchProgressCallback
): Promise<MerkleBatchResult> {
  const startTime = Date.now();
  const individualHashes: FileHashResult[] = [];
  const totalFiles = fileEntries.length;
  const totalBytes = fileEntries.reduce((sum, entry) => sum + entry.buffer.byteLength, 0);

  let bytesProcessed = 0;

  for (let i = 0; i < totalFiles; i++) {
    const entry = fileEntries[i];
    const hash = await computeSha256(entry.buffer);
    bytesProcessed += entry.buffer.byteLength;

    individualHashes.push({
      fileName: entry.name,
      fileSizeBytes: entry.buffer.byteLength,
      sha256Hash: hash,
    });

    if (onProgress) {
      const elapsedMs = Math.max(1, Date.now() - startTime);
      const throughputMBps = calculateBatchThroughput(bytesProcessed, elapsedMs);
      const remainingBytes = totalBytes - bytesProcessed;
      const bytesPerSec = (bytesProcessed / elapsedMs) * 1000;
      const estimatedTimeRemainingSec = bytesPerSec > 0 ? parseFloat((remainingBytes / bytesPerSec).toFixed(1)) : 0;

      onProgress({
        filesCompleted: i + 1,
        totalFiles,
        percent: Math.round(((i + 1) / totalFiles) * 100),
        bytesProcessed,
        totalBytes,
        throughputMBps,
        estimatedTimeRemainingSec,
      });
    }
  }

  const combinedString = individualHashes.map((h) => h.sha256Hash).join('');
  const encoder = new TextEncoder();
  const merkleRootHash = await computeSha256(encoder.encode(combinedString).buffer);
  const elapsedMs = Date.now() - startTime;

  return {
    batchId: `BATCH-${Date.now().toString(36).toUpperCase()}`,
    filesProcessed: individualHashes.length,
    totalSizeBytes: totalBytes,
    individualHashes,
    merkleRootHash,
    timestampUtc: new Date().toISOString(),
    elapsedMs,
    throughputMBps: calculateBatchThroughput(totalBytes, elapsedMs),
  };
}

