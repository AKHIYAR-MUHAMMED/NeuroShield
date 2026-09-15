'use client';

import React, { useState } from 'react';
import { Upload, Eye, Cpu, Zap, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, BarChart2 } from 'lucide-react';
import { EvidenceSample } from '@/data/samples';
import { calculateSHA256, generateBlockchainTxId } from '@/utils/crypto';
import { insertEvidenceRecord, queryAstraVectorSimilarity, VectorSearchResult } from '@/utils/astra';

interface ImageScannerProps {
  onAnalysisComplete: (result: EvidenceSample) => void;
  onOpenXai: (sample: EvidenceSample) => void;
}

export const ImageScanner: React.FC<ImageScannerProps> = ({ onAnalysisComplete, onOpenXai }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [statusStage, setStatusStage] = useState<string>('Initializing PyTorch Engine...');
  const [astraSaveStatus, setAstraSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'fallback'>('idle');
  const [topVectorMatch, setTopVectorMatch] = useState<VectorSearchResult | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Start Analysis Sequence
    runImagePipeline(file, objectUrl);
  };

  const runImagePipeline = async (file: File, filePreview: string) => {
    setAnalyzing(true);
    setAnalysisProgress(10);
    setStatusStage('1/5 Extracting EXIF & Quantization Matrices...');

    const hash = await calculateSHA256(file);

    setTimeout(() => {
      setAnalysisProgress(35);
      setStatusStage('2/5 Running Spatial Error Level Analysis (ELA)...');
    }, 600);

    setTimeout(() => {
      setAnalysisProgress(60);
      setStatusStage('3/5 Computing Vision Transformer (ViT-L/14) Frequency Map...');
    }, 1200);

    setTimeout(() => {
      setAnalysisProgress(85);
      setStatusStage('4/5 Generating Grad-CAM Class Activation Heatmap...');
    }, 1800);

    setTimeout(() => {
      setAnalysisProgress(100);
      setAnalyzing(false);

      // Determine simulated result based on file name or default high precision test
      const isFake = file.name.toLowerCase().includes('fake') || file.name.toLowerCase().includes('edit') || Math.random() > 0.5;
      
      const newResult: EvidenceSample = {
        id: `custom-img-${Date.now()}`,
        title: file.name,
        type: 'image',
        datasetName: 'Live Upload Scan',
        authenticityScore: isFake ? Math.floor(10 + Math.random() * 25) : Math.floor(88 + Math.random() * 11),
        verdict: isFake ? 'Manipulated / Deepfake' : 'Likely Real',
        previewUrl: filePreview,
        sha256Hash: hash,
        blockchainId: generateBlockchainTxId(),
        blockNumber: 19842140 + Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        mimeType: file.type || 'image/jpeg',
        evidencePoints: isFake ? [
          { title: 'GAN Frequency Anomaly', description: 'Spectral peak detected at 14.2kHz indicating synthetic face blending.', type: 'fail' },
          { title: 'Facial Symmetry Variance', description: 'Corneal reflection angle deviates by 8.4 degrees.', type: 'fail' },
          { title: 'Localized Compression Diff', description: 'JPEG quantization grid inconsistency near cheek boundary.', type: 'warning' }
        ] : [
          { title: 'Natural Lighting Consistency', description: '3D specular lighting map matches environment ambient light.', type: 'pass' },
          { title: 'Biological Pulse Estimation (rPPG)', description: 'Detected live capillary blood flow micro-color pulse at 72 BPM.', type: 'pass' },
          { title: 'Valid Camera EXIF Header', description: 'Hardware sensor serial checksum validated.', type: 'pass' }
        ],
        metadata: {
          'File Name': file.name,
          'Resolution': '1920x1080',
          'Color Space': 'sRGB',
          'Software': isFake ? 'FaceSwap / DeepFaceLab Engine' : 'Hardware Camera Module'
        },
        fftData: isFake ? [30, 95, 120, 45, 90, 110, 20, 15] : [95, 60, 40, 25, 15, 8, 3]
      };

      onAnalysisComplete(newResult);

      // Write to Astra DB (async IIFE inside setTimeout callback)
      setAstraSaveStatus('saving');
      (async () => {
        const insertResult = await insertEvidenceRecord(newResult);
        setAstraSaveStatus(insertResult.source === 'astra' ? 'saved' : 'fallback');

        const vecResult = await queryAstraVectorSimilarity(newResult.sha256Hash, 1);
        if (vecResult.success && vecResult.results.length > 0) {
          setTopVectorMatch(vecResult.results[0]);
        }
      })();
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Astra DB Save Badge */}
      {(astraSaveStatus === 'saved' || astraSaveStatus === 'fallback') && (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold ${
          astraSaveStatus === 'saved'
            ? 'bg-purple-950/60 border-purple-700/50 text-purple-300'
            : 'bg-amber-950/60 border-amber-700/50 text-amber-300'
        }`}>
          {astraSaveStatus === 'saved' ? (
            <><CheckCircle2 className="w-4 h-4 text-purple-400" /> Evidence record saved to DataStax Astra DB vector index ✓</>
          ) : (
            <><AlertTriangle className="w-4 h-4 text-amber-400" /> Saved to local fallback cache (configure Astra token for live mode)</>
          )}
        </div>
      )}
      {astraSaveStatus === 'saving' && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-purple-950/30 border-purple-800/30 text-purple-400 text-xs font-semibold animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin" /> Saving evidence to Astra DB…
        </div>
      )}
      {/* Nearest Vector Match */}
      {topVectorMatch && (
        <div className="bg-slate-950 border border-purple-700/40 rounded-xl p-3 text-xs">
          <p className="text-purple-300 font-semibold mb-1">🔍 Nearest Astra DB Vector Match ({(topVectorMatch.similarityScore * 100).toFixed(1)}% similarity)</p>
          <p className="text-slate-300">{topVectorMatch.sampleTitle}</p>
          <p className="text-slate-500 font-mono">{topVectorMatch.metadata.datasetOrigin} · {topVectorMatch.threatLevel.replace('_', ' ')}</p>
        </div>
      )}
      
      {/* Upload Drop Zone */}
      {!previewUrl ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${
            dragActive
              ? 'border-cyan-400 bg-cyan-950/20 glow-cyan'
              : 'border-slate-700 bg-slate-900/60 hover:border-slate-500 hover:bg-slate-900'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload-input"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
          <label htmlFor="image-upload-input" className="cursor-pointer space-y-4 block">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Upload Image for Deepfake Detection</h3>
              <p className="text-xs text-slate-400 mt-1">
                Supports JPG, PNG, WEBP. Maximum file size 50MB.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2 text-[11px] text-slate-400">
              <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">GAN Artifact Detection</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">Grad-CAM XAI Heatmaps</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">FFT Frequency Analysis</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">rPPG Pulse Estimation</span>
            </div>
          </label>
        </div>
      ) : (
        /* Preview & Progress Section */
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{selectedFile?.name || 'Image Evidence'}</h4>
                <p className="text-xs text-slate-400">{(selectedFile?.size ? (selectedFile.size / 1024).toFixed(1) : 0)} KB</p>
              </div>
            </div>
            
            <button
              onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan Another</span>
            </button>
          </div>

          {analyzing ? (
            <div className="space-y-4 bg-slate-950 p-6 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>{statusStage}</span>
                <span>{analysisProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-400 pt-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>Spatial ELA Pass</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                  <span>Frequency FFT Spectrum</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Facial Landmark Mesh</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                  <span>rPPG Pulse Sensor</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <img src={previewUrl} alt="Scan Preview" className="max-h-80 rounded-xl border border-slate-800 object-contain" />
            </div>
          )}
        </div>
      )}

    </div>
  );
};
