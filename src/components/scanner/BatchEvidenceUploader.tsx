'use client';

import React, { useState } from 'react';
import { UploadCloud, FileCheck, Check, Copy, Layers, Cpu, ShieldCheck } from 'lucide-react';
import {
  processBatchHashes,
  MerkleBatchResult,
  BatchHasherProgress,
} from '../../utils/batchHasher';

interface BatchEvidenceUploaderProps {
  onBatchComplete?: (result: MerkleBatchResult) => void;
}

export const BatchEvidenceUploader: React.FC<BatchEvidenceUploaderProps> = ({
  onBatchComplete,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<BatchHasherProgress | null>(null);
  const [result, setResult] = useState<MerkleBatchResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setResult(null);

    const fileEntries: { name: string; buffer: ArrayBuffer }[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = await file.arrayBuffer();
      fileEntries.push({ name: file.name, buffer });
    }

    const batchResult = await processBatchHashes(fileEntries, (p) => setProgress(p));
    setResult(batchResult);
    setIsProcessing(false);

    if (onBatchComplete) {
      onBatchComplete(batchResult);
    }
  };

  const copyMerkleHash = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.merkleRootHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-base text-white">Multi-File Batch Evidence Hasher</h4>
            <p className="text-xs text-slate-400">Computes individual SHA-256 digests and cryptographic Merkle Root</p>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <label className="relative border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-950/60 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={isProcessing}
          aria-label="Upload evidence files for batch hashing"
          className="sr-only"
        />
        <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" />
        <span className="text-sm font-semibold text-slate-200">
          Click to upload or drag & drop evidence files
        </span>
        <span className="text-xs text-slate-500 mt-1">Supports images, audio clips, video feeds, and PDFs</span>
      </label>

      {/* Progress Bar */}
      {isProcessing && progress && (
        <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Processing {progress.filesCompleted} of {progress.totalFiles} files
            </span>
            <span className="font-mono text-cyan-400">{progress.throughputMBps} MB/s</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              style={{ width: `${progress.percent}%` }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-200"
            />
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              Batch Hashing Complete ({result.filesProcessed} files)
            </div>
            <button
              onClick={copyMerkleHash}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 text-slate-200 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Root Hash' : 'Copy Merkle Root'}
            </button>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Merkle Root Hash</span>
            <div className="font-mono text-xs text-cyan-300 break-all">{result.merkleRootHash}</div>
          </div>

          {/* Files List */}
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {result.individualHashes.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-900/50 rounded-lg border border-slate-800/60">
                <span className="font-medium text-slate-300 truncate max-w-[200px]">{file.fileName}</span>
                <span className="font-mono text-[11px] text-slate-400">{file.sha256Hash.slice(0, 16)}...</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
