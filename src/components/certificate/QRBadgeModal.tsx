'use client';

import React, { useState } from 'react';
import { QrCode, Printer, Copy, Check, X, ShieldCheck, Lock } from 'lucide-react';
import { formatCourtBadgePayload, QREvidenceBadgeConfig } from '../../utils/qrBadge';

interface QRBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: QREvidenceBadgeConfig;
}

const defaultConfig: QREvidenceBadgeConfig = {
  evidenceId: 'EV-2026-8841',
  sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  verdict: 'AUTHENTIC',
  caseNumber: 'CASE-CR-2026-904',
  investigatorId: 'OFFICER-DEV-42',
};

export const QRBadgeModal: React.FC<QRBadgeModalProps> = ({
  isOpen,
  onClose,
  config = defaultConfig,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const payload = formatCourtBadgePayload(config);

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(payload.verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl text-slate-100 relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Court Evidence Tag Badge</h3>
              <p className="text-xs text-slate-400">Printable QR verification label</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close badge modal"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Tag Printable Card */}
        <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-xl p-5 space-y-4 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-black text-xs tracking-wider text-emerald-400 uppercase">
                ISO 27037 Evidence Tag
              </span>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300 font-mono">
              {payload.securityHashPrefix}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-white p-2 rounded-lg flex items-center justify-center shrink-0 shadow-md">
              <QrCode className="w-20 h-20 text-slate-900" />
            </div>
            <div className="space-y-1 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Case ID</span>
                <span className="font-bold text-slate-100">{config.caseNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Evidence ID</span>
                <span className="font-mono text-cyan-400">{config.evidenceId}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Verdict</span>
                <span className="font-extrabold text-emerald-400">{config.verdict}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>{payload.formattedTimestamp}</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              Chain Signed
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied URL' : 'Copy Verification Link'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            Print Badge Tag
          </button>
        </div>
      </div>
    </div>
  );
};
