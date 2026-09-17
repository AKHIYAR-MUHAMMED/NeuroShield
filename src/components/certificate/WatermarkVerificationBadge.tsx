'use me';
'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Award, FileCheck } from 'lucide-react';
import { WatermarkVerificationResult } from '../../utils/mediaWatermarkVerifier';

interface WatermarkVerificationBadgeProps {
  result: WatermarkVerificationResult;
}

export function WatermarkVerificationBadge({ result }: WatermarkVerificationBadgeProps) {
  const isOk = !result.tamperDetected && result.integrityScore >= 0.8;

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md transition-all ${
      isOk
        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
        : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${isOk ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {isOk ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-100">
                {isOk ? 'Watermark Integrity Verified' : 'Steganographic Tampering Detected'}
              </h4>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {result.watermarkType}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{result.details}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block uppercase font-medium">Integrity Score</span>
          <span className={`text-base font-bold font-mono ${isOk ? 'text-emerald-400' : 'text-rose-400'}`}>
            {(result.integrityScore * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {result.tamperLocationsCount > 0 && (
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-rose-400">
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            Anomalous regions identified: {result.tamperLocationsCount} spatial blocks
          </span>
          <span className="font-mono text-[11px] text-slate-400">ISO 27037 Sec 8.4</span>
        </div>
      )}
    </div>
  );
}
