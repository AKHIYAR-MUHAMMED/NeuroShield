/**
 * Internationalized Forensic Terms & Multi-Language Dictionary
 * Supports English, Spanish, French, and German legal terminology.
 */

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de';

export interface ForensicTranslationDictionary {
  courtCertificate: string;
  chainOfCustody: string;
  blockchainVerification: string;
  authenticMedia: string;
  syntheticManipulated: string;
  digitalEvidenceHash: string;
  admissibilityStandard: string;
}

export const FORENSIC_DICTIONARY: Record<SupportedLanguage, ForensicTranslationDictionary> = {
  en: {
    courtCertificate: 'Court-Admissible Forensic Certificate',
    chainOfCustody: 'Verifiable Chain of Custody',
    blockchainVerification: 'Immutable Blockchain Verification',
    authenticMedia: 'Authentic Human Media',
    syntheticManipulated: 'Synthetic AI Deepfake Detected',
    digitalEvidenceHash: 'SHA-256 Cryptographic Hash',
    admissibilityStandard: 'ISO/IEC 27037 & FRE Rule 902(14)',
  },
  es: {
    courtCertificate: 'Certificado Forense Admisible en Juicio',
    chainOfCustody: 'Cadena de Custodia Verificable',
    blockchainVerification: 'Verificación Inmutable en Cadena de Bloques',
    authenticMedia: 'Medio Humano Auténtico',
    syntheticManipulated: 'Deepfake Sintético de IA Detectado',
    digitalEvidenceHash: 'Hash Criptográfico SHA-256',
    admissibilityStandard: 'ISO/IEC 27037 y Regla FRE 902(14)',
  },
  fr: {
    courtCertificate: 'Certificat Forensic Admissible en Justice',
    chainOfCustody: 'Chaîne de Custodie Vérifiable',
    blockchainVerification: 'Vérification Blockchain Immuable',
    authenticMedia: 'Média Humain Authentique',
    syntheticManipulated: 'Deepfake IA Synthétique Détecté',
    digitalEvidenceHash: 'Hachage Cryptographique SHA-256',
    admissibilityStandard: 'Norme ISO/IEC 27037 & FRE Règle 902(14)',
  },
  de: {
    courtCertificate: 'Gerichtsverwertbares Forensisches Zertifikat',
    chainOfCustody: 'Verifizierbare Aufbewahrungskette',
    blockchainVerification: 'Unveränderliche Blockchain-Verifizierung',
    authenticMedia: 'Authentisches Menschliches Medium',
    syntheticManipulated: 'Synthetischer KI-Deepfake Erkannt',
    digitalEvidenceHash: 'SHA-256 Kryptografischer Hash',
    admissibilityStandard: 'ISO/IEC 27037 & FRE Regel 902(14)',
  },
};

export function getForensicTerm(
  termKey: keyof ForensicTranslationDictionary,
  lang: SupportedLanguage = 'en'
): string {
  return FORENSIC_DICTIONARY[lang]?.[termKey] || FORENSIC_DICTIONARY['en'][termKey];
}
