/**
 * Explainable AI (XAI) Activation Heatmap Utility
 * Generates spatial activation matrices, thermal color maps, and bounding box region extraction
 * for visual deepfake manipulation inspection.
 */

export interface HeatmapGridPoint {
  x: number;
  y: number;
  intensity: number; // 0.0 to 1.0
  isManipulated: boolean;
}

export interface AnomalyBoundingBox {
  id: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  confidenceScore: number;
  label: string;
}

export type HeatmapPalette = 'thermal' | 'infrared' | 'neon';

/**
 * Generates a gridWidth x gridHeight spatial activation matrix with simulated AI deepfake activation hotspots.
 */
export function generateSpatialHeatmapMatrix(
  gridWidth: number = 16,
  gridHeight: number = 16,
  sensitivityThreshold: number = 0.65
): HeatmapGridPoint[][] {
  const matrix: HeatmapGridPoint[][] = [];

  for (let y = 0; y < gridHeight; y++) {
    const row: HeatmapGridPoint[] = [];
    for (let x = 0; x < gridWidth; x++) {
      // Distance from center hotspot (simulating facial region activation)
      const centerX = gridWidth * 0.5;
      const centerY = gridHeight * 0.4;
      const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      const baseIntensity = Math.max(0, 1.0 - dist / (gridWidth * 0.45));
      const noise = (Math.sin(x * 0.8) * Math.cos(y * 0.8) + 1) * 0.15;
      const intensity = parseFloat(Math.min(1.0, Math.max(0, baseIntensity + noise)).toFixed(2));
      const isManipulated = intensity >= sensitivityThreshold;

      row.push({ x, y, intensity, isManipulated });
    }
    matrix.push(row);
  }

  return matrix;
}

/**
 * Extracts bounding box coordinates around high-intensity activation regions.
 */
export function extractAnomalyBoundingBoxes(
  matrix: HeatmapGridPoint[][],
  minScore: number = 0.7
): AnomalyBoundingBox[] {
  const gridHeight = matrix.length;
  if (gridHeight === 0) return [];
  const gridWidth = matrix[0].length;

  let minX = gridWidth, maxX = 0, minY = gridHeight, maxY = 0;
  let maxIntensity = 0;
  let count = 0;

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const pt = matrix[y][x];
      if (pt.intensity >= minScore) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        maxIntensity = Math.max(maxIntensity, pt.intensity);
        count++;
      }
    }
  }

  if (count === 0) return [];

  const xPercent = parseFloat(((minX / gridWidth) * 100).toFixed(1));
  const yPercent = parseFloat(((minY / gridHeight) * 100).toFixed(1));
  const widthPercent = parseFloat((((maxX - minX + 1) / gridWidth) * 100).toFixed(1));
  const heightPercent = parseFloat((((maxY - minY + 1) / gridHeight) * 100).toFixed(1));

  return [
    {
      id: 'ANOMALY-01',
      xPercent,
      yPercent,
      widthPercent,
      heightPercent,
      confidenceScore: maxIntensity,
      label: 'Deepfake Facial Mesh Distortions',
    },
  ];
}
