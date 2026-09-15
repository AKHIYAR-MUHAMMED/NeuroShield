'use client';

import React, { useState } from 'react';
import { Download, FileText, FileCode, CheckCircle2, X, ShieldAlert } from 'lucide-react';
import {
  exportToJSON,
  exportToCSV,
  triggerFileDownload,
  ForensicAuditRecord,
} from '../../utils/forensicExporter';

interface ExportAuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  records?: ForensicAuditRecord[];
}

const defaultRecords: ForensicAuditRecord[] = [
  {
    id: 'REC-2026-0915-01',
    timestamp: new Date().toISOString(),
    fileName: 'deepfake_speech_sample.wav',
    fileType: 'AUDIO',
    sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    deepfakeScore: 0.88,
    verdict: 'SYNTHETIC',
    chainOfCustodyTx: '0x3a4b91f0c29188e...',
    investigatorNotes: 'Elevated spectral centroid and unnaturally static pitch detected',
  },
  {
    id: 'REC-2026-0915-02',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    fileName: 'surveillance_camera_04.mp4',
    fileType: 'VIDEO',
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    deepfakeScore: 0.12,
    verdict: 'AUTHENTIC',
    chainOfCustodyTx: '0x17b2e91a548231c...',
  },
];

export const ExportAuditTrailModal: React.FC<ExportAuditTrailModalProps> = ({
  isOpen,
  onClose,
  records = defaultRecords,
}) => {
  const [format, setFormat] = useState<'JSON' | 'CSV'>('JSON');
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    if (format === 'JSON') {
      const content = exportToJSON(records);
      triggerFileDownload(content, `neuroshield_audit_log_${timestamp}.json`, 'application/json');
    } else {
      const content = exportToCSV(records);
      triggerFileDownload(content, `neuroshield_audit_log_${timestamp}.csv`, 'text/csv');
    }

    setExported(true);
    setTimeout(() => {
      setExported(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl text-slate-100 relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Export Audit Trail Logs</h3>
              <p className="text-xs text-slate-400">ISO 27037 Digital Evidence Format</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Preview */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-around text-center">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Total Records</div>
            <div className="text-xl font-black text-slate-100 mt-0.5">{records.length}</div>
          </div>
          <div className="border-r border-slate-800" />
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">High Risk</div>
            <div className="text-xl font-black text-red-400 mt-0.5">
              {records.filter((r) => r.verdict === 'SYNTHETIC' || r.verdict === 'MANIPULATED').length}
            </div>
          </div>
          <div className="border-r border-slate-800" />
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Chain Verified</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {records.filter((r) => r.chainOfCustodyTx).length}
            </div>
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
            Select Export Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat('JSON')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                format === 'JSON'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <FileCode className={`w-5 h-5 mt-0.5 ${format === 'JSON' ? 'text-indigo-400' : ''}`} />
              <div>
                <div className="font-bold text-sm">JSON Format</div>
                <p className="text-[11px] text-slate-400 mt-0.5">Machine-readable structured evidence payload</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat('CSV')}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                format === 'CSV'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <FileText className={`w-5 h-5 mt-0.5 ${format === 'CSV' ? 'text-indigo-400' : ''}`} />
              <div>
                <div className="font-bold text-sm">CSV Spreadsheet</div>
                <p className="text-[11px] text-slate-400 mt-0.5">Formatted for Excel, court filings & audits</p>
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={exported}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {exported ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export {format} Log
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
