import { analyzeAudioSpectrum, generateSampleSpectrumBins } from '../audioSpectrum';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test assertion failed: ${message}`);
  }
}

export function runAudioSpectrumTests() {
  console.log('[Test Suite] Running Audio Spectrum & Neural Voice Analyzer tests...');

  // Test 1: Empty audio buffer edge case
  const emptySamples = new Float32Array(0);
  const emptyResult = analyzeAudioSpectrum(emptySamples, 44100);
  assert(emptyResult.bins.length === 0, 'Empty buffer should yield 0 frequency bins');
  assert(emptyResult.durationSeconds === 0, 'Duration must be 0 for empty buffer');
  assert(emptyResult.riskLevel === 'LOW', 'Empty buffer should default to LOW risk');

  // Test 2: Valid PCM sample array analysis
  const sampleCount = 44100 * 2; // 2 seconds of audio
  const audioBuffer = new Float32Array(sampleCount);
  for (let i = 0; i < sampleCount; i++) {
    // Generate 440Hz sine wave (A4 tone)
    audioBuffer[i] = Math.sin((2 * Math.PI * 440 * i) / 44100) * 0.5;
  }

  const result = analyzeAudioSpectrum(audioBuffer, 44100);
  assert(result.durationSeconds === 2.0, 'Duration should be calculated as 2.0 seconds');
  assert(result.bins.length === 24, 'Result must contain 24 frequency bins');
  assert(result.metrics.syntheticProbability >= 0 && result.metrics.syntheticProbability <= 1, 'Probability must be between 0 and 1');
  assert(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(result.riskLevel), 'Invalid risk level returned');

  // Test 3: Sample spectrum bins helper
  const sampleBins = generateSampleSpectrumBins(15);
  assert(sampleBins.length === 15, 'Sample bin count should equal requested count (15)');
  assert(sampleBins[0].frequencyHz > 0, 'Frequency Hz should be greater than 0');

  console.log('[Test Suite] All audio spectrum analyzer tests passed successfully.');
}
