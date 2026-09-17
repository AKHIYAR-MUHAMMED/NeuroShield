import { generateCourtCertificate, renderCourtCertificateText } from '../courtCertificateGenerator';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test assertion failed: ${message}`);
  }
}

export function runCourtCertificateTests() {
  console.log('[Test Suite] Running Court Certificate Generator tests...');

  // Test 1: Generate certificate
  const cert = generateCourtCertificate({
    caseNumber: 'CASE-2026-8819',
    evidenceId: 'EVID-9921',
    examinerName: 'Agent Smith',
    mediaHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    verdict: 'AUTHENTIC',
    confidenceScore: 0.96,
  });

  assert(cert.certificateId.startsWith('CERT-COURT-'), 'Certificate ID must start with CERT-COURT-');
  assert(cert.complianceStandard === 'ISO/IEC 27037:2012', 'Default compliance standard must be ISO/IEC 27037:2012');
  assert(cert.digitalSealHex.startsWith('0x'), 'Digital seal must be hex formatted with 0x prefix');

  // Test 2: Render court text document
  const textOutput = renderCourtCertificateText(cert);
  assert(textOutput.includes('CASE-2026-8819'), 'Rendered text must include case number');
  assert(textOutput.includes('NEUROSHIELD DIGITAL EVIDENCE CERTIFICATE'), 'Rendered text must include header banner');

  console.log('[Test Suite] Court certificate generator tests passed successfully.');
}
