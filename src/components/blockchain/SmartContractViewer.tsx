'use client';

import React, { useState } from 'react';
import { Code2, Copy, Check, ShieldCheck, Terminal } from 'lucide-react';

const SOLIDITY_CONTRACT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NeuroShieldEvidenceRegistry
 * @dev ISO/IEC 27037 compliant immutable evidence registration contract.
 */
contract NeuroShieldEvidenceRegistry {
    struct Evidence {
        bytes32 sha256Hash;
        string mimeType;
        uint256 timestamp;
        address custodian;
        uint8 threatLevel;
    }

    mapping(bytes32 => Evidence) public registry;
    event EvidenceAnchored(bytes32 indexed sha256Hash, address indexed custodian, uint256 timestamp);

    function registerEvidence(
        bytes32 _hash,
        string memory _mimeType,
        uint8 _threatLevel
    ) external {
        require(registry[_hash].timestamp == 0, "Evidence hash already registered on-chain");
        
        registry[_hash] = Evidence({
            sha256Hash: _hash,
            mimeType: _mimeType,
            timestamp: block.timestamp,
            custodian: msg.sender,
            threatLevel: _threatLevel
        });

        emit EvidenceAnchored(_hash, msg.sender, block.timestamp);
    }
}`;

export const SmartContractViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SOLIDITY_CONTRACT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <Code2 className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="text-lg font-bold">Smart Contract Ledger Code</h3>
            <p className="text-xs text-slate-400">Solidity v0.8.20 Evidence Registry Interface</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 flex items-center gap-1.5 transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied ABI' : 'Copy Contract Code'}
        </button>
      </div>

      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto font-mono text-xs text-amber-300/90 leading-relaxed">
        <pre>{SOLIDITY_CONTRACT_CODE}</pre>
      </div>
    </div>
  );
};
