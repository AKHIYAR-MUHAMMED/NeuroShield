'use me';
'use client';

import React, { useState } from 'react';
import { Mic, Activity, ShieldAlert, ShieldCheck, Cpu, RefreshCw } from 'lucide-react';
import { VoiceprintBiometricsResult, analyzeVoiceprintBiometrics } from '../../utils/voiceprintBiometrics';

export function VoiceprintAnalysisPanel() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<VoiceprintBiometricsResult | null>(null);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      // Simulate live sample contour
      const samplePitch = Array.from({ length: 12 }, () => 120 + Math.random() * 8);
      const sampleAmp = Array.from({ length: 10 }, () => 0.3 + Math.random() * 0.2);
      const res = analyzeVoiceprintBiometrics(samplePitch, sampleAmp);
      setMetrics(res);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Voiceprint Acoustic Biometrics</h3>
            <p className="text-xs text-slate-400">Micro-jitter, shimmer & vocal tract formant resonance scanner</p>
          </div>
        </div>

        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50"
        >
          {isAnalyzing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Activity className="w-3.5 h-3.5" />
          )}
          {isAnalyzing ? 'Scanning...' : 'Scan Voiceprint'}
        </button>
      </div>

      {metrics ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Pitch Jitter</span>
              <p className="text-base font-bold text-slate-200 mt-1">{metrics.pitchJitterPercent}%</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Amplitude Shimmer</span>
              <p className="text-base font-bold text-slate-200 mt-1">{metrics.amplitudeShimmerDb} dB</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Stability Index</span>
              <p className="text-base font-bold text-emerald-400 mt-1">{metrics.vocalStabilityIndex}</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <span className="text-[11px] text-slate-400 uppercase font-medium">Formants (F1/F2/F3)</span>
              <p className="text-xs font-bold text-cyan-400 mt-1.5">{metrics.formantResonanceHz.join(' / ')} Hz</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2">
              {metrics.verdict === 'SYNTHETIC_DEEPFAKE' ? (
                <ShieldAlert className="w-5 h-5 text-rose-400" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              )}
              <div>
                <p className="text-xs font-semibold text-slate-200">Biometric Verdict: {metrics.verdict}</p>
                <p className="text-[11px] text-slate-400">Synthetic probability rating: {(metrics.syntheticProbability * 100).toFixed(0)}%</p>
              </div>
            </div>
            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Coherence: {metrics.phaseCoherenceScore}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-slate-500 text-xs flex flex-col items-center gap-2">
          <Cpu className="w-8 h-8 opacity-40 text-emerald-400" />
          <span>Click &quot;Scan Voiceprint&quot; to calculate vocal tract resonance and acoustic micro-jitter.</span>
        </div>
      )}
    </div>
  );
}
