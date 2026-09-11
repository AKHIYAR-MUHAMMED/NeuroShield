'use client';

import React from 'react';
import { Layers, Database, ArrowRight, ShieldCheck, Eye, Cpu, Zap } from 'lucide-react';
import { SAMPLE_DATASETS, EvidenceSample } from '@/data/samples';

interface DatasetExplorerProps {
  onSelectSample: (sample: EvidenceSample) => void;
  onOpenXai: (sample: EvidenceSample) => void;
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({ onSelectSample, onOpenXai }) => {
  return (
    <div className="space-y-8">
      
      {/* Hero Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-wide">
              Academic & Forensic Benchmark Datasets
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Explore pre-loaded benchmark samples from top computer vision & speech synthesis deepfake research datasets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="font-bold text-cyan-400 block">FaceForensics++</span>
            <span className="text-[10px] text-slate-400">1,000+ Forged Sequences</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="font-bold text-blue-400 block">Celeb-DF v2</span>
            <span className="text-[10px] text-slate-400">High-Quality Deepfakes</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="font-bold text-purple-400 block">DFDC Challenge</span>
            <span className="text-[10px] text-slate-400">Kaggle Benchmark</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="font-bold text-emerald-400 block">ASVspoof 2024</span>
            <span className="text-[10px] text-slate-400">Audio Synthetic Voices</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="font-bold text-amber-400 block">DocTamper</span>
            <span className="text-[10px] text-slate-400">Document OCR Tampering</span>
          </div>
        </div>
      </div>

      {/* Dataset Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_DATASETS.map((sample) => (
          <div 
            key={sample.id}
            className="glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between glass-panel-hover"
          >
            <div>
              {/* Media Preview Box */}
              <div className="relative aspect-video bg-slate-950 border-b border-slate-800 overflow-hidden group">
                <img
                  src={sample.previewUrl}
                  alt={sample.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur border border-slate-700 text-[10px] font-mono text-cyan-400 uppercase font-bold">
                    {sample.datasetName}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur border border-slate-700 text-[10px] font-mono text-slate-300 uppercase">
                    {sample.type}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-md ${
                    sample.authenticityScore >= 60 ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                  }`}>
                    {sample.authenticityScore}% Score
                  </span>
                </div>
              </div>

              {/* Card Info Body */}
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-white text-base leading-snug">{sample.title}</h3>
                
                <p className="text-xs text-slate-400 line-clamp-2">
                  {sample.evidencePoints[0]?.description || 'Forensic analysis completed.'}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>SHA-256: {sample.sha256Hash.substring(0, 10)}...</span>
                  <span>Block #{sample.blockNumber}</span>
                </div>
              </div>
            </div>

            {/* Card Action Buttons */}
            <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => onOpenXai(sample)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs flex items-center justify-center space-x-1.5 transition"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Explain XAI</span>
              </button>

              <button
                onClick={() => onSelectSample(sample)}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1 transition shadow"
              >
                <span>Certificate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
