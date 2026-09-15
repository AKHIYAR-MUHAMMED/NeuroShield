'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Cpu, Database, QrCode, FileCheck, Layers, Activity, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { pingAstraHealth, AstraHealthStatus } from '@/utils/astra';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickVerify?: () => void;
  onOpenOpenAiSettings?: () => void;
  onOpenAstraSettings?: () => void;
  onOpenMultiLlmSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onQuickVerify,
  onOpenOpenAiSettings,
  onOpenAstraSettings,
  onOpenMultiLlmSettings,
}) => {
  const [astraHealth, setAstraHealth] = useState<AstraHealthStatus | null>(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'scanner', label: 'Multi-Modal Scanner', icon: Cpu },
    { id: 'ledger', label: 'Blockchain Ledger', icon: Database },
    { id: 'verifier', label: 'QR Hash Verifier', icon: QrCode },
    { id: 'certificate', label: 'Court Certificate', icon: FileCheck },
    { id: 'datasets', label: 'Benchmark Datasets', icon: Layers },
  ];

  // Poll Astra health every 30 seconds
  useEffect(() => {
    let cancelled = false;

    const checkHealth = async () => {
      const status = await pingAstraHealth();
      if (!cancelled) setAstraHealth(status);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const isConnected = astraHealth?.connected === true;
  const isFallback = astraHealth?.fallback === true && astraHealth?.connected !== true;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo & Tagline */}
          <button
            onClick={() => setActiveTab('dashboard')}
            aria-label="NeuroShield Home Dashboard"
            className="flex items-center space-x-3 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded-xl p-1"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Shield className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
                  NeuroShield
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                  v2.4 AI+Web3
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Digital Evidence & Deepfake Verification Platform
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav aria-label="Main Navigation" className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">

            {/* Live Astra DB Health Badge */}
            <button
              onClick={onOpenAstraSettings}
              title={astraHealth?.message || 'DataStax Astra DB Status'}
              className={`hidden lg:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
                astraHealth === null
                  ? 'bg-slate-900 border-slate-800 text-slate-500 animate-pulse'
                  : isConnected
                  ? 'bg-purple-950/70 border-purple-700/50 text-purple-300 hover:border-purple-500'
                  : 'bg-amber-950/70 border-amber-700/50 text-amber-300 hover:border-amber-500'
              }`}
            >
              {astraHealth === null ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
                  <span>Checking Astra…</span>
                </>
              ) : isConnected ? (
                <>
                  <Wifi className="w-3 h-3 text-purple-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                  <span>Astra DB Live</span>
                  {astraHealth.latencyMs > 0 && (
                    <span className="text-purple-500 font-mono">{astraHealth.latencyMs}ms</span>
                  )}
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Astra Fallback</span>
                </>
              )}
            </button>

            {/* 10 LLM Ensemble Settings */}
            {onOpenMultiLlmSettings && (
              <button
                onClick={onOpenMultiLlmSettings}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/80 border border-cyan-700/60 hover:border-cyan-500 text-cyan-300 transition-all"
                title="Configure 10 LLM Backend Ensemble Bridge"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">10 LLMs</span>
              </button>
            )}

            {/* OpenAI Settings */}
            {onOpenOpenAiSettings && (
              <button
                onClick={onOpenOpenAiSettings}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 transition-all"
                title="Configure OpenAI LLM Integration"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline">OpenAI</span>
              </button>
            )}

            {/* Astra DB Settings (mobile) */}
            {onOpenAstraSettings && (
              <button
                onClick={onOpenAstraSettings}
                className="lg:hidden flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-purple-800/60 hover:border-purple-500/70 text-purple-300 transition-all"
                title="Configure DataStax Astra DB"
              >
                <Database className="w-3.5 h-3.5 text-purple-400" />
              </button>
            )}

            {/* Scan Evidence CTA */}
            <button
              onClick={() => {
                if (onQuickVerify) onQuickVerify();
                else setActiveTab('scanner');
              }}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25"
            >
              <Cpu className="w-4 h-4" />
              <span>Scan Evidence</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-1 border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap font-medium ${
                  isActive ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
