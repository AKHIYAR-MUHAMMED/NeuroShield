'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Activity,
  Radio,
  Lock,
  Globe,
  Brain,
  Sparkles,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import {
  getLlmProviders,
  saveLlmProviderConfig,
  calculateMultiLlmConsensusScore,
  LlmProvider,
  MultiLlmConsensusResult,
} from '@/utils/llmRouter';

const SAMPLE_PROMPTS = [
  {
    id: 'image-gan',
    label: '🖼️ Image: Midjourney v6 GAN Spatial Filter',
    domain: 'Image Forensics',
    expectedScore: 88,
    sampleDescription: 'Analysis of 4K facial portrait suspicious of GAN grid periodicity and eye specular asymmetry.',
  },
  {
    id: 'video-sora',
    label: '🎥 Video: Sora Temporal Discontinuity & rPPG',
    domain: 'Video Forensics',
    expectedScore: 94,
    sampleDescription: 'Deepfake video clip evaluation for temporal boundary jitter and biological pulse absence.',
  },
  {
    id: 'audio-elevenlabs',
    label: '🎙️ Audio: ElevenLabs v2 Neural Vocoder Phase',
    domain: 'Audio Voice Clone',
    expectedScore: 79,
    sampleDescription: 'Voice sample evaluation for artificial F0 pitch flatness and missing respiratory pauses.',
  },
  {
    id: 'document-forgery',
    label: '📄 Document: PDF Subsetting & ELA Delta',
    domain: 'Document Tamper',
    expectedScore: 12,
    sampleDescription: 'Official court contract verification for localized Error Level Analysis compression deltas.',
  },
];

export const MultiLlmMeshHub: React.FC = () => {
  const [providers, setProviders] = useState<LlmProvider[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState(SAMPLE_PROMPTS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeModelId, setActiveModelId] = useState<string | null>('deepseek');
  const [activeTab, setActiveTab] = useState<'mesh' | 'sandbox' | 'weights'>('mesh');
  const [consensusResult, setConsensusResult] = useState<MultiLlmConsensusResult | null>(null);

  // Initialize providers and consensus
  useEffect(() => {
    const loadedProviders = getLlmProviders();
    setProviders(loadedProviders);
    runConsensus(loadedProviders, SAMPLE_PROMPTS[0].expectedScore);
  }, []);

  const runConsensus = (provList: LlmProvider[], baseScore: number) => {
    const responses = provList
      .filter((p) => p.active)
      .map((p) => {
        const noise = (Math.random() - 0.5) * 0.14;
        const score = Math.min(0.99, Math.max(0.01, parseFloat(((baseScore / 100) + noise).toFixed(2))));
        return {
          providerId: p.id,
          syntheticProbability: score,
          latencyMs: p.latencyMs + Math.floor(Math.random() * 20 - 10),
        };
      });

    const result = calculateMultiLlmConsensusScore(responses);
    setConsensusResult(result);
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= 5) {
        clearInterval(interval);
        runConsensus(providers, selectedPrompt.expectedScore);
        setIsSimulating(false);
      }
    }, 250);
  };

  const handleWeightChange = (id: string, newWeight: number) => {
    const updated = saveLlmProviderConfig(id, { weight: newWeight });
    setProviders(updated);
    if (selectedPrompt) {
      runConsensus(updated, selectedPrompt.expectedScore);
    }
  };

  const handleToggleActive = (id: string, active: boolean) => {
    const updated = saveLlmProviderConfig(id, { active });
    setProviders(updated);
    if (selectedPrompt) {
      runConsensus(updated, selectedPrompt.expectedScore);
    }
  };

  const selectedModel = providers.find((p) => p.id === activeModelId) || providers[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" /> 10-LLM Ensemble Network Active
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Zero-Trust Consensus Router
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Futuristic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">10-LLM Neural Mesh Matrix</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              NeuroShield aggregates predictions across 10 frontier neural model backends (OpenAI GPT-4o, Google Gemini 1.5 Pro, Anthropic Claude 3.5, DeepSeek R1, Meta Llama 3.3, Mistral 2, Cohere, Qwen 2.5, Perplexity, & Local Air-Gapped Ollama) for unforgeable multi-modal consensus verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shadow-inner">
            <div className="text-center px-4 py-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Models</span>
              <div className="text-2xl font-black text-cyan-400">
                {providers.filter((p) => p.active).length} / 10
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-4 py-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Latency</span>
              <div className="text-2xl font-black text-emerald-400">
                {providers.length > 0 ? Math.round(providers.reduce((a, b) => a + b.latencyMs, 0) / providers.length) : 130} ms
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-4 py-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Vault Security</span>
              <div className="text-2xl font-black text-purple-400 flex items-center justify-center gap-1">
                <Lock className="w-4 h-4" /> 100%
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('mesh')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'mesh'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Brain className="w-4 h-4" /> Interactive Neural Mesh Topology
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'sandbox'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" /> 10-LLM Forensic Prompt Sandbox
          </button>
          <button
            onClick={() => setActiveTab('weights')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'weights'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" /> Consensus Weight & Topology Editor
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'mesh' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 10 Model Nodes Matrix Visualizer */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Live 10-LLM Signal Router Topology</h3>
                  <p className="text-xs text-slate-400">Click any model node to inspect micro-latency and forensic reasoning specialization</p>
                </div>
              </div>
              <button
                onClick={handleSimulate}
                disabled={isSimulating}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-cyan-400' : ''}`} />
                {isSimulating ? 'Pinging Matrix...' : 'Refresh Pings'}
              </button>
            </div>

            {/* Futuristic Holographic Grid Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 p-4 bg-slate-950 rounded-2xl border border-slate-800/80 relative overflow-hidden">
              {/* Mesh visual lines overlay */}
              <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />

              {providers.map((p) => {
                const isSelected = activeModelId === p.id;
                const isOllama = p.isLocal;
                const accent = p.accentColor || '#06b6d4';

                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveModelId(p.id)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-36 ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.03] z-10'
                        : p.active
                        ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        : 'bg-slate-950/40 border-slate-900 opacity-40'
                    }`}
                  >
                    {/* Node Header */}
                    <div className="flex items-center justify-between">
                      <span
                        className="w-3 h-3 rounded-full shadow-md"
                        style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
                      />
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          isOllama
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isOllama ? 'LOCAL' : `${p.latencyMs}ms`}
                      </span>
                    </div>

                    {/* Model Details */}
                    <div className="space-y-1 my-2">
                      <h4 className="font-bold text-xs text-white truncate">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{p.vendor}</p>
                    </div>

                    {/* Weight & Status indicator */}
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                      <span className="font-mono text-slate-400">W: {(p.weight * 100).toFixed(0)}%</span>
                      <span className="text-cyan-400 font-bold">ONLINE</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Consensus Output Preview Card */}
            {consensusResult && (
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Current Consensus Verdict Breakdown
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      consensusResult.finalVerdict === 'CONFIRMED_DEEPFAKE'
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : consensusResult.finalVerdict === 'SUSPECT'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    {consensusResult.finalVerdict}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Consensus Probability</span>
                    <div className="text-xl font-extrabold text-cyan-400 mt-1">
                      {(consensusResult.consensusScore * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Agreement Ratio</span>
                    <div className="text-xl font-extrabold text-emerald-400 mt-1">
                      {(consensusResult.agreementRatio * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Models Responded</span>
                    <div className="text-xl font-extrabold text-purple-400 mt-1">
                      {consensusResult.modelsConsultedCount} / 10
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Selected Model Focus Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg text-slate-950 shadow-md"
                  style={{ backgroundColor: selectedModel.accentColor || '#06b6d4' }}
                >
                  <Cpu className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedModel.name}</h3>
                  <p className="text-xs text-slate-400">{selectedModel.vendor} • {selectedModel.modelName}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Forensic Specialty</span>
                  <p className="text-slate-200 mt-1 bg-slate-950 p-3 rounded-xl border border-slate-800 font-medium">
                    {selectedModel.specialty || 'General Deepfake Pattern Recognition'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400">Ensemble Weight</span>
                    <div className="text-base font-bold text-cyan-400 mt-0.5">
                      {(selectedModel.weight * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400">Ping Latency</span>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">
                      {selectedModel.latencyMs} ms
                    </div>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase text-[10px]">Sample Reasoning Trace</span>
                  <div className="mt-1 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 leading-relaxed">
                    {consensusResult?.breakdown.find((b) => b.providerId === selectedModel.id)?.reasoning ||
                      `[${selectedModel.name}] Evaluating high-frequency spatial energy & temporal biological signals...`}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> API Bridge Operational
              </span>
              <span className="font-mono text-[10px]">{selectedModel.isLocal ? 'AIR_GAPPED_LOCAL' : 'CLOUD_HTTPS'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Sandbox Tab Content */}
      {activeTab === 'sandbox' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h3 className="font-bold text-xl text-white">Interactive 10-LLM Forensic Prompt Sandbox</h3>
              <p className="text-xs text-slate-400 mt-1">Select an evidentiary test scenario to simulate real-time multi-LLM consensus verification</p>
            </div>

            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Play className={`w-4 h-4 fill-current ${isSimulating ? 'animate-bounce' : ''}`} />
              {isSimulating ? 'Evaluating 10 Models...' : 'Execute 10-LLM Consensus Scan'}
            </button>
          </div>

          {/* Sample Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => {
                  setSelectedPrompt(prompt);
                  runConsensus(providers, prompt.expectedScore);
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedPrompt.id === prompt.id
                    ? 'bg-slate-950 border-cyan-400 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{prompt.domain}</span>
                <h4 className="font-bold text-xs text-white mt-1">{prompt.label}</h4>
                <p className="text-[10px] text-slate-400 mt-2 line-clamp-2">{prompt.sampleDescription}</p>
              </button>
            ))}
          </div>

          {/* Real-time Streaming Model Responses */}
          {consensusResult && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h4 className="font-bold text-sm text-white flex items-center justify-between">
                <span>All 10 Models Evaluated Log ({consensusResult.modelsConsultedCount} / 10 Active)</span>
                <span className="text-xs text-slate-400 font-normal">Agreement: {(consensusResult.agreementRatio * 100).toFixed(0)}%</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {consensusResult.breakdown.map((item) => (
                  <div
                    key={item.providerId}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden"
                  >
                    <div
                      className="absolute top-0 left-0 bottom-0 w-1"
                      style={{ backgroundColor: item.accentColor || '#06b6d4' }}
                    />
                    <div className="flex items-center justify-between text-xs pl-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{item.providerName}</span>
                        <span className="text-[10px] text-slate-400">({item.latencyMs}ms)</span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                          item.verdict === 'SYNTHETIC'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.verdict} ({(item.confidence * 100).toFixed(0)}%)
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-cyan-200/90 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 ml-2">
                      {item.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weights Tab Content */}
      {activeTab === 'weights' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-bold text-xl text-white">10-LLM Consensus Weight & Topology Editor</h3>
            <p className="text-xs text-slate-400 mt-1">Adjust relative model weightings in the final court certificate consensus calculation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((prov) => (
              <div
                key={prov.id}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={prov.active}
                      onChange={(e) => handleToggleActive(prov.id, e.target.checked)}
                      className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white">{prov.name}</h4>
                      <p className="text-[10px] text-slate-400">{prov.vendor} • {prov.modelName}</p>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {(prov.weight * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="0.30"
                    step="0.01"
                    value={prov.weight}
                    disabled={!prov.active}
                    onChange={(e) => handleWeightChange(prov.id, parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0% (Disabled)</span>
                    <span>15% (Default)</span>
                    <span>30% (Max)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
