'use me';
'use client';

import React, { useState } from 'react';
import { GitCommit, ShieldCheck, Database, Layers, CheckCircle2 } from 'lucide-react';
import { buildMerkleTree } from '../../utils/merkleProof';

export function MerkleAuditVisualizer() {
  const [hashes] = useState<string[]>([
    '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    '0x89abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567',
    '0x456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123',
  ]);

  const tree = buildMerkleTree(hashes);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">Merkle Audit Root Tree</h3>
            <p className="text-xs text-slate-400">Cryptographic inclusion proof tree for batch evidence logs</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Root Verified
        </span>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30">
          <span className="text-[11px] text-indigo-300 uppercase font-medium block mb-1">Merkle Root Hash</span>
          <code className="text-xs font-mono text-indigo-200 break-all">{tree.rootHash}</code>
        </div>

        <div className="space-y-2 mt-4">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-400" /> Evidence Leaf Nodes ({tree.leafCount})
          </span>

          <div className="grid grid-cols-1 gap-2">
            {hashes.map((hash, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <Database className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{hash}</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
