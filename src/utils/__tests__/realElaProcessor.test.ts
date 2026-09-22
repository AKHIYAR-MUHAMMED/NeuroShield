import { describe, it, expect } from 'vitest';
import { processImageCanvasEla } from '../realElaProcessor';

describe('Real ELA Canvas Processor', () => {
  it('should be defined and export processImageCanvasEla function', () => {
    expect(processImageCanvasEla).toBeDefined();
    expect(typeof processImageCanvasEla).toBe('function');
  });
});
