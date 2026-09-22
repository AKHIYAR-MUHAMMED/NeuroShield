import { describe, it, expect } from 'vitest';
import { extractPrnuNoiseFingerprint } from '../prnuExtractor';

describe('PRNU Camera Sensor Noise Extractor', () => {
  it('should detect zero noise in synthetic zero arrays', () => {
    const syntheticData = new Array(100).fill(128);
    const result = extractPrnuNoiseFingerprint(syntheticData);
    expect(result.verdict).toBe('SYNTHETIC_ZERO_NOISE');
    expect(result.hasValidCmosPattern).toBe(false);
  });

  it('should detect valid hardware sensor noise in varied intensity data', () => {
    const sensorData = Array.from({ length: 100 }, (_, i) => 128 + (i % 10) * 5);
    const result = extractPrnuNoiseFingerprint(sensorData);
    expect(result.hasValidCmosPattern).toBe(true);
    expect(result.verdict).toBe('VALID_HARDWARE_SENSOR');
  });
});
