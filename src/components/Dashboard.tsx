'use client';

import React from 'react';
import { Shield, Cpu, Database, QrCode, FileCheck, ArrowRight, Zap, CheckCircle2, AlertTriangle, Activity, Lock, Layers, Eye, Sparkles } from 'lucide-react';
import { SAMPLE_DATASETS, EvidenceSample } from '@/data/samples';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onSelectSample: (sample: EvidenceSample) => void;
  onOpenXai: (sample: EvidenceSample) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onSelectSample, onOpenXai }) => {
  return (
    <div className="space-y-10">
      
      {/* Hero Banner with Cyber Mesh */}
      <div className="relative rounded-3xl p-8 sm:p-12 border border-slate-800 glass-panel bg-radial-glow overflow-hidden">
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI + Blockchain Multi-Modal Evidence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Verify whether any <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">image, video, audio, or document</span> is authentic within seconds.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            NeuroShield combines Vision Transformers, Grad-CAM Explainable AI, Wav2Vec2 audio fingerprinting, and Polygon smart contracts to detect deepfakes and generate court-admissible audit certificates.
          </p>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('scanner')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm flex items-center space-x-2 shadow-xl shadow-cyan-500/25 transform hover:scale-105 transition"
            >
              <Cpu className="w-5 h-5" />
              <span>Start Multi-Modal Scan</span>
            </button>

            <button
              onClick={() => setActiveTab('verifier')}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm flex items-center space-x-2 transition"
            >
              <QrCode className="w-5 h-5 text-cyan-400" />
              <span>Verify SHA-256 Hash</span>
            </button>
          </div>
        </div>

        {/* Decorative Floating Cyber Shield Badge */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2">
          <div className="relative w-72 h-72 rounded-full border border-cyan-500/20 bg-slate-950/60 p-6 flex flex-col items-center justify-center animate-radar glow-cyan">
            <Shield className="w-24 h-24 text-cyan-400 mb-2" />
            <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">NEUROSHIELD v2.4</span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>LIVE AI ENGINE RUNNING</span>
            </span>
          </div>
        </div>

      </div>

      {/* Network & Forensic Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-medium block">Total Verified Media</span>
          <div className="text-3xl font-extrabold text-white font-mono">1,425</div>
          <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Polygon On-Chain Recorded</span>
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-medium block">Avg Detection Latency</span>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono">1.8s</div>
          <span className="text-[10px] text-slate-400">GPU Accelerated TensorRT</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-medium block">Deepfake Precision Score</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">98.4%</div>
          <span className="text-[10px] text-slate-400">Benchmark Evaluated</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-medium block">Supported Formats</span>
          <div className="text-xl font-extrabold text-white mt-1">Image, Vid, Aud, Doc</div>
          <span className="text-[10px] text-purple-400 font-mono">Multi-Modal Pipeline</span>
        </div>

      </div>

      {/* 4 Core Modalities Grid Card */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Multi-Modal Deepfake Detection Engines</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Image */}
          <div 
            onClick={() => setActiveTab('scanner')}
            className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 cursor-pointer glass-panel-hover group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Deepfake Image Detection</h3>
              <p className="text-xs text-slate-400 mt-1">
                Detects GAN-generated faces, Photoshop edits, ELA frequency anomalies, and corneal reflections.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-cyan-400 flex items-center space-x-1">
              <span>Launch Image Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Video */}
          <div 
            onClick={() => setActiveTab('scanner')}
            className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 cursor-pointer glass-panel-hover group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Video Authenticity</h3>
              <p className="text-xs text-slate-400 mt-1">
                Frame-level temporal consistency checks, facial boundary jitter, and audio-visual lip desync.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-blue-400 flex items-center space-x-1">
              <span>Launch Video Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Voice */}
          <div 
            onClick={() => setActiveTab('scanner')}
            className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 cursor-pointer glass-panel-hover group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Voice Clone Detection</h3>
              <p className="text-xs text-slate-400 mt-1">
                Identifies ElevenLabs & Bark AI speech synthesis using Wav2Vec2 Mel-spectrogram phase analysis.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-1">
              <span>Launch Voice Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Document */}
          <div 
            onClick={() => setActiveTab('scanner')}
            className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 cursor-pointer glass-panel-hover group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Document Verification</h3>
              <p className="text-xs text-slate-400 mt-1">
                OCR font subsetting analysis, EXIF timestamp diffs, and PKCS#7 digital signature validation.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-purple-400 flex items-center space-x-1">
              <span>Launch Document Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </div>

      {/* Recent Forensic Scan Log */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Recent Evidence Verification Feed</span>
            </h2>
            <p className="text-xs text-slate-400">Click any sample to view Grad-CAM heatmaps or generate court audit certificates</p>
          </div>

          <button
            onClick={() => setActiveTab('datasets')}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 flex items-center space-x-1"
          >
            <span>View All Benchmarks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_DATASETS.slice(0, 4).map((sample) => (
            <div 
              key={sample.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between space-x-4 hover:border-cyan-500/40 transition"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <img src={sample.previewUrl} alt="Thumb" className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-slate-800" />
                <div className="overflow-hidden">
                  <h4 className="font-bold text-white text-xs truncate">{sample.title}</h4>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{sample.type.toUpperCase()} • {sample.datasetName}</div>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sample.authenticityScore >= 60 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                    }`}>
                      {sample.authenticityScore}% Score ({sample.verdict})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-1.5 flex-shrink-0">
                <button
                  onClick={() => onOpenXai(sample)}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 text-cyan-400 text-[10px] font-semibold flex items-center space-x-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>XAI Heatmap</span>
                </button>
                <button
                  onClick={() => onSelectSample(sample)}
                  className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 text-[10px] font-bold flex items-center space-x-1"
                >
                  <FileCheck className="w-3 h-3" />
                  <span>Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
