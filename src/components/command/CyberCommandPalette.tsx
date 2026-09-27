'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Shield,
  Cpu,
  Brain,
  Scale,
  Database,
  QrCode,
  FileCheck,
  Layers,
  Activity,
  Briefcase,
  Terminal,
  Zap,
  X,
  Command,
} from 'lucide-react';

interface CyberCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
  onOpenMultiLlmModal?: () => void;
  onOpenAstraSettings?: () => void;
}

export const CyberCommandPalette: React.FC<CyberCommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onOpenMultiLlmModal,
  onOpenAstraSettings,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via document event or props
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const COMMAND_ITEMS = [
    {
      id: 'dashboard',
      label: 'Main Executive Cyber-Forensic Dashboard',
      category: 'Navigation',
      icon: Shield,
      action: () => {
        setActiveTab('dashboard');
        onClose();
      },
    },
    {
      id: 'scanner',
      label: 'Multi-Modal Deepfake Evidence Scanner (Image/Video/Audio/PDF)',
      category: 'Analysis Engines',
      icon: Cpu,
      action: () => {
        setActiveTab('scanner');
        onClose();
      },
    },
    {
      id: 'llm-mesh',
      label: '10-LLM Neural Mesh Matrix & Cross-Validation Hub',
      category: 'AI Ensemble',
      icon: Brain,
      action: () => {
        setActiveTab('llm-mesh');
        onClose();
      },
    },
    {
      id: 'spectrum',
      label: 'Multi-Spectral Diagnostic Laboratory (FFT / ELA / rPPG / PRNU)',
      category: 'Diagnostics',
      icon: Activity,
      action: () => {
        setActiveTab('spectrum');
        onClose();
      },
    },
    {
      id: 'cases',
      label: 'Court-Admissible Case Custody Hub & ISO/IEC 27037 Docket',
      category: 'Legal Audit',
      icon: Briefcase,
      action: () => {
        setActiveTab('cases');
        onClose();
      },
    },
    {
      id: 'comparisons',
      label: 'SOTA Real vs AI Forensic Benchmark Visualizer',
      category: 'Benchmarking',
      icon: Scale,
      action: () => {
        setActiveTab('comparisons');
        onClose();
      },
    },
    {
      id: 'ledger',
      label: 'Immutable Blockchain Ledger & DataStax Astra DB Proofs',
      category: 'Web3 Ledger',
      icon: Database,
      action: () => {
        setActiveTab('ledger');
        onClose();
      },
    },
    {
      id: 'certificate',
      label: 'Court-Admissible Legal Certificate Generator',
      category: 'Reporting',
      icon: FileCheck,
      action: () => {
        setActiveTab('certificate');
        onClose();
      },
    },
    {
      id: 'verifier',
      label: 'Dynamic QR Code On-Chain Authenticator',
      category: 'Verification',
      icon: QrCode,
      action: () => {
        setActiveTab('verifier');
        onClose();
      },
    },
    {
      id: 'datasets',
      label: 'SOTA Deepfake Benchmark Datasets (FF++, Celeb-DF, ASVspoof)',
      category: 'Datasets',
      icon: Layers,
      action: () => {
        setActiveTab('datasets');
        onClose();
      },
    },
  ];

  const filtered = COMMAND_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header Search Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-cyan-400" />
            <input
              type="text"
              placeholder="Type a command or search workspace..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-sm sm:text-base text-white focus:outline-none placeholder:text-slate-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-2 py-1 bg-slate-800 text-[10px] font-mono font-bold text-slate-400 rounded">
              ESC to Close
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Command Items List */}
        <div className="p-3 overflow-y-auto space-y-1 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No matching cyber command found. Try searching for "scanner", "10-llm", "fft", or "certificate".
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full p-3.5 rounded-2xl flex items-center justify-between text-left hover:bg-slate-800/70 hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-3.5 pr-2">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-200 group-hover:text-white transition-all">
                        {item.label}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">{item.category}</span>
                    </div>
                  </div>

                  <Zap className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3 text-cyan-400" /> NeuroShield Cyber Command Palette
          </span>
          <span>10-LLM Neural Mesh Online</span>
        </div>
      </div>
    </div>
  );
};
