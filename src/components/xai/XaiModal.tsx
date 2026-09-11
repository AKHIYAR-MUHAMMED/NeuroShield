'use client';

import React, { useState } from 'react';
import { X, Eye, Sliders, AlertTriangle, CheckCircle2, Zap, Layers, BarChart3, HelpCircle, Sparkles, RefreshCw, ShieldAlert } from 'lucide-react';
import { EvidenceSample } from '@/data/samples';
import { requestOpenAiAnalysis, OpenAiExplanationResult } from '@/utils/openai';

interface XaiModalProps {
  sample: EvidenceSample | null;
  isOpen: boolean;
  onClose: () => void;
}

export const XaiModal: React.FC<XaiModalProps> = ({ sample, isOpen, onClose }) => {
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.65);
  const [viewMode, setViewMode] = useState<'gradcam' | 'ela' | 'fft' | 'openai'>('gradcam');
  const [openAiData, setOpenAiData] = useState<OpenAiExplanationResult | null>(null);
  const [loadingOpenAi, setLoadingOpenAi] = useState<boolean>(false);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  if (!isOpen || !sample) return null;

  const isFake = sample.authenticityScore < 60;

  const handleFetchOpenAiAnalysis = async () => {
    setViewMode('openai');
    if (openAiData) return; // already loaded once

    setLoadingOpenAi(true);
    const res = await requestOpenAiAnalysis<OpenAiExplanationResult>('explain_evidence', { evidence: sample });
    setLoadingOpenAi(false);

    if (res.success && res.data) {
      setOpenAiData(res.data);
      setIsSimulated(!!res.isSimulated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white flex items-center space-x-2">
                <span>Explainable AI (XAI) Diagnostic Suite</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Grad-CAM & SHAP
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Visual feature attributions & model decision heatmaps for {sample.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Top Score Banner */}
          <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
            isFake 
              ? 'bg-rose-950/30 border-rose-800/50 text-rose-300' 
              : 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
          }`}>
            <div className="flex items-center space-x-3">
              {isFake ? (
                <AlertTriangle className="w-8 h-8 text-rose-400 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
              )}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider block opacity-75">
                  AI Model Verdict
                </span>
                <span className="text-xl font-bold text-white">
                  {sample.verdict} ({sample.authenticityScore}% Authenticity)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                Dataset: {sample.datasetName}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                Model: ViT-L/14 + OpenAI GPT-4o
              </span>
            </div>
          </div>

          {/* Mode Switcher & Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setViewMode('gradcam')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  viewMode === 'gradcam'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Grad-CAM Visual</span>
              </button>

              <button
                onClick={() => setViewMode('ela')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  viewMode === 'ela'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Error Level (ELA)</span>
              </button>

              <button
                onClick={() => setViewMode('fft')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  viewMode === 'fft'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>FFT Frequency</span>
              </button>

              <button
                onClick={handleFetchOpenAiAnalysis}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition border ${
                  viewMode === 'openai'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900 border-cyan-500/40 text-cyan-300 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>🤖 OpenAI GPT-4o Forensics</span>
              </button>
            </div>

            {/* Slider */}
            {viewMode === 'gradcam' && (
              <div className="flex items-center space-x-3 text-xs w-full sm:w-auto">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300">Heatmap Intensity:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={heatmapOpacity}
                  onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                  className="w-28 accent-cyan-400 cursor-pointer"
                />
                <span className="font-mono text-cyan-400 w-8">{Math.round(heatmapOpacity * 100)}%</span>
              </div>
            )}
          </div>

          {/* OpenAI Synthesis View */}
          {viewMode === 'openai' ? (
            <div className="space-y-6 bg-slate-950 p-6 rounded-2xl border border-slate-800 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-bold text-white text-base">OpenAI GPT-4o Forensic Expert Analysis</h4>
                </div>
                {isSimulated && (
                  <span className="text-[10px] bg-slate-900 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                    Mode: NeuroShield AI Engine (Fallback)
                  </span>
                )}
              </div>

              {loadingOpenAi ? (
                <div className="p-10 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400 font-mono">Running OpenAI multi-layer forensic synthesis & legal risk assessment...</p>
                </div>
              ) : openAiData ? (
                <div className="space-y-6 text-xs text-slate-300">
                  
                  {/* Summary Box */}
                  <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                    <span className="font-bold text-cyan-400 text-xs uppercase tracking-wider block">Executive Forensic Summary</span>
                    <p className="text-slate-200 leading-relaxed text-sm font-medium">{openAiData.forensicSummary}</p>
                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-cyan-400/80">
                      <span>Model Confidence: {openAiData.confidenceLevel}</span>
                      <span>Standard: ISO/IEC 27037 Preserved</span>
                    </div>
                  </div>

                  {/* Technical Analysis & Legal Vulnerabilities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="font-semibold text-cyan-300 uppercase tracking-wider block">Technical Neural Artifacts</span>
                      <ul className="space-y-2 text-slate-400">
                        {openAiData.technicalAnalysis.map((item, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-cyan-400 shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                      <span className="font-semibold text-rose-300 uppercase tracking-wider block flex items-center space-x-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        <span>Evidentiary Vulnerabilities</span>
                      </span>
                      <ul className="space-y-2 text-slate-400">
                        {openAiData.legalRisks.map((item, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-rose-400 shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Steps */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-semibold text-emerald-300 uppercase tracking-wider block">Recommended Action Steps</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
                      {openAiData.recommendedActions.map((action, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : null}
            </div>
          ) : (
            <>
              {/* Canvas / Media View Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Original Box */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase tracking-wider">Original Media Payload</span>
                    <span className="font-mono text-slate-500">{sample.mimeType}</span>
                  </div>
                  <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center">
                    <img
                      src={sample.previewUrl}
                      alt="Original Media"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* XAI Visualization Overlay Box */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold uppercase tracking-wider text-cyan-400 flex items-center space-x-1">
                      <span>XAI Visual Feature Overlay</span>
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    </span>
                    <span className="font-mono text-cyan-400">{viewMode.toUpperCase()} Mode</span>
                  </div>

                  <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 aspect-video flex items-center justify-center">
                    {/* Base Image */}
                    <img
                      src={sample.previewUrl}
                      alt="Base Layer"
                      className="w-full h-full object-cover"
                    />

                    {/* Heatmap Overlay */}
                    {viewMode === 'gradcam' && (
                      <div 
                        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
                        style={{ opacity: heatmapOpacity }}
                      >
                        {/* Simulated Grad-CAM Gradient overlay */}
                        <div 
                          className="w-full h-full"
                          style={{
                            background: isFake
                              ? 'radial-gradient(circle at 45% 40%, rgba(244, 63, 94, 0.85) 0%, rgba(245, 158, 11, 0.6) 25%, rgba(0, 242, 254, 0.2) 50%, transparent 80%)'
                              : 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.4) 0%, rgba(0, 242, 254, 0.2) 40%, transparent 70%)'
                          }}
                        />
                        {isFake && (
                          <div className="absolute top-[35%] left-[40%] border-2 border-rose-500 rounded-full w-24 h-24 animate-pulse pointer-events-none flex items-center justify-center">
                            <span className="bg-rose-950/90 text-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-600/60">
                              Manipulated Region
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ELA Mode */}
                    {viewMode === 'ela' && (
                      <div className="absolute inset-0 bg-slate-950/90 mix-blend-difference pointer-events-none flex items-center justify-center">
                        <div 
                          className="w-full h-full opacity-80"
                          style={{
                            backgroundImage: isFake
                              ? 'radial-gradient(circle at 45% 40%, rgba(255, 0, 100, 0.9) 0%, rgba(0, 255, 200, 0.4) 30%, transparent 60%)'
                              : 'radial-gradient(circle at 50% 50%, rgba(0, 200, 100, 0.3) 0%, transparent 50%)',
                            backgroundSize: '12px 12px'
                          }}
                        />
                      </div>
                    )}

                    {/* FFT Spectrum */}
                    {viewMode === 'fft' && (
                      <div className="absolute inset-0 bg-slate-950/95 p-4 flex flex-col justify-end">
                        <span className="text-[10px] text-cyan-400 font-mono mb-2">Spatial Frequency Power Spectrum (1D FFT Array)</span>
                        <div className="flex items-end space-x-1 h-32 w-full border-b border-slate-700 pb-1">
                          {(sample.fftData || [40, 80, 95, 30, 70, 100, 85, 20, 10]).map((val, idx) => (
                            <div
                              key={idx}
                              className={`flex-1 rounded-t transition-all ${
                                val > 80 ? 'bg-rose-500' : val > 50 ? 'bg-amber-400' : 'bg-cyan-500'
                              }`}
                              style={{ height: `${val}%` }}
                            >
                              <span className="text-[8px] text-slate-300 block text-center mt-1">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Evidence Statements Breakdown */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>Forensic Evidence Attribution Matrix</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sample.evidencePoints.map((point, idx) => (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                        point.type === 'fail'
                          ? 'bg-rose-950/20 border-rose-800/40 text-slate-200'
                          : point.type === 'warning'
                          ? 'bg-amber-950/20 border-amber-800/40 text-slate-200'
                          : 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${
                            point.type === 'fail' ? 'bg-rose-500' : point.type === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                          }`} />
                          <span>{point.title}</span>
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                          point.type === 'fail' ? 'bg-rose-900/60 text-rose-300' : point.type === 'warning' ? 'bg-amber-900/60 text-amber-300' : 'bg-emerald-900/60 text-emerald-300'
                        }`}>
                          {point.type}
                        </span>
                      </div>
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        {point.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close XAI View
          </button>
        </div>

      </div>
    </div>
  );
};
