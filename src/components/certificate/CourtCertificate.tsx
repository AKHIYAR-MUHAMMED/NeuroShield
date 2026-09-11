'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Printer, CheckCircle2, AlertTriangle, Lock, FileCheck, QrCode, Sparkles, RefreshCw, Scale } from 'lucide-react';
import { EvidenceSample } from '@/data/samples';
import { requestOpenAiAnalysis, OpenAiTestimonyResult } from '@/utils/openai';
import QRCode from 'qrcode';

interface CourtCertificateProps {
  sample: EvidenceSample;
  onBack?: () => void;
}

export const CourtCertificate: React.FC<CourtCertificateProps> = ({ sample, onBack }) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [testimonyData, setTestimonyData] = useState<OpenAiTestimonyResult | null>(null);
  const [loadingTestimony, setLoadingTestimony] = useState<boolean>(false);
  const [showTestimonyModal, setShowTestimonyModal] = useState<boolean>(false);

  useEffect(() => {
    QRCode.toDataURL(`https://neuroshield.verifier/verify/${sample.sha256Hash}`)
      .then(url => setQrUrl(url))
      .catch(console.error);
  }, [sample]);

  const isAuthentic = sample.authenticityScore >= 60;

  const handleGenerateTestimony = async () => {
    setShowTestimonyModal(true);
    if (testimonyData) return;

    setLoadingTestimony(true);
    const res = await requestOpenAiAnalysis<OpenAiTestimonyResult>('generate_testimony', { evidence: sample });
    setLoadingTestimony(false);

    if (res.success && res.data) {
      setTestimonyData(res.data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Action Header */}
      <div className="flex items-center justify-between print:hidden">
        {onBack && (
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            ← Back to Overview
          </button>
        )}

        <div className="flex items-center space-x-3">
          <button
            onClick={handleGenerateTestimony}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-bold text-xs flex items-center space-x-1.5 shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Generate OpenAI Expert Testimony</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print Court Certificate</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Container */}
      <div className="bg-slate-950 border-4 border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:border-black">
        
        {/* Subtle Watermark BG */}
        <div className="absolute right-[-80px] bottom-[-80px] opacity-5 pointer-events-none">
          <Shield className="w-96 h-96 text-cyan-400" />
        </div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-slate-800 pb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-wider uppercase text-white print:text-black">
                NeuroShield Platform
              </h1>
              <p className="text-xs font-semibold text-cyan-400 print:text-blue-700">
                Digital Forensics & Court-Ready Evidence Certificate
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5 print:text-gray-600">
                Federal Rules of Evidence Rule 902(14) Compliant Certification
              </span>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 print:text-gray-800 space-y-1">
            <div className="font-bold text-white print:text-black">CERTIFICATE ID</div>
            <div className="text-cyan-400 print:text-blue-700">NS-CERT-2026-9042</div>
            <div className="text-[10px] text-slate-500 print:text-gray-500">Issued: {sample.timestamp}</div>
          </div>
        </div>

        {/* Verdict Callout Banner */}
        <div className={`p-6 rounded-2xl border-2 flex items-center justify-between ${
          isAuthentic
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 print:bg-emerald-50 print:border-emerald-600 print:text-emerald-900'
            : 'bg-rose-950/40 border-rose-500/50 text-rose-300 print:bg-rose-50 print:border-rose-600 print:text-rose-900'
        }`}>
          <div className="flex items-center space-x-4">
            {isAuthentic ? <CheckCircle2 className="w-10 h-10 text-emerald-400" /> : <AlertTriangle className="w-10 h-10 text-rose-400" />}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider block opacity-75">
                Official Authenticity Verdict
              </span>
              <h2 className="text-2xl font-black text-white print:text-black">
                {sample.verdict} ({sample.authenticityScore}% Score)
              </h2>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="block text-[10px] uppercase text-slate-400">Analysis Engine</span>
            <span className="font-bold text-white print:text-black">PyTorch ViT-L/14 Ensemble</span>
          </div>
        </div>

        {/* Evidence Metadata & Chain of Custody */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          <div className="space-y-3 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 print:bg-gray-50 print:border-gray-300">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center space-x-1.5 print:text-black">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Digital Media Payload Specification</span>
            </h3>

            <div className="space-y-2 font-mono text-slate-300 print:text-black">
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-gray-600">File Name:</span>
                <span className="font-semibold">{sample.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-gray-600">MIME Type:</span>
                <span>{sample.mimeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-gray-600">File Size:</span>
                <span>{sample.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-gray-600">Dataset Benchmark:</span>
                <span>{sample.datasetName}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 print:bg-gray-50 print:border-gray-300">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center space-x-1.5 print:text-black">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Blockchain On-Chain Registry</span>
            </h3>

            <div className="space-y-2 font-mono text-slate-300 print:text-black">
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-gray-600">Ledger Network:</span>
                <span className="font-semibold text-emerald-400 print:text-emerald-800">Polygon POS Mainnet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-gray-600">Block Height:</span>
                <span>#{sample.blockNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-gray-600">TxID:</span>
                <span className="text-cyan-400 print:text-blue-800 truncate max-w-[160px]">{sample.blockchainId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-gray-600">SHA-256 Hash:</span>
                <span className="truncate max-w-[160px]">{sample.sha256Hash}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Forensic Evidence Points */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs print:text-black">
            Forensic Findings & Explainable AI (XAI) Attributions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {sample.evidencePoints.map((pt, i) => (
              <div 
                key={i}
                className="p-3.5 rounded-xl border bg-slate-900 border-slate-800 space-y-1 print:bg-white print:border-gray-300"
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-200 print:text-black">{pt.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                    pt.type === 'fail' ? 'bg-rose-950 text-rose-300 print:bg-rose-100 print:text-rose-900' : 'bg-emerald-950 text-emerald-300 print:bg-emerald-100 print:text-emerald-900'
                  }`}>
                    {pt.type}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] print:text-gray-600">{pt.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom QR Verification & Seal Signature */}
        <div className="pt-6 border-t-2 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 print:border-gray-400">
          
          <div className="flex items-center space-x-4">
            {qrUrl ? (
              <div className="bg-white p-2 rounded-xl shadow-md">
                <img src={qrUrl} alt="QR Code" className="w-24 h-24" />
              </div>
            ) : (
              <QrCode className="w-24 h-24 text-slate-600" />
            )}
            <div className="text-xs space-y-1 text-slate-400 print:text-gray-700">
              <span className="font-bold text-slate-200 block print:text-black">Public Chain Verification</span>
              <p className="text-[11px]">Scan QR code with any camera to load live Polygon ledger state</p>
              <span className="font-mono text-[10px] text-cyan-400 print:text-blue-700">SHA-256: {sample.sha256Hash.substring(0, 16)}...</span>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-2">
            <div className="inline-block border-2 border-cyan-500/50 p-2 rounded-full bg-cyan-950/40 text-cyan-400 font-bold text-[11px] uppercase tracking-wider print:border-blue-600 print:text-blue-900">
              ★ Official NeuroShield Cryptographic Seal ★
            </div>
            <p className="text-[10px] text-slate-500 print:text-gray-500">
              Authorized Digital Signature #9042-FRE-2026
            </p>
          </div>

        </div>

      </div>

      {/* OpenAI Expert Testimony Modal */}
      {showTestimonyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn print:hidden">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative text-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Scale className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">OpenAI Certified Expert Witness Statement</h3>
                  <p className="text-xs text-slate-400">Federal Rule of Evidence 902(14) Affidavit & Cross-Examination Q&A</p>
                </div>
              </div>
              <button
                onClick={() => setShowTestimonyModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Close
              </button>
            </div>

            {loadingTestimony ? (
              <div className="p-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-mono">Drafting sworn forensic witness statement & cross-examination defense via GPT-4o...</p>
              </div>
            ) : testimonyData ? (
              <div className="space-y-6 text-xs text-slate-300">
                {/* Sworn Statement Affidavit */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-cyan-400 text-xs uppercase tracking-wider block">Sworn Affidavit of Forensics Examiner</span>
                  <p className="text-slate-200 leading-relaxed font-serif italic text-sm border-l-2 border-cyan-500 pl-4 py-1">
                    &ldquo;{testimonyData.witnessStatement}&rdquo;
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono pt-1">{testimonyData.iso27037ComplianceNote}</p>
                </div>

                {/* Cross Examination Preparation */}
                <div className="space-y-3">
                  <span className="font-bold text-white text-sm uppercase tracking-wider block">Courtroom Cross-Examination Preparation (Attack & Defense Lines)</span>
                  <div className="space-y-3">
                    {testimonyData.courtroomCrossExamQnA.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="font-semibold text-rose-300 flex items-start space-x-2">
                          <span className="text-rose-500 font-mono shrink-0">Q{idx + 1}:</span>
                          <span>{item.question}</span>
                        </div>
                        <div className="text-slate-300 pl-6 border-l border-emerald-500/50 space-y-1">
                          <span className="text-emerald-400 font-bold text-[10px] block uppercase">Certified Response:</span>
                          <p className="leading-relaxed">{item.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

          </div>
        </div>
      )}

    </div>
  );
};
