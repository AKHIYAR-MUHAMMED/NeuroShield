import { describe, it, expect } from 'vitest';
import { GET } from '../route';

describe('Benchmark Metrics API Route', () => {
  it('should return 200 OK with valid JSON payload', async () => {
    const response = await GET();
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.status).toBe('success');
    expect(Array.isArray(data.benchmarkScores)).toBe(true);
    expect(data.benchmarkScores.length).toBeGreaterThan(0);
  });
});
