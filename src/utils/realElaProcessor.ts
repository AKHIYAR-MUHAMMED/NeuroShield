/**
 * Real Client-Side Error Level Analysis (ELA) Processing Engine
 * Loads an image onto an HTML5 Canvas, simulates re-compression delta,
 * and extracts pixel luminance variance maps for deepfake region highlighting.
 */

export interface ElaCanvasAnalysis {
  elaDataUrl: string; // Base64 data URL of generated ELA heatmap image
  avgDelta: number;
  maxDelta: number;
  anomalousPercent: number;
  verdict: 'UNIFORM_COMPRESSION' | 'LOCALIZED_EDITING_SUSPECTED' | 'HIGH_CONFIDENCE_MANIPULATION';
}

export async function processImageCanvasEla(
  imageSource: string | HTMLImageElement,
  quality: number = 0.75,
  multiplier: number = 15
): Promise<ElaCanvasAnalysis> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const width = Math.min(img.width, 800);
        const height = Math.round((img.height / img.width) * width);

        // Original Canvas
        const canvas1 = document.createElement('canvas');
        canvas1.width = width;
        canvas1.height = height;
        const ctx1 = canvas1.getContext('2d');
        if (!ctx1) throw new Error('Canvas 2D context unavailable');

        ctx1.drawImage(img, 0, 0, width, height);
        const imgData1 = ctx1.getImageData(0, 0, width, height);
        const data1 = imgData1.data;

        // Re-compressed Canvas (Simulate JPEG 75% quality re-encode)
        const canvas2 = document.createElement('canvas');
        canvas2.width = width;
        canvas2.height = height;
        const ctx2 = canvas2.getContext('2d');
        if (!ctx2) throw new Error('Canvas 2D context unavailable');

        // Export as JPEG at specified quality
        const jpegUrl = canvas1.toDataURL('image/jpeg', quality);

        const reCompressedImg = new Image();
        reCompressedImg.onload = () => {
          ctx2.drawImage(reCompressedImg, 0, 0, width, height);
          const imgData2 = ctx2.getImageData(0, 0, width, height);
          const data2 = imgData2.data;

          // ELA Output Canvas
          const elaCanvas = document.createElement('canvas');
          elaCanvas.width = width;
          elaCanvas.height = height;
          const elaCtx = elaCanvas.getContext('2d');
          if (!elaCtx) throw new Error('ELA Canvas context unavailable');

          const elaImgData = elaCtx.createImageData(width, height);
          const elaData = elaImgData.data;

          let totalDelta = 0;
          let maxDelta = 0;
          let highDeltaCount = 0;
          const totalPixels = width * height;

          for (let i = 0; i < data1.length; i += 4) {
            const diffR = Math.abs(data1[i] - data2[i]);
            const diffG = Math.abs(data1[i + 1] - data2[i + 1]);
            const diffB = Math.abs(data1[i + 2] - data2[i + 2]);

            // Scaled error intensity
            const deltaR = Math.min(255, diffR * multiplier);
            const deltaG = Math.min(255, diffG * multiplier);
            const deltaB = Math.min(255, diffB * multiplier);
            const avgPixelDelta = (diffR + diffG + diffB) / 3;

            totalDelta += avgPixelDelta;
            if (avgPixelDelta > maxDelta) maxDelta = avgPixelDelta;
            if (avgPixelDelta > 15) highDeltaCount++;

            // Highlight in ELA heat map (cyan/rose tone for manipulated areas)
            if (avgPixelDelta > 20) {
              elaData[i] = Math.min(255, deltaR * 2);     // Red
              elaData[i + 1] = Math.min(255, deltaG * 0.5); // Green
              elaData[i + 2] = Math.min(255, deltaB * 2.5); // Blue
              elaData[i + 3] = 255;
            } else {
              // Subdued grayscale error background
              const gray = Math.min(255, (deltaR + deltaG + deltaB) / 3);
              elaData[i] = gray * 0.2;
              elaData[i + 1] = gray * 0.4;
              elaData[i + 2] = gray * 0.8;
              elaData[i + 3] = 220;
            }
          }

          elaCtx.putImageData(elaImgData, 0, 0);

          const avgDelta = parseFloat((totalDelta / totalPixels).toFixed(2));
          const anomalousPercent = parseFloat(((highDeltaCount / totalPixels) * 100).toFixed(1));

          let verdict: ElaCanvasAnalysis['verdict'] = 'UNIFORM_COMPRESSION';
          if (anomalousPercent > 8.0) {
            verdict = 'HIGH_CONFIDENCE_MANIPULATION';
          } else if (anomalousPercent > 2.5) {
            verdict = 'LOCALIZED_EDITING_SUSPECTED';
          }

          resolve({
            elaDataUrl: elaCanvas.toDataURL('image/png'),
            avgDelta,
            maxDelta: parseFloat(maxDelta.toFixed(2)),
            anomalousPercent,
            verdict,
          });
        };

        reCompressedImg.src = jpegUrl;
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => reject(err);

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      img.src = imageSource.src;
    }
  });
}
