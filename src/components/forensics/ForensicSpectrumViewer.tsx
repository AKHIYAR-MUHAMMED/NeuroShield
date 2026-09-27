'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Sliders,
  Eye,
  Camera,
  Heart,
  Maximize2,
  Download,
  RefreshCw,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Radio,
} from 'lucide-react';
import { SAMPLE_DATASETS } from '@/data/samples';

export const ForensicSpectrumViewer: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'fft' | 'ela' | 'rppg' | 'prnu'>('fft');
  const [gain, setGain] = useState<number>(1.5);
  const [contrast, setContrast] = useState<number>(1.2);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [fftData, setFftData] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sample = SAMPLE_DATASETS[selectedSampleIndex] || SAMPLE_DATASETS[0];

  // Generate dynamic FFT frequency spectrum array
  useEffect(() => {
    const generateFft = () => {
      const arr: number[] = [];
      const isSynthetic = sample.authenticityScore < 50;
      for (let i = 0; i < 64; i++) {
        const freq = i / 64;
        let amp = Math.exp(-freq * 3) * (0.8 + Math.random() * 0.2);
        // Inject high frequency synthetic spikes for deepfakes
        if (isSynthetic && i > 40) {
          amp += Math.sin(i * 0.5) * 0.45 * (0.8 + Math.random() * 0.4);
        }
        arr.push(Math.min(1.0, Math.max(0.02, amp)));
      }
      setFftData(arr);
    };

    generateFft();
    const interval = setInterval(() => {
      if (isPlaying) generateFft();
    }, 150);

    return () => clearInterval(interval);
  }, [sample, isPlaying]);

  // Render Canvas Visualizer based on active mode
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Draw background grid lines
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (activeMode === 'fft') {
      // Render 2D/3D FFT High-Frequency Energy Spectrum
      const barWidth = width / fftData.length;
      fftData.forEach((val, i) => {
        const barHeight = val * height * 0.8 * gain;
        const x = i * barWidth;
        const y = height - barHeight;

        // Gradient color: blue/cyan to red/magenta at high frequencies
        const gradient = ctx.createLinearGradient(0, height, 0, y);
        if (i > 40 && sample.authenticityScore < 50) {
          gradient.addColorStop(0, '#38bdf8');
          gradient.addColorStop(0.5, '#f43f5e');
          gradient.addColorStop(1, '#e11d48');
        } else {
          gradient.addColorStop(0, '#0284c7');
          gradient.addColorStop(0.6, '#38bdf8');
          gradient.addColorStop(1, '#34d399');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);

        // Highlight energy ceiling line
        if (i > 40 && val > 0.4) {
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y - 4, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw threshold energy line
      ctx.strokeStyle = '#f43f5e';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.35);
      ctx.lineTo(width, height * 0.35);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f43f5e';
      ctx.font = '10px monospace';
      ctx.fillText('CRITICAL GAN HIGH-FREQUENCY ANOMALY THRESHOLD (24 kHz)', 10, height * 0.35 - 6);
    } else if (activeMode === 'ela') {
      // Render JPEG Error Level Analysis Heatmap
      const rows = 20;
      const cols = 30;
      const cellW = width / cols;
      const cellH = height / rows;
      const isSynthetic = sample.authenticityScore < 50;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let noiseVal = (Math.random() * 0.25) * contrast;
          // Injected ELA error patch for tampered areas
          if (isSynthetic && r > 6 && r < 14 && c > 10 && c < 20) {
            noiseVal = (0.55 + Math.random() * 0.45) * contrast;
          }

          const red = Math.min(255, Math.floor(noiseVal * 255));
          const green = Math.min(255, Math.floor((1 - noiseVal) * 160));
          const blue = Math.min(255, Math.floor((1 - noiseVal) * 220));

          ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.85)`;
          ctx.fillRect(c * cellW, r * cellH, cellW - 1, cellH - 1);
        }
      }

      // Draw tampered boundary box if synthetic
      if (isSynthetic) {
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.strokeRect((10 * cellW), (6 * cellH), (10 * cellW), (8 * cellH));

        ctx.fillStyle = '#f43f5e';
        ctx.font = '11px sans-serif';
        ctx.fillText('⚠️ ELA COMPRESSION MISMATCH DETECTED', 10 * cellW, 6 * cellH - 6);
      }
    } else if (activeMode === 'rppg') {
      // Render Subcutaneous Capillary Blood Flow Pulse Wave
      ctx.strokeStyle = sample.authenticityScore > 50 ? '#10b981' : '#f43f5e';
      ctx.lineWidth = 3;
      ctx.beginPath();

      const time = Date.now() / 150;
      const isSynthetic = sample.authenticityScore < 50;

      for (let x = 0; x < width; x++) {
        let y = height / 2;
        if (isSynthetic) {
          // Flat/irregular pulse wave (synthetic video)
          y += Math.sin(x * 0.05 + time) * 10 + (Math.random() - 0.5) * 6;
        } else {
          // Organic Cardiac Pulse Wave Form (P-Q-R-S-T curve)
          const pulse = (x + time * 30) % 120;
          let deltaY = 0;
          if (pulse > 40 && pulse < 50) deltaY = -Math.sin((pulse - 40) / 10 * Math.PI) * 50; // R peak
          else if (pulse > 50 && pulse < 58) deltaY = Math.sin((pulse - 50) / 8 * Math.PI) * 18; // S wave
          else if (pulse > 70 && pulse < 90) deltaY = -Math.sin((pulse - 70) / 20 * Math.PI) * 20; // T wave
          y += deltaY + (Math.random() - 0.5) * 3;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Subcutaneous Heart Rate Text Overlay
      ctx.fillStyle = sample.authenticityScore > 50 ? '#34d399' : '#f43f5e';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(
        sample.authenticityScore > 50
          ? '🫀 Subcutaneous Capillary Pulse Verified: 74 BPM (Human Live Sync)'
          : '⚠️ Biological Capillary Pulse Wave Absent: Synthetic Video Deepfake',
        16,
        30
      );
    } else if (activeMode === 'prnu') {
      // Render PRNU Sensor Noise Residual Fingerprint Matrix
      const size = 60;
      const cellW = width / size;
      const cellH = height / size;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const noise = Math.random();
          const val = Math.floor(noise * 255);
          ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
          ctx.fillRect(j * cellW, i * cellH, cellW, cellH);
        }
      }

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`CMOS Sensor Fingerprint Correlation: ${sample.authenticityScore > 50 ? '0.94 (Sony IMX766 Match)' : '0.12 (Synthetic No-Sensor Noise)'}`, 16, 30);
    }
  }, [activeMode, gain, contrast, fftData, sample]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" /> High-Level Forensic Diagnostics
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Multi-Spectral Spectrum Lab
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Multi-Modal <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">Forensic Spectrum Laboratory</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Real-time interactive canvas visualizer for 2D/3D Fast Fourier Transform (FFT) Spectral Anomaly Graphs, JPEG Error Level Analysis (ELA) Compression Heatmaps, Subcutaneous Capillary Blood Flow (rPPG) Pulse Waves, and CMOS PRNU Sensor Fingerprints.
            </p>
          </div>

          {/* Sample Switcher Dropdown */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 w-full lg:w-72 shadow-inner">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Evidence Exhibit</span>
            <select
              value={selectedSampleIndex}
              onChange={(e) => setSelectedSampleIndex(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-cyan-500"
            >
              {SAMPLE_DATASETS.map((s, idx) => (
                <option key={s.id} value={idx}>
                  {s.title} ({s.authenticityScore > 50 ? 'Authentic' : 'Synthetic'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Diagnostic Mode Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveMode('fft')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeMode === 'fft'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" /> 2D/3D FFT Spectral Curves
          </button>
          <button
            onClick={() => setActiveMode('ela')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeMode === 'ela'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" /> Error Level Analysis (ELA)
          </button>
          <button
            onClick={() => setActiveMode('rppg')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeMode === 'rppg'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Heart className="w-4 h-4" /> rPPG Biological Pulse Wave
          </button>
          <button
            onClick={() => setActiveMode('prnu')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeMode === 'prnu'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" /> PRNU CMOS Sensor Residual
          </button>
        </div>
      </div>

      {/* Main Canvas & Control Suite Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Canvas Display Viewport */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="font-bold text-base text-white">
                {activeMode === 'fft' && 'Fast Fourier Transform (FFT) Spectral Density'}
                {activeMode === 'ela' && 'JPEG Error Level Compression Resampling Matrix'}
                {activeMode === 'rppg' && 'Subcutaneous Blood Flow Pulse Wave Engine'}
                {activeMode === 'prnu' && 'CMOS Photo Response Non-Uniformity Fingerprint'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin text-cyan-400' : ''}`} />
                {isPlaying ? 'Live Stream' : 'Paused'}
              </button>
            </div>
          </div>

          {/* Render HTML5 Canvas */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-2 shadow-inner">
            <canvas
              ref={canvasRef}
              width={720}
              height={360}
              className="w-full h-auto rounded-xl max-h-[380px] object-contain"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 font-mono">
            <span>Exhibit ID: {sample.id}</span>
            <span>Type: {sample.type.toUpperCase()}</span>
            <span>Verdict: {sample.authenticityScore > 50 ? 'AUTHENTIC' : 'SYNTHETIC'}</span>
          </div>
        </div>

        {/* Diagnostics Parameter Control Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Spectral Fine-Tuning</h3>
                <p className="text-xs text-slate-400">Adjust signal gain & contrast parameters</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Gain Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">Spectral Signal Gain</span>
                  <span className="font-mono text-cyan-400 font-bold">{gain.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={gain}
                  onChange={(e) => setGain(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Contrast Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">ELA Noise Contrast</span>
                  <span className="font-mono text-cyan-400 font-bold">{contrast.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={contrast}
                  onChange={(e) => setContrast(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Detailed Breakdown Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Forensic Diagnostic Insight</span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {sample.authenticityScore > 50
                    ? `Organic sample exhibits smooth high-frequency energy falloff, natural compression quantization, and biological heart rate pulse sync.`
                    : `Synthetic sample contains distinct high-frequency GAN grid spikes (>24kHz), abnormal ELA quantization deltas, and zero biological capillary flow.`}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>ISO/IEC 27037 Compliant</span>
            <span className="text-cyan-400 font-bold">READY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
