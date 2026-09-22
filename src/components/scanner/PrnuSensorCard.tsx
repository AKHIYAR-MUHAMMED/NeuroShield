'use client';

import React from 'react';
import { Camera, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { PrnuAnalysisResult } from '@/utils/prnuExtractor';

interface PrnuSensorCardProps {
  prnuResult?: PrnuAnalysisResult;
}

export const PrnuSensorCard: React.FC<PrnuSensorCardProps> = ({ prnuResult }) => {
  const result = prnuResult || {
    sensorCorrelationScore: 0.88,
    hasValidCmosPattern: true,
    estimatedSensorModel: 'Canon EOS Hardware CMOS Sensor',
    noiseVariance: 0.245,
    verdict: 'VALID_HARDWARE_SENSOR',
  };

  return (
    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="font-bold text-white flex items-center space-x-2">
          <Camera className="w-4 h-4 text-cyan-400" />
          <span>PRNU Sensor Noise Fingerprint</span>
        </h4>
        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
          result.hasValidCmosPattern ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
        }`}>
          {result.verdict.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono">
        <div>
          <span className="text-slate-500 text-[10px] block">Sensor Correlation:</span>
          <span className="text-cyan-400 font-bold">{(result.sensorCorrelationScore * 100).toFixed(1)}%</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">CMOS Noise Variance:</span>
          <span className="text-purple-400 font-bold">{result.noiseVariance}</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400">
        Estimated Hardware Origin: <strong className="text-slate-200">{result.estimatedSensorModel}</strong>
      </p>
    </div>
  );
};
