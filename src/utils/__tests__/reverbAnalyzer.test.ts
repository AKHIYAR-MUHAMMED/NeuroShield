import { analyzeAcousticReverb } from '../reverbAnalyzer';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test assertion failed: ${message}`);
  }
}

export function runReverbAnalyzerTests() {
  console.log('[Test Suite] Running Acoustic Reverb & Room Impulse tests...');

  // Test 1: Empty frames fallback
  const emptyRes = analyzeAcousticReverb([]);
  assert(emptyRes.verdict === 'UNIFORM_ROOM_ACOUSTICS', 'Empty frames should return uniform acoustics');

  // Test 2: Uniform acoustic frames
  const smoothFrames = [0.1, 0.12, 0.11, 0.13, 0.12, 0.11, 0.12];
  const smoothRes = analyzeAcousticReverb(smoothFrames);
  assert(smoothRes.backgroundDiscontinuityDetected === false, 'Smooth frames should have no discontinuity');

  // Test 3: Sudden energy jump / spliced audio
  const splicedFrames = [0.1, 0.12, 0.95, 0.11, 0.92, 0.12, 0.88];
  const splicedRes = analyzeAcousticReverb(splicedFrames);
  assert(splicedRes.backgroundDiscontinuityDetected === true, 'Energy spikes should trigger discontinuity detection');

  console.log('[Test Suite] Acoustic reverb analyzer tests passed successfully.');
}
