import { scanSteganographyPayload } from '../steganographyDetector';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test assertion failed: ${message}`);
  }
}

export function runSteganographyTests() {
  console.log('[Test Suite] Running Steganography Detector tests...');

  // Test 1: Empty buffer edge case
  const emptyRes = scanSteganographyPayload(new Uint8Array(0));
  assert(emptyRes.hasHiddenPayload === false, 'Empty buffer should yield no hidden payload');
  assert(emptyRes.verdict === 'CLEAN', 'Empty buffer verdict must be CLEAN');

  // Test 2: Low entropy natural image bytes
  const naturalBytes = new Uint8Array(4000);
  for (let i = 0; i < naturalBytes.length; i++) {
    naturalBytes[i] = (i * 17) % 256;
  }
  const naturalRes = scanSteganographyPayload(naturalBytes);
  assert(naturalRes.bitEntropy >= 0 && naturalRes.bitEntropy <= 1, 'Entropy must be between 0 and 1');

  // Test 3: High entropy random byte payload
  const randomBytes = new Uint8Array(4000);
  for (let i = 0; i < randomBytes.length; i++) {
    randomBytes[i] = i % 2 === 0 ? 0xff : 0xfe;
  }
  const randomRes = scanSteganographyPayload(randomBytes);
  assert(randomRes.verdict !== undefined, 'Verdict should be defined');

  console.log('[Test Suite] Steganography tests passed successfully.');
}
