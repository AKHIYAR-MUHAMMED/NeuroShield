'use client';

import React, { useState } from 'react';
import { QrCode, Search, ShieldCheck, CheckCircle2, AlertTriangle, ExternalLink, ArrowRight, Lock } from 'lucide-react';
import { SAMPLE_DATASETS, EvidenceSample } from '@/data/samples';
import QRCode from 'qrcode';

interface QrVerifierProps {
  customResults: EvidenceSample[];
  onSelectSample: (sample: EvidenceSample) => void;
}

export const QrVerifier: React.FC<QrVerifierProps> = ({ customResults, onSelectSample }) => {
  const [searchHash, setSearchHash] = useState<string>('');
  const [searched, setSearched] = useState<boolean>(false);
  const [resultSample, setResultSample] = useState<EvidenceSample | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const allRecords = [...customResults, ...SAMPLE_DATASETS];

  const handleVerify = async (queryHash?: string) => {
    const term = (queryHash || searchHash).trim();
    if (!term) return;

    setSearched(true);
    const match = allRecords.find(r => 
      r.sha256Hash.toLowerCase() === term.toLowerCase() ||
      r.blockchainId.toLowerCase() === term.toLowerCase() ||
      r.id.toLowerCase() === term.toLowerCase()
    ) || allRecords[0]; // Fallback match for demo query

    setResultSample(match);

    // Generate real QR code image for this record
    try {
      const url = await QRCode.toDataURL(`https://neuroshield.verifier/verify/${match.sha256Hash}`);
      setQrCodeDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>Public Zero-Knowledge Verification Portal</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Verify Any SHA-256 Evidence Certificate
        </h2>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Enter any media SHA-256 hash or scan the QR code printed on a Court Audit Certificate to query its immutable record on Polygon POS.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Paste SHA-256 Hash or Blockchain Transaction ID (e.g. e3b0c442...)"
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-32 py-3.5 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500 shadow-inner"
          />
          <button
            onClick={() => handleVerify()}
            className="absolute right-2 top-2 bottom-2 px-5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow"
          >
            <Search className="w-4 h-4" />
            <span>Verify Hash</span>
          </button>
        </div>

        {/* Quick Demo Links */}
        <div className="flex flex-wrap items-center space-x-2 text-xs text-slate-400">
          <span>Try Demo Hashes:</span>
          {SAMPLE_DATASETS.slice(0, 3).map((sample) => (
            <button
              key={sample.id}
              onClick={() => {
                setSearchHash(sample.sha256Hash);
                handleVerify(sample.sha256Hash);
              }}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-cyan-400 font-mono text-[11px] transition"
            >
              {sample.sha256Hash.substring(0, 10)}...
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Card */}
      {searched && resultSample && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-2xl ${
                resultSample.authenticityScore >= 60 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Blockchain Evidence Match Found</span>
                <h3 className="text-xl font-bold text-white">{resultSample.title}</h3>
                <span className="text-xs text-slate-400">Recorded on {resultSample.timestamp}</span>
              </div>
            </div>

            <button
              onClick={() => onSelectSample(resultSample)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
            >
              <span>View Full Court Certificate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Column 1: QR Code Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
              <span className="text-xs font-semibold text-slate-300">Scannable QR Verification Seal</span>
              {qrCodeDataUrl ? (
                <div className="bg-white p-3 rounded-xl shadow-md">
                  <img src={qrCodeDataUrl} alt="QR Verification Code" className="w-36 h-36" />
                </div>
              ) : (
                <QrCode className="w-36 h-36 text-slate-700" />
              )}
              <span className="text-[10px] font-mono text-slate-500 text-center">
                Scan to verify on Polygon Mainnet
              </span>
            </div>

            {/* Column 2: Metadata Details */}
            <div className="md:col-span-2 space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Authenticity Score:</span>
                  <span className={`font-bold font-mono px-2 py-0.5 rounded ${
                    resultSample.authenticityScore >= 60 ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                  }`}>
                    {resultSample.authenticityScore}% ({resultSample.verdict})
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400">SHA-256 Fingerprint:</span>
                  <span className="font-mono text-cyan-400 text-[11px] truncate max-w-[240px]">{resultSample.sha256Hash}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-400">Blockchain TxID:</span>
                  <span className="font-mono text-slate-300 text-[11px]">{resultSample.blockchainId}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Block Number:</span>
                  <span className="font-mono text-slate-300">#{resultSample.blockNumber}</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
