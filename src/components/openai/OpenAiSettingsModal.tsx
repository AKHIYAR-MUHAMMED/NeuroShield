'use client';

import React, { useState, useEffect } from 'react';
import { Key, Sparkles, Check, AlertCircle, Shield, X, RefreshCw } from 'lucide-react';
import {
  getStoredOpenAiApiKey,
  setStoredOpenAiApiKey,
  getStoredOpenAiModel,
  setStoredOpenAiModel,
  requestOpenAiAnalysis,
  OpenAiExplanationResult
} from '@/utils/openai';

interface OpenAiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenAiSettingsModal: React.FC<OpenAiSettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState<string>(() => getStoredOpenAiApiKey());
  const [model, setModel] = useState<string>(() => getStoredOpenAiModel());
  const [testing, setTesting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setApiKey(getStoredOpenAiApiKey());
      setModel(getStoredOpenAiModel());
      setStatusMessage(null);
    }
  }

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredOpenAiApiKey(apiKey);
    setStoredOpenAiModel(model);
    setStatusMessage({
      type: 'success',
      text: apiKey ? 'OpenAI API key and model preferences saved successfully!' : 'Cleared custom key. NeuroShield will use environment defaults or built-in AI engine.'
    });
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setStatusMessage(null);

    // Save temporarily to test
    setStoredOpenAiApiKey(apiKey);
    setStoredOpenAiModel(model);

    const result = await requestOpenAiAnalysis<OpenAiExplanationResult>('explain_evidence', {
      evidence: {
        id: 'test',
        title: 'Connection Test Sample',
        type: 'image',
        datasetName: 'Test Suite',
        authenticityScore: 90,
        verdict: 'Likely Real',
        previewUrl: '',
        sha256Hash: 'test-hash-123456789',
        blockchainId: '0x00000000000',
        blockNumber: 1,
        timestamp: new Date().toISOString(),
        fileSize: '1 MB',
        mimeType: 'image/png',
        evidencePoints: [],
        metadata: {}
      }
    });

    setTesting(false);

    if (result.success) {
      if (result.isSimulated) {
        setStatusMessage({
          type: 'info',
          text: 'Connected via Built-in NeuroShield AI Engine (No custom key provided or using fallback).'
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: `Successfully connected to OpenAI API! Model ${model} responded cleanly.`
        });
      }
    } else {
      setStatusMessage({
        type: 'error',
        text: `OpenAI Connection Error: ${result.error || 'Invalid API Key or Network failure'}`
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>OpenAI LLM Integration</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40">
                GPT-4o Ready
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Configure OpenAI keys for automated forensic explanations and legal synthesis
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="space-y-4 text-xs">
          
          {/* API Key Input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>OpenAI API Key (sk-...)</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 font-mono text-xs"
            />
            <p className="text-[10px] text-slate-500">
              Your key is stored securely in your browser session (`localStorage`) and never logged to external servers.
            </p>
          </div>

          {/* Model Selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target OpenAI Model</span>
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500/50 text-xs"
            >
              <option value="gpt-4o-mini">gpt-4o-mini (Fast & Cost Efficient - Recommended)</option>
              <option value="gpt-4o">gpt-4o (High-Precision Deep Legal & Technical Forensics)</option>
              <option value="gpt-4-turbo">gpt-4-turbo (Legacy GPT-4 Turbo Engine)</option>
            </select>
          </div>

          {/* Status Message Display */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start space-x-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              }`}
            >
              {statusMessage.type === 'success' && <Check className="w-4 h-4 mt-0.5 shrink-0" />}
              {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
              {statusMessage.type === 'info' && <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition disabled:opacity-50"
          >
            {testing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Testing API...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test Connection</span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg shadow-cyan-500/20 transition"
            >
              Save Configuration
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
