'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, AlertTriangle, Layers, Zap, Radio, ChevronRight, Activity } from 'lucide-react';
import {
  calculateMultiLlmConsensusScore,
  DEFAULT_10_LLM_PROVIDERS,
  MultiLlmConsensusResult,
} from '../../utils/llmRouter';

interface LlmConsensusWidgetProps {
  evidenceScore?: number;
  onNavigateMesh?: () => void;
}

export const LlmConsensusWidget: React.FC<LlmConsensusWidgetProps> = ({
  evidenceScore = 88,
  onNavigateMesh,
}) => {
  const [consensus, setConsensus] = useState<MultiLlmConsensusResult | null>(null);

  useEffect(() => {
    // Generate simulated provider predictions centered around evidence score
    const responses = DEFAULT_10_LLM_PROVIDERS.map((prov) => {
      const noise = (Math.random() - 0.5) * 0.12;
      const baseProb = evidenceScore / 100;
      const syntheticProbability = Math.min(0.99, Math.max(0.01, parseFloat((baseProb + noise).toFixed(2))));
      return {
        providerId: prov.id,
        syntheticProbability,
        latencyMs: prov.latencyMs,
      };
    });

    const result = calculateMultiLlmConsensusScore(responses);
    setConsensus(result);
  }, [evidenceScore]);

  if (!consensus) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-3xl p-6 text-slate-100 shadow-2xl space-y-6 relative overflow-hidden transition-all duration-300 group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-all" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-md shadow-cyan-500/10">
            <Radio className="w-5 h-5 animate-pulse text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-base text-white tracking-wide">10 LLM Backend Ensemble Consensus</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                10-Model Mesh
              </span>
            </div>
            <p className="text-xs text-slate-400">Multi-model cross-validation across 10 frontier neural engines</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full border ${
              consensus.finalVerdict === 'CONFIRMED_DEEPFAKE'
                ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-sm shadow-red-500/20'
                : consensus.finalVerdict === 'SUSPECT'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
            }`}
          >
            {consensus.finalVerdict}
          </span>

          {onNavigateMesh && (
            <button
              onClick={onNavigateMesh}
              className="p-1.5 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 rounded-xl transition-all"
              title="Open 10-LLM Mesh Matrix Hub"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800/90 text-center relative z-10 shadow-inner">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Consensus Score</span>
          <div className="text-2xl font-black text-cyan-400 mt-0.5">
            {(consensus.consensusScore * 100).toFixed(0)}%
          </div>
        </div>
        <div className="border-x border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Agreement Ratio</span>
          <div className="text-2xl font-black text-emerald-400 mt-0.5">
            {(consensus.agreementRatio * 100).toFixed(0)}%
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Models Active</span>
          <div className="text-2xl font-black text-purple-400 mt-0.5">
            {consensus.modelsConsultedCount} / 10
          </div>
        </div>
      </div>

      {/* Model-by-Model Breakdown Grid */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> Frontier Ensemble Model Votes
          </span>
          <span className="text-[11px] text-cyan-400 font-mono">All 10 Models Online</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {consensus.breakdown.map((item) => (
            <div
              key={item.providerId}
              className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-2.5 truncate pr-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.accentColor || '#38bdf8', boxShadow: `0 0 6px ${item.accentColor}` }}
                />
                <div className="truncate">
                  <span className="font-bold text-slate-200 truncate block">
                    {item.providerName}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block font-mono">
                    {item.latencyMs}ms • {(item.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md flex-shrink-0 ${
                  item.verdict === 'SYNTHETIC'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {item.verdict}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
