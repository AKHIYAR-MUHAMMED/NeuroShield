'use client';

import React from 'react';
import { GitCommit, ShieldCheck, UserCheck, HardDrive, Key } from 'lucide-react';

export interface CustodyStep {
  id: string;
  stage: string;
  custodian: string;
  timestamp: string;
  details: string;
  hash: string;
}

interface ChainOfCustodyTimelineProps {
  steps?: CustodyStep[];
}

const defaultSteps: CustodyStep[] = [
  {
    id: 'step-1',
    stage: 'Evidence Acquisition',
    custodian: 'Det. Sarah Jenkins (Cyber Crime Unit)',
    timestamp: '2026-09-11 14:22:01 UTC',
    details: 'Hardware write-blocker image acquisition from seized storage device.',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'step-2',
    stage: 'Neural Ingestion & SHA-256 Hashing',
    custodian: 'NeuroShield Engine Node-04',
    timestamp: '2026-09-11 14:23:45 UTC',
    details: 'Calculated raw file SHA-256 hash and generated Merkle root tree.',
    hash: '7d8a9f0e1c2b3a4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
  },
  {
    id: 'step-3',
    stage: 'On-Chain Ledger Anchoring',
    custodian: 'Smart Contract (0x7F...9A2B)',
    timestamp: '2026-09-11 14:24:12 UTC',
    details: 'Block #14,892,104 confirmed by 12 decentralized validator nodes.',
    hash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
  },
  {
    id: 'step-4',
    stage: 'Court Forensic Verification',
    custodian: 'Expert Witness Dr. Marcus Vance',
    timestamp: '2026-09-11 15:10:33 UTC',
    details: 'ISO/IEC 27037 compliance certificate signed and sealed.',
    hash: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
  },
];

export const ChainOfCustodyTimeline: React.FC<ChainOfCustodyTimelineProps> = ({
  steps = defaultSteps,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <GitCommit className="w-6 h-6 text-cyan-400" />
        <div>
          <h3 className="text-lg font-bold">Chain of Custody Audit Trail</h3>
          <p className="text-xs text-slate-400">Verifiable sequential log under FRE Rule 902(14)</p>
        </div>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-4 space-y-6">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative pl-6">
            <div className="absolute -left-[17px] top-1 bg-slate-900 border-2 border-cyan-400 rounded-full p-1 text-cyan-400">
              {idx === 0 && <HardDrive className="w-3.5 h-3.5" />}
              {idx === 1 && <Key className="w-3.5 h-3.5" />}
              {idx === 2 && <ShieldCheck className="w-3.5 h-3.5" />}
              {idx >= 3 && <UserCheck className="w-3.5 h-3.5" />}
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-cyan-300 text-sm">{step.stage}</span>
                <span className="text-xs font-mono text-slate-500">{step.timestamp}</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">{step.details}</p>
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono bg-slate-900/60 p-2 rounded border border-slate-800">
                <span>Custodian: {step.custodian}</span>
                <span className="truncate max-w-[200px]">Hash: {step.hash}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
