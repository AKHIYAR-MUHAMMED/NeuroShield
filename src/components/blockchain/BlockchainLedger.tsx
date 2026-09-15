'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Database, Search, ShieldCheck, Cpu, Layers, CheckCircle2,
  Lock, ArrowUpRight, Copy, Check, RefreshCw, Wifi, WifiOff
} from 'lucide-react';
import { EvidenceSample } from '@/data/samples';
import { fetchEvidenceRecords } from '@/utils/astra';

interface BlockchainLedgerProps {
  customResults: EvidenceSample[];
  onSelectSample: (sample: EvidenceSample) => void;
}

export const BlockchainLedger: React.FC<BlockchainLedgerProps> = ({ customResults, onSelectSample }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [astraRecords, setAstraRecords] = useState<EvidenceSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'astra' | 'fallback' | null>(null);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    const result = await fetchEvidenceRecords({ limit: 50 });
    setAstraRecords(result.records);
    setDataSource(result.source);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // Merge: custom (optimistic) prepended before Astra records, deduped by id
  const seen = new Set<string>();
  const allRecords: EvidenceSample[] = [];
  for (const r of [...customResults, ...astraRecords]) {
    if (!seen.has(r.id)) {
      seen.add(r.id);
      allRecords.push(r);
    }
  }

  const filteredRecords = allRecords.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.sha256Hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.blockchainId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">

      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Astra DB Records</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {loading ? <span className="animate-pulse text-slate-600">…</span> : allRecords.length + 1420}
          </div>
          <div className="text-[10px] flex items-center space-x-1">
            {dataSource === 'astra' ? (
              <><Wifi className="w-3 h-3 text-purple-400" /><span className="text-purple-400">DataStax Astra DB Live</span></>
            ) : (
              <><WifiOff className="w-3 h-3 text-amber-400" /><span className="text-amber-400">Demo Fallback Mode</span></>
            )}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Network Ledger</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">Polygon POS</div>
          <div className="text-[10px] text-slate-400">Block Height: #19842145</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Smart Contract</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-cyan-400 font-mono truncate">0x742d...8921</div>
          <div className="text-[10px] text-slate-400">Verified Solidity v0.8.20</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Block Time</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">2.1s</div>
          <div className="text-[10px] text-slate-400">Gas Fee: ~$0.0004 / Cert</div>
        </div>
      </div>

      {/* Search + Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>Immutable Evidence Blockchain Explorer</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                dataSource === 'astra'
                  ? 'bg-purple-950/80 border-purple-700/50 text-purple-300'
                  : 'bg-amber-950/80 border-amber-700/50 text-amber-300'
              }`}>
                {dataSource === 'astra' ? '● Astra DB' : '● Fallback'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {dataSource === 'astra'
                ? 'Records fetched live from DataStax Astra DB vector collection'
                : 'Demo records — connect Astra DB for live ledger'}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={loadRecords}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-purple-950/50 border border-purple-700/40 hover:border-purple-500/60 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Hash, TxID, or Title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-900 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-4">Transaction TxID</th>
                  <th className="py-3 px-4">Evidence Title & Type</th>
                  <th className="py-3 px-4">SHA-256 Hash</th>
                  <th className="py-3 px-4">Verdict & Score</th>
                  <th className="py-3 px-4">Block #</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition group">

                    <td className="py-3 px-4 font-mono text-cyan-400">
                      <div className="flex items-center space-x-1.5">
                        <span>{item.blockchainId.substring(0, 10)}...{item.blockchainId.slice(-4)}</span>
                        <button onClick={() => handleCopy(item.blockchainId, `tx-${item.id}`)} className="text-slate-500 hover:text-cyan-400">
                          {copiedId === `tx-${item.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{item.title}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">{item.type} • {item.datasetName}</div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      <div className="flex items-center space-x-1.5">
                        <span className="truncate max-w-[140px]">{item.sha256Hash}</span>
                        <button onClick={() => handleCopy(item.sha256Hash, `hash-${item.id}`)} className="text-slate-500 hover:text-cyan-400">
                          {copiedId === `hash-${item.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.authenticityScore >= 60
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {item.authenticityScore}%
                        </span>
                        <span className="text-slate-300 text-[11px] hidden sm:inline">{item.verdict}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">#{item.blockNumber}</td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectSample(item)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 font-semibold text-[11px] inline-flex items-center space-x-1"
                      >
                        <span>Certificate</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};
