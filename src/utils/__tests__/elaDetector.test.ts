import { analyzeErrorLevelAnalysis } from '../elaDetector';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test assertion failed: ${message}`);
  }
}

export function runElaDetectorTests() {
  console.log('[Test Suite] Running Error Level Analysis (ELA) tests...');

  // Test 1: Empty input array fallback
  const emptyRes = analyzeErrorLevelAnalysis([]);
  assert(emptyRes.verdict === 'UNIFORM_COMPRESSION', 'Empty input should default to uniform compression');
  assert(emptyRes.elaHighlightGrid.length === 8, 'Grid height must default to 8');

  // Test 2: Uniform low-level compression
  const uniformValues = new Array(64).fill(130);
  const uniformRes = analyzeErrorLevelAnalysis(uniformValues);
  assert(uniformRes.hasRecompressionArtifacts === false, 'Uniform values should yield no recompression artifacts');

  // Test 3: Spliced image with high error deltas
  const splicedValues = new Array(64).fill(130);
  splicedValues[5] = 240;
  splicedValues[12] = 250;
  splicedValues[20] = 235;
  splicedValues[33] = 245;

  const splicedRes = analyzeErrorLevelAnalysis(splicedValues);
  assert(splicedRes.hasRecompressionArtifacts === true, 'High error deltas should trigger recompression detection');
  assert(splicedRes.verdict !== 'UNIFORM_COMPRESSION', 'Spliced image verdict must not be uniform');

  console.log('[Test Suite] ELA detector tests passed successfully.');
}
