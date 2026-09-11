'use client';

import React from 'react';
import { Shield, Cpu, Database, QrCode, FileCheck, Layers, ExternalLink, Activity, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickVerify?: () => void;
  onOpenOpenAiSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onQuickVerify, onOpenOpenAiSettings }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'scanner', label: 'Multi-Modal Scanner', icon: Cpu },
    { id: 'ledger', label: 'Blockchain Ledger', icon: Database },
    { id: 'verifier', label: 'QR Hash Verifier', icon: QrCode },
    { id: 'certificate', label: 'Court Certificate', icon: FileCheck },
    { id: 'datasets', label: 'Benchmark Datasets', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
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
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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

          {/* Right Action: OpenAI & Quick Scan */}
          <div className="flex items-center space-x-2.5">
            {onOpenOpenAiSettings && (
              <button
                onClick={onOpenOpenAiSettings}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 transition-all"
                title="Configure OpenAI LLM Integration"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline">OpenAI Settings</span>
              </button>
            )}

            <div className="hidden lg:flex items-center space-x-2 text-xs bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full text-slate-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Polygon Mainnet</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>

            <button
              onClick={() => {
                if (onQuickVerify) onQuickVerify();
                else setActiveTab('scanner');
              }}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25"
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
