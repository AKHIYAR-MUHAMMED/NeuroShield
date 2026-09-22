import { describe, it, expect } from 'vitest';
import { estimateSubcutaneousBloodPulse } from '../rppgPulseEstimator';

describe('rPPG Subcutaneous Capillary Pulse Estimator', () => {
  it('should detect synthetic flatline on empty or tiny inputs', () => {
    const result = estimateSubcutaneousBloodPulse([]);
    expect(result.verdict).toBe('SYNTHETIC_FLATLINE');
    expect(result.isLiveHumanPulse).toBe(false);
  });

  it('should estimate realistic BPM on rhythmic green channel variations', () => {
    // Generate 90 frames of synthetic sine wave representing 72 BPM pulse
    const fps = 30;
    const greenSeries = Array.from({ length: 90 }, (_, i) => 120 + Math.sin((i / fps) * 2 * Math.PI * 1.2) * 5);
    const result = estimateSubcutaneousBloodPulse(greenSeries, fps);
    expect(result.estimatedBpm).toBeGreaterThan(50);
    expect(result.estimatedBpm).toBeLessThan(120);
  });
});
