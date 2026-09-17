'use me';
'use client';

import React from 'react';
import { Eye, ShieldAlert, CheckCircle } from 'lucide-react';
import { ElaAnalysisResult } from '../../utils/elaDetector';

interface ElaViewerCardProps {
  result: ElaAnalysisResult;
}

export function ElaViewerCard({ result }: ElaViewerCardProps) {
  const isOk = !result.hasRecompressionArtifacts;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100">Error Level Analysis (ELA)</h4>
            <p className="text-xs text-slate-400">JPEG re-compression error distribution grid</p>
          </div>
        </div>

        {isOk ? (
          <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <CheckCircle className="w-4 h-4" /> Uniform
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-rose-400 font-medium">
            <ShieldAlert className="w-4 h-4" /> Spliced
          </span>
        )}
      </div>

      <div className="grid grid-cols-8 gap-1 p-2 rounded-lg bg-slate-950 border border-slate-800 my-3">
        {result.elaHighlightGrid.flatMap((row, rIdx) =>
          row.map((val, cIdx) => {
            const isHigh = val > 40;
            return (
              <div
                key={`${rIdx}-${cIdx}`}
                title={`Error Level: ${val}`}
                className={`h-5 rounded-sm flex items-center justify-center text-[9px] font-mono transition-colors ${
                  isHigh
                    ? 'bg-rose-500 text-white font-bold animate-pulse'
                    : 'bg-purple-950/40 text-purple-300 border border-purple-900/30'
                }`}
              >
                {Math.round(val)}
              </div>
            );
          })
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 font-mono mt-2">
        <span>Max Delta: {result.maxErrorDelta}</span>
        <span>Mean Level: {result.meanErrorLevel}</span>
        <span>Anomalies: {result.anomalousRegionCount}</span>
      </div>
    </div>
  );
}
