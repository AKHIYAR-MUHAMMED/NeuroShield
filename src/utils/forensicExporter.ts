/**
 * Forensic Evidence Audit Trail Export Utilities
 * Handles formatting and browser triggers for JSON, CSV, and ISO 27037 compliance logs.
 */

export interface ForensicAuditRecord {
  id: string;
  timestamp: string;
  fileName: string;
  fileType: 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT';
  sha256Hash: string;
  deepfakeScore: number; // 0.0 to 1.0
  verdict: 'AUTHENTIC' | 'SUSPECT' | 'MANIPULATED' | 'SYNTHETIC';
  chainOfCustodyTx?: string;
  investigatorNotes?: string;
}

export interface ExportOptions {
  includeSignatures?: boolean;
  prettyPrintJSON?: boolean;
}

/**
 * Converts forensic audit records into formatted JSON string.
 */
export function exportToJSON(
  records: ForensicAuditRecord[],
  options: ExportOptions = { prettyPrintJSON: true }
): string {
  const payload = {
    exportedAt: new Date().toISOString(),
    standard: 'ISO 27037 Digital Evidence Handling',
    recordCount: records.length,
    records,
  };

  return options.prettyPrintJSON
    ? JSON.stringify(payload, null, 2)
    : JSON.stringify(payload);
}

/**
 * Escapes CSV values to protect against injection and handle quotes/commas properly.
 */
export function escapeCSVCell(value: string | number | undefined): string {
  if (value === undefined || value === null) return '""';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converts forensic audit records into clean RFC 4180 CSV format.
 */
export function exportToCSV(records: ForensicAuditRecord[]): string {
  const headers = [
    'Record ID',
    'Timestamp',
    'File Name',
    'Media Type',
    'SHA-256 Hash',
    'Deepfake Score (%)',
    'Verdict',
    'Blockchain Tx ID',
    'Investigator Notes',
  ];

  const rows = records.map((r) => [
    escapeCSVCell(r.id),
    escapeCSVCell(r.timestamp),
    escapeCSVCell(r.fileName),
    escapeCSVCell(r.fileType),
    escapeCSVCell(r.sha256Hash),
    escapeCSVCell((r.deepfakeScore * 100).toFixed(1)),
    escapeCSVCell(r.verdict),
    escapeCSVCell(r.chainOfCustodyTx || 'N/A'),
    escapeCSVCell(r.investigatorNotes || ''),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

/**
 * Triggers a web browser download for generated report files.
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
