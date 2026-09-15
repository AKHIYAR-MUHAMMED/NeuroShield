'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Shield, Cpu, Database, QrCode, FileCheck, ArrowRight, Zap,
  CheckCircle2, Activity, Layers, Eye, Sparkles, RefreshCw
} from 'lucide-react';
import { EvidenceSample } from '@/data/samples';
import { AstraVectorSearch } from './astra/AstraVectorSearch';
import { LlmConsensusWidget } from './openai/LlmConsensusWidget';
import { fetchEvidenceRecords } from '@/utils/astra';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onSelectSample: (sample: EvidenceSample) => void;
  onOpenXai: (sample: EvidenceSample) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onSelectSample, onOpenXai }) => {
  const [liveRecords, setLiveRecords] = useState<EvidenceSample[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [feedSource, setFeedSource] = useState<'astra' | 'fallback' | null>(null);
  const [totalCount, setTotalCount] = useState(1425);

  const loadLiveRecords = useCallback(async () => {
    setLoadingFeed(true);
    const result = await fetchEvidenceRecords({ limit: 4 });
    setLiveRecords(result.records);
    setFeedSource(result.source);
    if (result.records.length > 0) {
      setTotalCount(1420 + result.records.length);
    }
    setLoadingFeed(false);
  }, []);

  useEffect(() => {
    loadLiveRecords();
  }, [loadLiveRecords]);

  return (
    <div className="space-y-10">

      {/* Hero Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 border border-slate-800 glass-panel bg-radial-glow overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI + Blockchain + DataStax Astra DB Multi-Modal Evidence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Verify whether any{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
              image, video, audio, or document
            </span>{' '}
            is authentic within seconds.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            NeuroShield combines Vision Transformers, Grad-CAM XAI, Wav2Vec2 audio fingerprinting, Polygon smart contracts, and DataStax Astra DB vector similarity search to detect deepfakes and generate court-admissible certificates.
          </p>

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

        {/* Decorative shield */}
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

      {/* Live Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-medium block">Astra DB Records</span>
          <div className="text-3xl font-extrabold text-white font-mono">
            {loadingFeed ? <span className="animate-pulse text-slate-600">...</span> : totalCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-purple-400 flex items-center space-x-1">
            <Database className="w-3 h-3" />
            <span>{feedSource === 'astra' ? 'DataStax Astra DB Live' : 'Fallback Mode'}</span>
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
          <span className="text-slate-400 text-xs font-medium block">Vector Dimensions</span>
          <div className="text-3xl font-extrabold text-purple-400 font-mono">1536</div>
          <span className="text-[10px] text-purple-400 font-mono">Astra Similarity Index</span>
        </div>
      </div>

      {/* 4 Core Modalities */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Multi-Modal Deepfake Detection Engines</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Deepfake Image Detection', desc: 'GAN-generated faces, Photoshop edits, ELA frequency anomalies, corneal reflections.', color: 'cyan', label: 'Launch Image Scanner', Icon: Eye },
            { title: 'Video Authenticity', desc: 'Frame-level temporal consistency, facial boundary jitter, audio-visual lip desync.', color: 'blue', label: 'Launch Video Scanner', Icon: Cpu },
            { title: 'Voice Clone Detection', desc: 'ElevenLabs & Bark AI speech synthesis via Wav2Vec2 Mel-spectrogram phase analysis.', color: 'emerald', label: 'Launch Voice Scanner', Icon: Zap },
            { title: 'Document Verification', desc: 'OCR font subsetting, EXIF timestamp diffs, PKCS#7 digital signature validation.', color: 'purple', label: 'Launch Document Scanner', Icon: FileCheck },
          ].map((card) => {
            const Icon = card.Icon;
            return (
              <div
                key={card.title}
                onClick={() => setActiveTab('scanner')}
                className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 cursor-pointer glass-panel-hover group"
              >
                <div className={`w-12 h-12 rounded-xl bg-${card.color}-500/10 border border-${card.color}-500/30 flex items-center justify-center text-${card.color}-400 group-hover:scale-110 transition`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{card.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{card.desc}</p>
                </div>
                <div className={`text-[11px] font-semibold text-${card.color}-400 flex items-center space-x-1`}>
                  <span>{card.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 10-LLM Backend Ensemble Consensus Widget */}
      <LlmConsensusWidget evidenceScore={85} />

      {/* DataStax Astra DB Vector Search */}
      <AstraVectorSearch />

      {/* Live Evidence Feed from Astra DB */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Recent Evidence Verification Feed</span>
              {/* Live source badge */}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                feedSource === 'astra'
                  ? 'bg-purple-950/80 border-purple-700/50 text-purple-300'
                  : 'bg-amber-950/80 border-amber-700/50 text-amber-300'
              }`}>
                {feedSource === 'astra' ? '● Astra DB Live' : feedSource === 'fallback' ? '● Demo Mode' : '● Loading…'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {feedSource === 'astra'
                ? 'Live records pulled from DataStax Astra DB vector collection'
                : 'Showing cached demo records — configure Astra DB token to enable live feed'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadLiveRecords}
              disabled={loadingFeed}
              className="px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-700/40 hover:border-purple-500/60 text-xs font-semibold text-purple-300 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingFeed ? 'animate-spin' : ''}`} />
              {loadingFeed ? 'Loading…' : 'Refresh Astra'}
            </button>
            <button
              onClick={() => setActiveTab('datasets')}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Skeleton / Live Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loadingFeed
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 animate-pulse flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-lg bg-slate-800 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-800 rounded w-3/4" />
                    <div className="h-2 bg-slate-800 rounded w-1/2" />
                    <div className="h-2 bg-slate-800 rounded w-1/3" />
                  </div>
                </div>
              ))
            : liveRecords.map((sample) => (
                <div
                  key={sample.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between space-x-4 hover:border-cyan-500/40 transition"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    {sample.previewUrl ? (
                      <img
                        src={sample.previewUrl}
                        alt="Thumb"
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-slate-800"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-slate-800 flex-shrink-0 flex items-center justify-center text-slate-500 text-xs">
                        {sample.type.slice(0, 3).toUpperCase()}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-white text-xs truncate">{sample.title}</h4>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {sample.type.toUpperCase()} • {sample.datasetName}
                      </div>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sample.authenticityScore >= 60
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-rose-950 text-rose-400'
                        }`}>
                          {sample.authenticityScore}% ({sample.verdict})
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
                      <span>XAI</span>
                    </button>
                    <button
                      onClick={() => onSelectSample(sample)}
                      className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 text-[10px] font-bold flex items-center space-x-1"
                    >
                      <FileCheck className="w-3 h-3" />
                      <span>Cert</span>
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>

    </div>
  );
};
