import {
  generateSpatialHeatmapMatrix,
  extractAnomalyBoundingBoxes,
} from '../xaiHeatmap';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test assertion failed: ${message}`);
  }
}

export function runXaiHeatmapTests() {
  console.log('[Test Suite] Running Explainable AI Heatmap utility tests...');

  // Test 1: Grid Dimensions
  const matrix = generateSpatialHeatmapMatrix(16, 16, 0.65);
  assert(matrix.length === 16, 'Grid height must equal 16');
  assert(matrix[0].length === 16, 'Grid width must equal 16');
  assert(matrix[0][0].intensity >= 0 && matrix[0][0].intensity <= 1.0, 'Intensity must be bounded between 0 and 1');

  // Test 2: Bounding Box Extraction
  const boxes = extractAnomalyBoundingBoxes(matrix, 0.6);
  assert(boxes.length > 0, 'Bounding box should be extracted for high-sensitivity heatmap');
  assert(boxes[0].widthPercent > 0, 'Bounding box width must be greater than 0');
  assert(boxes[0].label.includes('Deepfake'), 'Bounding box label must reference Deepfake');

  // Test 3: No anomalies when threshold is set to 1.1
  const emptyBoxes = extractAnomalyBoundingBoxes(matrix, 1.1);
  assert(emptyBoxes.length === 0, 'High threshold (1.1) should return zero bounding boxes');

  console.log('[Test Suite] All XAI Heatmap tests passed successfully.');
}
