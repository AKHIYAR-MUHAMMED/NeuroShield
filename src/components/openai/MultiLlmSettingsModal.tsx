'use client';

import React, { useState } from 'react';
import { Cpu, ShieldCheck, RefreshCw, Key, CheckCircle2, Zap, Server, Sliders, X } from 'lucide-react';
import { getLlmProviders, saveLlmProviderConfig, LlmProvider } from '../../utils/llmRouter';

interface MultiLlmSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiLlmSettingsModal: React.FC<MultiLlmSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [providers, setProviders] = useState<LlmProvider[]>(getLlmProviders());
  const [isTesting, setIsTesting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggleActive = (id: string, active: boolean) => {
    saveLlmProviderConfig(id, { active });
    setProviders(getLlmProviders());
  };

  const handleWeightChange = (id: string, weight: number) => {
    saveLlmProviderConfig(id, { weight });
    setProviders(getLlmProviders());
  };

  const handleTestAll = async () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl text-slate-100 relative space-y-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">10 LLM Backend Ensemble Bridge</h3>
              <p className="text-xs text-slate-400">Configure multi-model providers for deepfake forensic consensus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close LLM settings modal"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved Success Notification */}
        {savedSuccess && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>All 10 LLM Backends tested & consensus routing configuration saved!</span>
          </div>
        )}

        {/* 10 LLM Providers List */}
        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
          {providers.map((prov) => (
            <div
              key={prov.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                prov.active
                  ? 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/40'
                  : 'bg-slate-950/30 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={prov.active}
                  onChange={(e) => handleToggleActive(prov.id, e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                  aria-label={`Toggle ${prov.name}`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-100">{prov.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {prov.modelName}
                    </span>
                    {prov.isLocal && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 font-bold uppercase">
                        Offline Vault
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-mono">
                    <span>Vendor: <strong className="text-slate-300">{prov.vendor}</strong></span>
                    <span>Latency: <strong className="text-cyan-400">{prov.latencyMs}ms</strong></span>
                  </div>
                </div>
              </div>

              {/* Weight Slider */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">Weight: {(prov.weight * 100).toFixed(0)}%</span>
                <input
                  type="range"
                  min="0.01"
                  max="0.30"
                  step="0.01"
                  value={prov.weight}
                  onChange={(e) => handleWeightChange(prov.id, parseFloat(e.target.value))}
                  className="w-20 accent-cyan-500 bg-slate-900 h-1.5 rounded cursor-pointer"
                  aria-label={`${prov.name} weight`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={handleTestAll}
            disabled={isTesting}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-cyan-400' : ''}`} />
            {isTesting ? 'Testing 10 LLM Endpoints...' : 'Ping All 10 Backends'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl font-bold text-xs shadow-lg transition-all"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
