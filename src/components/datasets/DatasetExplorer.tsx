'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Layers, Database, ArrowRight, RefreshCw, Zap, Wifi, WifiOff } from 'lucide-react';
import { EvidenceSample } from '@/data/samples';
import { fetchEvidenceRecords } from '@/utils/astra';

interface DatasetExplorerProps {
  onSelectSample: (sample: EvidenceSample) => void;
  onOpenXai: (sample: EvidenceSample) => void;
}

type FilterType = 'all' | 'image' | 'video' | 'audio' | 'document';

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({ onSelectSample, onOpenXai }) => {
  const [samples, setSamples] = useState<EvidenceSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [dataSource, setDataSource] = useState<'astra' | 'fallback' | null>(null);

  const loadSamples = useCallback(async () => {
    setLoading(true);
    const result = await fetchEvidenceRecords({
      type: filter !== 'all' ? filter : undefined,
      limit: 30,
    });
    setSamples(result.records);
    setDataSource(result.source);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    loadSamples();
  }, [loadSamples]);

  const filters: { id: FilterType; label: string; color: string }[] = [
    { id: 'all', label: 'All Types', color: 'cyan' },
    { id: 'image', label: 'Images', color: 'blue' },
    { id: 'video', label: 'Videos', color: 'purple' },
    { id: 'audio', label: 'Audio', color: 'emerald' },
    { id: 'document', label: 'Documents', color: 'amber' },
  ];

  return (
    <div className="space-y-8">

      {/* Hero Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-wide">
                Academic & Forensic Benchmark Datasets
              </h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                {dataSource === 'astra' ? (
                  <><Wifi className="w-3.5 h-3.5 text-purple-400" /><span className="text-purple-400">Live records from DataStax Astra DB vector collection</span></>
                ) : (
                  <><WifiOff className="w-3.5 h-3.5 text-amber-400" /><span className="text-amber-400">Demo records — configure Astra DB token for live feed</span></>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={loadSamples}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-purple-950/60 border border-purple-700/40 hover:border-purple-500/60 text-purple-300 text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Astra
          </button>
        </div>

        {/* Dataset badges */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 text-xs">
          {[
            { label: 'FaceForensics++', sub: '1,000+ Forged Sequences', color: 'text-cyan-400' },
            { label: 'Celeb-DF v2', sub: 'High-Quality Deepfakes', color: 'text-blue-400' },
            { label: 'DFDC Challenge', sub: 'Kaggle Benchmark', color: 'text-purple-400' },
            { label: 'ASVspoof 2024', sub: 'Audio Synthetic Voices', color: 'text-emerald-400' },
            { label: 'DocTamper', sub: 'Document OCR Tampering', color: 'text-amber-400' },
          ].map((d) => (
            <div key={d.label} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className={`font-bold block ${d.color}`}>{d.label}</span>
              <span className="text-[10px] text-slate-400">{d.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f.id
                ? 'bg-purple-600 border-purple-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500 font-mono">
          {loading ? 'Loading…' : `${samples.length} records`}
        </span>
      </div>

      {/* Dataset Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-panel rounded-2xl border border-slate-800 overflow-hidden animate-pulse">
                <div className="aspect-video bg-slate-800" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-full" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
              </div>
            ))
          : samples.map((sample) => (
              <div
                key={sample.id}
                className="glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between glass-panel-hover"
              >
                <div>
                  {/* Media Preview */}
                  <div className="relative aspect-video bg-slate-950 border-b border-slate-800 overflow-hidden group">
                    {sample.previewUrl ? (
                      <img
                        src={sample.previewUrl}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-3xl font-bold">
                        {sample.type.slice(0, 3).toUpperCase()}
                      </div>
                    )}

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

                  {/* Card Info */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-white text-base leading-snug">{sample.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {sample.evidencePoints?.[0]?.description || 'Forensic analysis completed.'}
                    </p>
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>SHA-256: {sample.sha256Hash.substring(0, 10)}...</span>
                      <span>Block #{sample.blockNumber}</span>
                    </div>
                    {/* Astra source badge */}
                    {dataSource && (
                      <div className={`flex items-center gap-1 text-[10px] font-semibold ${
                        dataSource === 'astra' ? 'text-purple-400' : 'text-amber-400'
                      }`}>
                        <Database className="w-3 h-3" />
                        {dataSource === 'astra' ? 'Astra DB' : 'Demo Cache'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
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
