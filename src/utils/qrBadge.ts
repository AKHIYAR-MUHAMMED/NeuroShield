/**
 * QR Code Verification Badge Generator Utility
 * Formats court-ready evidence payloads and verification URLs for ISO 27037 QR tags.
 */

export interface QREvidenceBadgeConfig {
  evidenceId: string;
  sha256Hash: string;
  verdict: 'AUTHENTIC' | 'SUSPECT' | 'MANIPULATED' | 'SYNTHETIC';
  caseNumber?: string;
  investigatorId?: string;
  timestampUtc?: string;
}

export interface QREvidenceBadgePayload {
  badgeId: string;
  verificationUrl: string;
  qrPayloadString: string;
  securityHashPrefix: string;
  formattedTimestamp: string;
}

/**
 * Builds the canonical public verification URL for a given evidence hash.
 */
export function generateEvidenceVerificationUrl(
  sha256Hash: string,
  caseNumber?: string
): string {
  const baseUrl = 'https://neuroshield.app/verify';
  const query = new URLSearchParams({ hash: sha256Hash });
  if (caseNumber) query.append('case', caseNumber);
  return `${baseUrl}?${query.toString()}`;
}

/**
 * Formats structured court evidence payload for QR code rendering.
 */
export function formatCourtBadgePayload(
  config: QREvidenceBadgeConfig
): QREvidenceBadgePayload {
  const timestamp = config.timestampUtc || new Date().toISOString();
  const verificationUrl = generateEvidenceVerificationUrl(config.sha256Hash, config.caseNumber);

  const qrPayloadString = JSON.stringify({
    evId: config.evidenceId,
    hash: config.sha256Hash,
    verdict: config.verdict,
    case: config.caseNumber || 'UNASSIGNED',
    ts: timestamp,
  });

  return {
    badgeId: `QR-TAG-${config.evidenceId}`,
    verificationUrl,
    qrPayloadString,
    securityHashPrefix: config.sha256Hash.slice(0, 12).toUpperCase(),
    formattedTimestamp: new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    }),
  };
}
