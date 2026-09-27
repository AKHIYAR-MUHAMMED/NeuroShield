'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  FileCheck,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  Lock,
  Download,
  Search,
  ChevronRight,
  Sparkles,
  FileText,
  AlertCircle,
  Scale,
} from 'lucide-react';
import { SAMPLE_DATASETS, EvidenceSample } from '@/data/samples';

interface ForensicCase {
  id: string;
  caseNumber: string;
  title: string;
  investigator: string;
  agency: string;
  status: 'ACTIVE_INVESTIGATION' | 'COURT_PENDING' | 'VERIFIED_ADMISSIBLE' | 'CLOSED';
  createdUtc: string;
  exhibitsCount: number;
  courtAdmissibleScore: number; // 0-100%
  description: string;
}

const INITIAL_CASES: ForensicCase[] = [
  {
    id: 'case-101',
    caseNumber: 'CASE-2026-8891',
    title: 'State vs. CyberCorp LLC (Synthetic CEO Voice Clone Extortion)',
    investigator: 'Special Agent Sarah Vance',
    agency: 'Federal Cyber Forensics Division',
    status: 'VERIFIED_ADMISSIBLE',
    createdUtc: '2026-09-21 14:32:10 UTC',
    exhibitsCount: 3,
    courtAdmissibleScore: 98,
    description: 'Investigation into unauthorized AI voice cloning of corporate officers used in $4.2M fraudulent wire transfer.',
  },
  {
    id: 'case-102',
    caseNumber: 'CASE-2026-9042',
    title: 'People vs. Miller (Deepfake Election Campaign Video Manipulation)',
    investigator: 'Detective Alex Rivera',
    agency: 'Digital Evidence & Anti-Tamper Unit',
    status: 'COURT_PENDING',
    createdUtc: '2026-09-24 09:15:45 UTC',
    exhibitsCount: 2,
    courtAdmissibleScore: 95,
    description: 'Video deepfake temporal boundary jitter analysis and rPPG capillary pulse wave verification for state court submission.',
  },
  {
    id: 'case-103',
    caseNumber: 'CASE-2026-9118',
    title: 'In re: Fraudulent Land Deed Title PDF Forgery',
    investigator: 'Forensic Examiner Marcus Brody',
    agency: 'State Land Registry & Fraud Unit',
    status: 'ACTIVE_INVESTIGATION',
    createdUtc: '2026-09-26 18:04:12 UTC',
    exhibitsCount: 4,
    courtAdmissibleScore: 92,
    description: 'Document tamper scan for localized JPEG ELA compression deltas and PKCS#7 digital signature validation.',
  },
];

export const CaseManagementHub: React.FC<{
  onSelectSample?: (sample: EvidenceSample) => void;
}> = ({ onSelectSample }) => {
  const [cases, setCases] = useState<ForensicCase[]>(INITIAL_CASES);
  const [selectedCase, setSelectedCase] = useState<ForensicCase>(INITIAL_CASES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // New Case Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCaseNum, setNewCaseNum] = useState('');
  const [newInvestigator, setNewInvestigator] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCaseNum) return;

    const created: ForensicCase = {
      id: `case-${Date.now()}`,
      caseNumber: newCaseNum,
      title: newTitle,
      investigator: newInvestigator || 'Special Agent Investigator',
      agency: 'NeuroShield Digital Forensics Lab',
      status: 'ACTIVE_INVESTIGATION',
      createdUtc: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      exhibitsCount: 1,
      courtAdmissibleScore: 96,
      description: newDescription || 'Newly opened digital evidence case.',
    };

    setCases([created, ...cases]);
    setSelectedCase(created);
    setIsCreatingNew(false);
    setNewTitle('');
    setNewCaseNum('');
    setNewInvestigator('');
    setNewDescription('');
  };

  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.investigator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> Court-Admissible Custody System
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ISO/IEC 27037 Standardized
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Legal Forensic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">Case Management Hub</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Organize digital evidence exhibits, track legal chain-of-custody handoffs, generate ISO/IEC 27037 compliant audit logs, and prepare unforgeable court packages anchored on the SHA-256 blockchain.
            </p>
          </div>

          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-2xl text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Plus className="w-4 h-4" /> Open New Legal Case File
          </button>
        </div>
      </div>

      {/* New Case Modal Form */}
      {isCreatingNew && (
        <form onSubmit={handleCreateCase} className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-xl text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-cyan-400" /> Open New Digital Forensic Case File
            </h3>
            <button type="button" onClick={() => setIsCreatingNew(false)} className="text-slate-400 hover:text-white text-xs">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Case ID / docket Number</label>
              <input
                type="text"
                placeholder="e.g. CASE-2026-9901"
                value={newCaseNum}
                onChange={(e) => setNewCaseNum(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Lead Investigator / Custodian</label>
              <input
                type="text"
                placeholder="e.g. Det. Sarah Vance"
                value={newInvestigator}
                onChange={(e) => setNewInvestigator(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Case Title</label>
              <input
                type="text"
                placeholder="e.g. State vs. Defendant (AI Voice Clone Deepfake Extortion)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 mb-1">Case Description & Forensic Scope</label>
              <textarea
                placeholder="Enter scope of evidence, hardware details, and legal objectives..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
          >
            Register & Initialize ISO/IEC 27037 Custody Log
          </button>
        </form>
      )}

      {/* Main Cases Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Cases List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-lg text-white">Active Case Docket ({cases.length})</h3>
            <div className="relative w-40 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Filter cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-xs pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredCases.map((c) => {
              const isSelected = selectedCase.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-400 shadow-md shadow-cyan-500/10 scale-[1.01]'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-cyan-400">{c.caseNumber}</span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                        c.status === 'VERIFIED_ADMISSIBLE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-white mt-1.5 line-clamp-1">{c.title}</h4>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{c.investigator}</span>
                    <span className="font-bold text-purple-400">{c.courtAdmissibleScore}% Admissible</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case File Details & Chain of Custody Timeline */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {selectedCase.caseNumber}
                </span>
                <span className="text-xs text-slate-400">{selectedCase.agency}</span>
              </div>
              <h2 className="font-extrabold text-xl text-white mt-2">{selectedCase.title}</h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-xl flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> ISO/IEC 27037 Score: {selectedCase.courtAdmissibleScore}%
              </span>
            </div>
          </div>

          {/* Case Meta Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Lead Investigator</span>
              <p className="text-xs font-bold text-white mt-1">{selectedCase.investigator}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Case Created UTC</span>
              <p className="text-xs font-mono text-cyan-300 mt-1">{selectedCase.createdUtc}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Exhibits Linked</span>
              <p className="text-xs font-bold text-purple-400 mt-1">{selectedCase.exhibitsCount} Digital Evidence Exhibits</p>
            </div>
          </div>

          {/* Linked Digital Evidence Exhibits */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center justify-between">
              <span>Linked Evidence Exhibits</span>
              <span className="text-xs text-slate-400 font-normal">Click any exhibit to inspect court certificate</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_DATASETS.slice(0, selectedCase.exhibitsCount).map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => onSelectSample?.(s)}
                  className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-cyan-400">EXHIBIT #{idx + 1}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {s.type.toUpperCase()}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-white group-hover:text-cyan-400 transition-all">{s.title}</h5>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{s.evidencePoints[0]?.description || s.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chain of Custody Audit Trail Timeline */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> ISO/IEC 27037 Legal Chain-of-Custody Log
            </h4>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">SHA-256 Blockchain Hash Anchored</span>
                    <span className="text-[10px] text-slate-500">Block #1,849,204</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hash `0e4a...881f` successfully verified on DataStax Astra DB ledger.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Custodian Handoff Verified</span>
                    <span className="text-[10px] text-slate-500">{selectedCase.createdUtc}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Evidence acquired under forensic write-blocker by {selectedCase.investigator}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
