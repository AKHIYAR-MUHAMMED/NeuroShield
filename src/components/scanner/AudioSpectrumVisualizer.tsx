'use client';

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ShieldCheck, RefreshCw, Cpu, Volume2 } from 'lucide-react';
import { analyzeAudioSpectrum, AudioSpectrumResult } from '../../utils/audioSpectrum';

interface AudioSpectrumVisualizerProps {
  sampleRate?: number;
  autoSimulate?: boolean;
}

export const AudioSpectrumVisualizer: React.FC<AudioSpectrumVisualizerProps> = ({
  sampleRate = 44100,
  autoSimulate = true,
}) => {
  const [analysis, setAnalysis] = useState<AudioSpectrumResult | null>(null);
  const [hoveredHz, setHoveredHz] = useState<number | null>(null);
  const [isRescanning, setIsRescanning] = useState(false);

  const runAnalysis = () => {
    setIsRescanning(true);
    // Generate synthetic PCM samples with synthetic voice characteristics
    const pcmLength = sampleRate * 3; // 3 seconds sample
    const buffer = new Float32Array(pcmLength);
    for (let i = 0; i < pcmLength; i++) {
      buffer[i] = (Math.sin((2 * Math.PI * 220 * i) / sampleRate) * 0.4 +
        Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 0.3 +
        (Math.random() - 0.5) * 0.1);
    }
    const result = analyzeAudioSpectrum(buffer, sampleRate);
    setAnalysis(result);
    setTimeout(() => setIsRescanning(false), 300);
  };

  useEffect(() => {
    if (autoSimulate) {
      runAnalysis();
    }
  }, [autoSimulate, sampleRate]);

  if (!analysis) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-400 text-center">
        Loading audio spectrum analysis...
      </div>
    );
  }

  const getRiskBadge = (risk: AudioSpectrumResult['riskLevel']) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-base text-white">Audio Frequency Spectrum Analyzer</h4>
            <p className="text-xs text-slate-400">FFT Spectral breakdown & synthetic voice artifact mapping</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRiskBadge(
              analysis.riskLevel
            )}`}
          >
            {analysis.riskLevel} RISK
          </span>
          <button
            onClick={runAnalysis}
            disabled={isRescanning}
            aria-label="Re-analyze audio spectrum"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isRescanning ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Synthetic Score</span>
          <div className="text-lg font-black text-indigo-400 mt-1">
            {(analysis.metrics.syntheticProbability * 100).toFixed(0)}%
          </div>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Spectral Centroid</span>
          <div className="text-lg font-black text-slate-200 mt-1">
            {analysis.metrics.spectralCentroidHz} Hz
          </div>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pitch Stability</span>
          <div className="text-lg font-black text-emerald-400 mt-1">
            {(analysis.metrics.pitchStabilityScore * 100).toFixed(0)}%
          </div>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Robotic Harmonics</span>
          <div className="text-lg font-black text-purple-400 mt-1">
            {(analysis.metrics.roboticHarmonicsScore * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Frequency Bar Chart Visualizer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            20 Hz - 20 kHz Spectrum Bins
          </span>
          <span>{hoveredHz ? `${hoveredHz} Hz selected` : 'Hover bars for frequency detail'}</span>
        </div>

        <div className="h-36 bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-end gap-1.5 overflow-x-auto">
          {analysis.bins.map((bin, index) => {
            const heightPercent = Math.max(12, bin.amplitude * 100);
            const isHovered = hoveredHz === bin.frequencyHz;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredHz(bin.frequencyHz)}
                onMouseLeave={() => setHoveredHz(null)}
                className="flex-1 min-w-[10px] group relative flex flex-col items-center justify-end h-full"
              >
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-sm transition-all duration-300 ${
                    bin.isAnomaly
                      ? 'bg-red-500 group-hover:bg-red-400'
                      : isHovered
                      ? 'bg-indigo-400'
                      : 'bg-indigo-600/80 group-hover:bg-indigo-500'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>Neural Model: Voice-Guard-v3 (44.1kHz PCM)</span>
        </div>
        <span>Duration: {analysis.durationSeconds}s</span>
      </div>
    </div>
  );
};
