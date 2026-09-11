/**
 * NeuroShield Forensic Data Structures & Interface Definitions
 * Standardized across ISO/IEC 27037 digital evidence preservation layers.
 */

export type ConfidenceScore = number; // 0.0 to 1.0

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'AUTHENTIC';

export interface SpectralAnalysisResult {
  frequencyPeakHz: number;
  fftAnomalyScore: number;
  nyquistDistortionIndex: number;
  isVocoderArtifactDetected: boolean;
}

export interface BiologicalSignalMetrics {
  rPpgPulseBpm: number;
  microExpressionVariance: number;
  blinkRatePerMinute: number;
  gazeAsymmetryAngleDegrees: number;
  isLiveHuman: boolean;
}

export interface CryptographicEvidenceNode {
  evidenceHash: string;
  previousBlockHash: string;
  blockIndex: number;
  timestampUtc: string;
  custodianSignature: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'CORRUPTED';
}

export interface DetailedForensicReport {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  sha256Hash: string;
  authenticityScore: ConfidenceScore;
  threatLevel: ThreatLevel;
  spectralAnalysis: SpectralAnalysisResult;
  biologicalMetrics: BiologicalSignalMetrics;
  evidenceNode: CryptographicEvidenceNode;
  createdAt: string;
}
