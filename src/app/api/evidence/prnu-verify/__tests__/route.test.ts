import { describe, it, expect } from 'vitest';
import { POST } from '../route';

describe('PRNU Verify API Route', () => {
  it('should process PRNU verification request and return success JSON', async () => {
    const mockReq = {
      json: async () => ({ luminanceData: [120, 125, 128, 130, 122] }),
    } as any;

    const response = await POST(mockReq);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.status).toBe('success');
    expect(data.result).toBeDefined();
  });
});
