'use client';

import React from 'react';
import { Activity, Server, Cpu, Database, Wifi } from 'lucide-react';

export const SystemHealthStatus: React.FC = () => {
  const nodes = [
    { name: 'Neural Inference Node 01 (GPU-A100)', status: 'OPERATIONAL', latency: '42ms', load: '34%' },
    { name: 'DataStax Astra DB Vector Index (Auto-Sync)', status: 'AUTO-INDEXING', latency: '24ms', load: '12%' },
    { name: 'Blockchain Anchor Node (Mainnet)', status: 'OPERATIONAL', latency: '12ms', load: '18%' },
    { name: 'ISO/IEC 27037 Vault Storage', status: 'OPERATIONAL', latency: '8ms', load: '45%' },
    { name: 'OpenAI GPT-4o Forensics Bridge', status: 'OPERATIONAL', latency: '180ms', load: '62%' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-emerald-400" />
          <div>
            <h3 className="text-lg font-bold">System Cluster Telemetry</h3>
            <p className="text-xs text-slate-400">Real-time infrastructure performance & API health</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-lg text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>All Cluster Services Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map((node) => (
          <div key={node.name} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <p className="font-semibold text-xs text-slate-200">{node.name}</p>
              <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-slate-400">
                <span>Latency: <strong className="text-emerald-400">{node.latency}</strong></span>
                <span>Load: <strong className="text-cyan-400">{node.load}</strong></span>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold rounded-md uppercase">
              {node.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
