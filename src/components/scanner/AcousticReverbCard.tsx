'use me';
'use client';

import React from 'react';
import { Volume2, AlertCircle, CheckCircle } from 'lucide-react';
import { ReverbAnalysisResult } from '../../utils/reverbAnalyzer';

interface AcousticReverbCardProps {
  result: ReverbAnalysisResult;
}

export function AcousticReverbCard({ result }: AcousticReverbCardProps) {
  const isOk = !result.backgroundDiscontinuityDetected;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isOk ? 'bg-cyan-500/10 text-cyan-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Acoustic Room Reverberation</h4>
            <p className="text-xs text-slate-400">Background noise floor & splice detection</p>
          </div>
        </div>
        {isOk ? (
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-400" />
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-medium">Noise Floor</span>
          <span className="text-xs font-bold text-slate-200 mt-1 block">{result.noiseFloorDb} dB</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-medium">Reverb Tail</span>
          <span className="text-xs font-bold text-cyan-400 mt-1 block">{result.reverbTailMs} ms</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-medium">Splice Count</span>
          <span className="text-xs font-bold text-slate-200 mt-1 block">{result.spliceLocationsCount}</span>
        </div>
      </div>
    </div>
  );
}
