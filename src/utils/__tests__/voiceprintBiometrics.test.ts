import { analyzeVoiceprintBiometrics } from '../voiceprintBiometrics';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test assertion failed: ${message}`);
  }
}

export function runVoiceprintBiometricsTests() {
  console.log('[Test Suite] Running Voiceprint Biometrics & Pitch Trajectory tests...');

  // Test 1: Empty pitch contour fallback
  const emptyResult = analyzeVoiceprintBiometrics([], []);
  assert(emptyResult.vocalStabilityIndex === 0.5, 'Empty contour should default stability index to 0.5');
  assert(emptyResult.verdict === 'AUTHENTIC_HUMAN', 'Empty contour should default to AUTHENTIC_HUMAN');

  // Test 2: Natural human pitch variation
  const naturalPitch = [120, 122, 118, 125, 121, 119, 124, 120];
  const naturalAmp = [0.4, 0.45, 0.38, 0.42, 0.48, 0.41];
  const naturalResult = analyzeVoiceprintBiometrics(naturalPitch, naturalAmp);
  assert(naturalResult.pitchJitterPercent > 0.5, 'Natural speech should exhibit jitter > 0.5%');
  assert(naturalResult.formantResonanceHz.length === 3, 'Must return F1, F2, F3 formant frequencies');

  // Test 3: Synthetic phase-locked neural voice
  const syntheticPitch = [120.0, 120.01, 120.0, 120.01, 120.0];
  const syntheticAmp = [0.5, 0.5, 0.5, 0.5, 0.5];
  const syntheticResult = analyzeVoiceprintBiometrics(syntheticPitch, syntheticAmp);
  assert(syntheticResult.vocalStabilityIndex >= 0.9, 'Synthetic voice should have high stability index');
  assert(syntheticResult.verdict === 'SYNTHETIC_DEEPFAKE', 'Unnaturally flat speech should trigger SYNTHETIC_DEEPFAKE');

  console.log('[Test Suite] Voiceprint biometrics test suite passed.');
}
