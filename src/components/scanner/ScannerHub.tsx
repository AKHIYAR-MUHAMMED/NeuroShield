'use client';

import React, { useState } from 'react';
import { Eye, Video, Mic, FileText, Cpu, Zap, Activity, Layers } from 'lucide-react';
import { ImageScanner } from './ImageScanner';
import { VideoScanner } from './VideoScanner';
import { AudioScanner } from './AudioScanner';
import { DocumentScanner } from './DocumentScanner';
import { AudioSpectrumVisualizer } from './AudioSpectrumVisualizer';
import { BatchEvidenceUploader } from './BatchEvidenceUploader';
import { EvidenceSample } from '@/data/samples';

type ScanMode = 'image' | 'video' | 'audio' | 'document' | 'spectrum' | 'batch';

interface ScannerHubProps {
  onAnalysisComplete: (result: EvidenceSample) => void;
  onOpenXai: (sample: EvidenceSample) => void;
}

export const ScannerHub: React.FC<ScannerHubProps> = ({ onAnalysisComplete, onOpenXai }) => {
  const [activeMode, setActiveMode] = useState<ScanMode>('image');

  const tabs: { id: ScanMode; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: 'image', label: 'Image Deepfake', icon: Eye, desc: 'GAN, ELA, Facial Mesh' },
    { id: 'video', label: 'Video Authenticity', icon: Video, desc: 'Temporal flow, keyframe scrubber' },
    { id: 'audio', label: 'Voice Clone Detection', icon: Mic, desc: 'Wav2Vec2, Mel-spectrogram' },
    { id: 'document', label: 'Document Tamper OCR', icon: FileText, desc: 'Font subsetting, PKCS#7 signature' },
    { id: 'spectrum', label: 'Audio FFT Spectrum', icon: Activity, desc: '20Hz-20kHz harmonic breakdown' },
    { id: 'batch', label: 'Batch Merkle Hasher', icon: Layers, desc: 'Multi-file evidence Merkle root' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Multi-Modal AI Forensic Scanner</h2>
            <p className="text-xs text-slate-400">
              Select media type to run multi-stage neural network feature attribution & deepfake analysis
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800 text-cyan-400">
          <Zap className="w-3.5 h-3.5" />
          <span>PyTorch Ensemble Active</span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-xl ${isActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`font-bold text-xs ${isActive ? 'text-cyan-400' : 'text-slate-200'}`}>
                  {tab.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 truncate">
                {tab.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Scanner View */}
      <div className="animate-fadeIn">
        {activeMode === 'image' && <ImageScanner onAnalysisComplete={onAnalysisComplete} onOpenXai={onOpenXai} />}
        {activeMode === 'video' && <VideoScanner onAnalysisComplete={onAnalysisComplete} />}
        {activeMode === 'audio' && <AudioScanner onAnalysisComplete={onAnalysisComplete} />}
        {activeMode === 'document' && <DocumentScanner onAnalysisComplete={onAnalysisComplete} />}
        {activeMode === 'spectrum' && <AudioSpectrumVisualizer autoSimulate={true} />}
        {activeMode === 'batch' && <BatchEvidenceUploader />}
      </div>

    </div>
  );
};
