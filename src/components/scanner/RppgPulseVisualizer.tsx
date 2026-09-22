'use client';

import React from 'react';
import { Activity, Heart, AlertCircle } from 'lucide-react';
import { RppgPulseResult } from '@/utils/rppgPulseEstimator';

interface RppgPulseVisualizerProps {
  rppgResult?: RppgPulseResult;
}

export const RppgPulseVisualizer: React.FC<RppgPulseVisualizerProps> = ({ rppgResult }) => {
  const result = rppgResult || {
    estimatedBpm: 74,
    pulseSignalWave: [0.2, 0.8, 1.4, 0.9, -0.4, -1.2, -0.5, 0.4, 1.1, 0.8, -0.3, -1.0],
    signalToNoiseRatioDb: 14.8,
    isLiveHumanPulse: true,
    verdict: 'LIVE_HUMAN_CAPILLARY_PULSE',
  };

  return (
    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="font-bold text-white flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Subcutaneous Biological Pulse (rPPG)</span>
        </h4>
        <div className="flex items-center space-x-1 font-mono text-emerald-400">
          <Heart className="w-3.5 h-3.5 animate-pulse text-rose-500" />
          <span className="font-extrabold">{result.estimatedBpm} BPM</span>
        </div>
      </div>

      <div className="flex items-end justify-between h-14 bg-slate-900/60 p-2 rounded-xl border border-slate-800 space-x-1">
        {result.pulseSignalWave.map((val, idx) => {
          const heightPct = Math.min(100, Math.max(10, ((val + 2) / 4) * 100));
          return (
            <div
              key={idx}
              className="flex-1 bg-gradient-to-t from-emerald-600 to-cyan-400 rounded-t transition-all duration-300"
              style={{ height: `${heightPct}%` }}
              title={`Sample #${idx}: ${val}`}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>SNR: {result.signalToNoiseRatioDb} dB</span>
        <span className={result.isLiveHumanPulse ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
          {result.verdict.replace(/_/g, ' ')}
        </span>
      </div>
    </div>
  );
};
