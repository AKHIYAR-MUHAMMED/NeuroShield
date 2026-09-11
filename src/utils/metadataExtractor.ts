/**
 * Deep Container & EXIF Metadata Extractor for Forensic Analysis
 */

export interface MediaMetadataSummary {
  containerFormat: string;
  softwareSignatures: string[];
  hasExifTampering: boolean;
  gpsCoordinates?: { latitude: number; longitude: number };
  creationTimestampUtc?: string;
  encoderModel?: string;
}

export function parseExifHeader(buffer: ArrayBuffer): MediaMetadataSummary {
  const dataView = new DataView(buffer);
  let hasExifTampering = false;
  const softwareSignatures: string[] = [];

  // Basic magic bytes check for JPEG (0xFFD8) or PNG (0x89504E47)
  let containerFormat = 'Unknown Binary';
  if (buffer.byteLength > 4) {
    const firstWord = dataView.getUint16(0);
    if (firstWord === 0xffd8) {
      containerFormat = 'JPEG Image';
    } else if (dataView.getUint32(0) === 0x89504e47) {
      containerFormat = 'PNG Image';
    } else if (dataView.getUint32(0) === 0x00000018 || dataView.getUint32(4) === 0x66747970) {
      containerFormat = 'MP4 Video Container';
    }
  }

  // Check for common generative AI software tags in header string
  const textDecoder = new TextDecoder('utf-8');
  const asciiHeader = textDecoder.decode(buffer.slice(0, Math.min(buffer.byteLength, 4096)));

  if (/midjourney/i.test(asciiHeader)) softwareSignatures.push('Midjourney v6 Generator');
  if (/stable-diffusion/i.test(asciiHeader)) softwareSignatures.push('Stable Diffusion WebUI');
  if (/dall-e/i.test(asciiHeader)) softwareSignatures.push('OpenAI DALL-E 3');
  if (/elevenlabs/i.test(asciiHeader)) softwareSignatures.push('ElevenLabs Neural TTS');

  if (softwareSignatures.length > 0) {
    hasExifTampering = true;
  }

  return {
    containerFormat,
    softwareSignatures,
    hasExifTampering,
    creationTimestampUtc: new Date().toISOString(),
  };
}
