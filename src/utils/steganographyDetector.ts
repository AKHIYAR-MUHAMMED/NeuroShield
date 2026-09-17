/**
 * LSB & Spatial Steganography Payload Detector
 * Scans image pixel channels for least-significant bit (LSB) entropy patterns indicative of hidden data payloads.
 */

export interface SteganographyScanResult {
  hasHiddenPayload: boolean;
  bitEntropy: number; // 0.0 to 1.0 (unusual LSB randomness > 0.85)
  affectedChannels: ('RED' | 'GREEN' | 'BLUE' | 'ALPHA')[];
  estimatedPayloadSizeBytes: number;
  verdict: 'CLEAN' | 'SUSPECTED_HIDDEN_DATA' | 'MALICIOUS_STEGANOGRAPHY';
}

/**
 * Analyzes RGB/RGBA pixel byte array for steganographic LSB anomalies.
 */
export function scanSteganographyPayload(
  pixelBytes: Uint8Array | Uint8ClampedArray,
  width: number = 256,
  height: number = 256
): SteganographyScanResult {
  if (!pixelBytes || pixelBytes.length === 0) {
    return {
      hasHiddenPayload: false,
      bitEntropy: 0.1,
      affectedChannels: [],
      estimatedPayloadSizeBytes: 0,
      verdict: 'CLEAN',
    };
  }

  // Sample LSBs of Red and Green channels
  let lsbOnes = 0;
  let totalSampled = 0;

  for (let i = 0; i < Math.min(pixelBytes.length, 4096); i += 4) {
    const rLsb = pixelBytes[i] & 1;
    const gLsb = pixelBytes[i + 1] & 1;
    lsbOnes += rLsb + gLsb;
    totalSampled += 2;
  }

  const lsbRatio = totalSampled > 0 ? lsbOnes / totalSampled : 0.5;
  // High entropy (ratio near 0.50 with zero bias) across LSB indicates encrypted payload
  const bitEntropy = parseFloat((1 - Math.abs(lsbRatio - 0.5) * 2).toFixed(3));
  const hasHiddenPayload = bitEntropy > 0.88;

  const affectedChannels: ('RED' | 'GREEN' | 'BLUE' | 'ALPHA')[] = hasHiddenPayload
    ? ['RED', 'GREEN', 'BLUE']
    : [];

  const estimatedPayloadSizeBytes = hasHiddenPayload ? Math.floor((width * height * 3) / 8) : 0;

  let verdict: SteganographyScanResult['verdict'] = 'CLEAN';
  if (hasHiddenPayload) {
    verdict = bitEntropy > 0.95 ? 'MALICIOUS_STEGANOGRAPHY' : 'SUSPECTED_HIDDEN_DATA';
  }

  return {
    hasHiddenPayload,
    bitEntropy,
    affectedChannels,
    estimatedPayloadSizeBytes,
    verdict,
  };
}
