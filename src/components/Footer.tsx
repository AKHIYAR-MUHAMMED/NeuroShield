'use client';

import React from 'react';
import { Shield, Lock, FileCheck, CheckCircle2, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-slate-200 text-sm tracking-wide">NeuroShield Engine</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Multi-Modal Deepfake & Evidence Verification Engine. Combines PyTorch, Vision Transformers, Grad-CAM XAI, and Smart Contracts for court-admissible audit trails.
            </p>
            <div className="flex items-center space-x-2 text-emerald-400 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>FRE Rule 902(14) Compliant Audit Trail</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">AI Frameworks</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>EfficientNet-B7 Face Swapping Detector</li>
              <li>Vision Transformer (ViT-L/14) Frequency Analyzer</li>
              <li>Wav2Vec2 + Whisper Audio Synthetics</li>
              <li>Grad-CAM & SHAP Visual Heatmaps</li>
              <li>Spatial Error Level Analysis (ELA)</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Blockchain Ledger</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>SHA-256 Cryptographic Payload Fingerprinting</li>
              <li>Polygon / Ethereum Sepolia Smart Contract</li>
              <li>IPFS Decentralized Media Storage CID</li>
              <li>Zero-Knowledge Audit Trail Proofs</li>
              <li>QR Code Public Certificate Verification</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">Target Domain Support</h4>
            <div className="space-y-2">
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg flex items-start space-x-2">
                <Lock className="w-4 h-4 text-cyan-400 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-medium block">Digital Forensics & Law Enforcement</span>
                  <span className="text-[10px] text-slate-400">Court-ready evidence chain of custody</span>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg flex items-start space-x-2">
                <FileCheck className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <span className="text-slate-200 font-medium block">Journalism & Media Trust</span>
                  <span className="text-[10px] text-slate-400">Instant verification before broadcasting</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <div>
            © 2026 NeuroShield Platform. Developed as a Final-Year Capstone Project.
          </div>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0 font-mono">
            <span className="flex items-center space-x-1">
              <Terminal className="w-3 h-3 text-cyan-400" />
              <span>Block: #19842131</span>
            </span>
            <span>Latency: 14ms</span>
            <span>Status: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
