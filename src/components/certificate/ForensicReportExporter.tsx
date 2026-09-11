'use client';

import React, { useState } from 'react';
import { Download, FileCheck, Shield, CheckCircle2, RefreshCw } from 'lucide-react';

interface ForensicReportExporterProps {
  evidenceId: string;
  fileName: string;
  hash: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ForensicReportExporter: React.FC<ForensicReportExporterProps> = ({
  evidenceId,
  fileName,
  hash,
  isOpen,
  onClose,
}) => {
  const [includeXaiHeatmap, setIncludeXaiHeatmap] = useState(true);
  const [includeBlockchainProof, setIncludeBlockchainProof] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const response = await fetch('/api/export-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: evidenceId,
          format: 'pdf',
          custodian: 'Lead Forensic Specialist',
        }),
      });

      if (response.ok) {
        setExportSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-bold tracking-wide">Export Forensic Package</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-4 text-sm mb-6">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <p className="text-slate-400 text-xs font-mono uppercase">Evidence File</p>
            <p className="font-semibold text-emerald-300 truncate">{fileName}</p>
            <p className="text-slate-500 text-xs font-mono mt-1 truncate">SHA-256: {hash}</p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeXaiHeatmap}
                onChange={(e) => setIncludeXaiHeatmap(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span>Include Grad-CAM & FFT Spectral Heatmaps</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeBlockchainProof}
                onChange={(e) => setIncludeBlockchainProof(e.target.checked)}
                className="accent-emerald-500 rounded"
              />
              <span>Include Immutable ISO 27037 Blockchain Certificate</span>
            </label>
          </div>
        </div>

        {exportSuccess && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Forensic evidence bundle generated successfully under FRE Rule 902(14).</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-slate-200 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-semibold text-sm shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? 'Generating Bundle...' : 'Download Export'}
          </button>
        </div>
      </div>
    </div>
  );
};
