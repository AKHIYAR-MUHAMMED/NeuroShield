import {
  exportToJSON,
  exportToCSV,
  escapeCSVCell,
  ForensicAuditRecord,
} from '../forensicExporter';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test assertion failed: ${message}`);
  }
}

export function runForensicExporterTests() {
  console.log('[Test Suite] Running Forensic Evidence Exporter tests...');

  const sampleRecords: ForensicAuditRecord[] = [
    {
      id: 'EV-001',
      timestamp: '2026-09-15T12:00:00Z',
      fileName: 'surveillance_feed.mp4',
      fileType: 'VIDEO',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      deepfakeScore: 0.94,
      verdict: 'SYNTHETIC',
      chainOfCustodyTx: '0x8f3c92a1b...',
      investigatorNotes: 'Detected deepfake facial swap on frame 42',
    },
    {
      id: 'EV-002',
      timestamp: '2026-09-15T12:05:00Z',
      fileName: 'voicemail_clip.wav',
      fileType: 'AUDIO',
      sha256Hash: 'ca978112ca1bbdcafac231b39a23dac401ea1027228e73e2e3193d235d7b94b7',
      deepfakeScore: 0.05,
      verdict: 'AUTHENTIC',
    },
  ];

  // Test 1: CSV Cell Escaping
  assert(escapeCSVCell('simple') === 'simple', 'Simple text should not be escaped');
  assert(escapeCSVCell('hello, world') === '"hello, world"', 'Commas must be enclosed in quotes');
  assert(escapeCSVCell('say "hello"') === '"say ""hello"""', 'Double quotes must be escaped');

  // Test 2: JSON Export Structure
  const jsonStr = exportToJSON(sampleRecords);
  const parsed = JSON.parse(jsonStr);
  assert(parsed.recordCount === 2, 'JSON output recordCount must equal 2');
  assert(parsed.standard.includes('ISO 27037'), 'JSON output must reference ISO 27037');
  assert(parsed.records[0].id === 'EV-001', 'First record ID must match');

  // Test 3: CSV Export Structure
  const csvStr = exportToCSV(sampleRecords);
  const lines = csvStr.split('\n');
  assert(lines.length === 3, 'CSV output must have 1 header line + 2 record lines');
  assert(lines[0].startsWith('Record ID,Timestamp'), 'CSV header must start with Record ID');
  assert(lines[1].includes('EV-001'), 'CSV row 1 must contain EV-001');
  assert(lines[1].includes('94.0'), 'CSV deepfake score percentage must format correctly');

  console.log('[Test Suite] All forensic evidence exporter tests passed successfully.');
}
