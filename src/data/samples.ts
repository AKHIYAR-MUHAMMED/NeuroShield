export interface EvidenceSample {
  id: string;
  title: string;
  type: 'image' | 'video' | 'audio' | 'document';
  datasetName: string; // e.g. FaceForensics++, Celeb-DF, ASVspoof, DocTamper
  authenticityScore: number; // 0 - 100
  verdict: 'Likely Real' | 'Manipulated / Deepfake' | 'Suspicious Anomaly';
  previewUrl: string;
  sha256Hash: string;
  blockchainId: string;
  blockNumber: number;
  timestamp: string;
  fileSize: string;
  mimeType: string;
  xaiHeatmapUrl?: string;
  evidencePoints: {
    title: string;
    description: string;
    type: 'pass' | 'fail' | 'warning';
  }[];
  metadata: Record<string, string | number | boolean>;
  fftData?: number[];
  audioWaveform?: number[];
  videoFramesCount?: number;
  suspiciousFrames?: number[];
}

export const SAMPLE_DATASETS: EvidenceSample[] = [
  {
    id: 'sample-img-01',
    title: 'Synthetic Portrait Face Swap (GAN Artifacts)',
    type: 'image',
    datasetName: 'FaceForensics++',
    authenticityScore: 12,
    verdict: 'Manipulated / Deepfake',
    previewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    blockchainId: '0xA8F3B921C47E82910D94A7129C35198FA1209B1',
    blockNumber: 19842104,
    timestamp: '2026-09-11 19:42:10 UTC',
    fileSize: '2.4 MB',
    mimeType: 'image/jpeg',
    xaiHeatmapUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    evidencePoints: [
      { title: 'GAN Frequency Anomaly', description: 'Spectral peak detected at 14.2kHz indicating StyleGAN blending artifacts.', type: 'fail' },
      { title: 'Eye Reflection Asymmetry', description: 'Irregular corneal specular highlights detected under zoom (96.4% variance).', type: 'fail' },
      { title: 'Localized Compression Diff', description: 'JPEG quantization matrix mismatch near left cheek boundary.', type: 'warning' },
      { title: 'EXIF Metadata Check', description: 'Software header missing standard camera model signatures.', type: 'fail' }
    ],
    metadata: {
      'Camera Model': 'Unknown (Stripped)',
      'Resolution': '1920x1080',
      'Color Space': 'sRGB',
      'Focal Length': '50mm (Synthesized)',
      'Software': 'Faceswap v2.4 (Detected signature)'
    },
    fftData: [45, 88, 92, 14, 76, 99, 105, 34, 12, 89, 120, 150, 40, 20]
  },
  {
    id: 'sample-img-02',
    title: 'Authentic Field Press Photograph',
    type: 'image',
    datasetName: 'Celeb-DF Control',
    authenticityScore: 96,
    verdict: 'Likely Real',
    previewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    sha256Hash: '8f4e2d1945c71b089c2a39f4e56b8201a9c3d4f10928374a5891d2c4e7b891a0',
    blockchainId: '0x7C9A4B331F890D12E4A9876543210BACFED98765',
    blockNumber: 19842110,
    timestamp: '2026-09-11 20:15:33 UTC',
    fileSize: '4.1 MB',
    mimeType: 'image/png',
    evidencePoints: [
      { title: 'Natural Lighting Consistency', description: '3D specular lighting map matches ambient environment light sources perfectly.', type: 'pass' },
      { title: 'No GAN Frequency Spikes', description: 'FFT power spectrum exhibits standard natural image 1/f spatial decay.', type: 'pass' },
      { title: 'Biological Pulse Estimation (rPPG)', description: 'Subtle facial skin micro-color variations confirm live capillary blood flow (74 BPM).', type: 'pass' },
      { title: 'Authentic EXIF Header', description: 'Validated Canon EOS R5 hardware sensor serial #8920194.', type: 'pass' }
    ],
    metadata: {
      'Camera Model': 'Canon EOS R5',
      'Lens': 'RF 85mm f/1.2L USM',
      'ISO': '200',
      'Shutter Speed': '1/500s',
      'GPS Location': '37.7749° N, 122.4194° W'
    },
    fftData: [90, 65, 42, 28, 19, 12, 8, 5, 3, 2]
  },
  {
    id: 'sample-vid-01',
    title: 'Deepfake Executive Speech Video',
    type: 'video',
    datasetName: 'DFDC Challenge',
    authenticityScore: 18,
    verdict: 'Manipulated / Deepfake',
    previewUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    sha256Hash: '7a9c8b2d1e0f438927164a5c0b9e8f7d6a5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a',
    blockchainId: '0x3D81E992A7B40F11C8E91A0023456789ABCDEF01',
    blockNumber: 19842118,
    timestamp: '2026-09-11 20:48:19 UTC',
    fileSize: '24.8 MB',
    mimeType: 'video/mp4',
    videoFramesCount: 240,
    suspiciousFrames: [42, 43, 44, 89, 102, 103, 104, 185],
    evidencePoints: [
      { title: 'Temporal Boundary Jitter', description: 'Facial contour boundary displays 12px spatial frame displacement at frame #43.', type: 'fail' },
      { title: 'Unnatural Blink Rate', description: 'Zero blinks detected across 10-second segment (Statistical probability < 0.1%).', type: 'fail' },
      { title: 'Optical Flow Discontinuity', description: 'Background motion vectors decouple from head pose movement near collar boundary.', type: 'warning' },
      { title: 'Audio-Visual Lip Sync Offset', description: 'Phoneme /m/ visual closure precedes acoustic sound by 140ms.', type: 'fail' }
    ],
    metadata: {
      'Video Codec': 'H.264 / AVC',
      'Frame Rate': '29.97 fps',
      'Duration': '00:00:15',
      'Resolution': '1920x1080',
      'Audio Codec': 'AAC 48kHz'
    }
  },
  {
    id: 'sample-aud-01',
    title: 'AI Voice Clone (Wav2Vec2 Vocoder Anomaly)',
    type: 'audio',
    datasetName: 'ASVspoof 2024',
    authenticityScore: 24,
    verdict: 'Manipulated / Deepfake',
    previewUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    sha256Hash: '4b3a2f1e0d9c8b7a6f5e4d3c2b1a0987654321fedcba0987654321abcdef0123',
    blockchainId: '0xE129A884C001F2239845AD09876543210FEDCBA9',
    blockNumber: 19842125,
    timestamp: '2026-09-11 21:02:00 UTC',
    fileSize: '1.8 MB',
    mimeType: 'audio/wav',
    audioWaveform: [10, 45, 80, 20, -40, -90, 15, 65, 95, 30, -50, -85, 10, 50, 85],
    evidencePoints: [
      { title: 'Neural Vocoder Phase Artifacts', description: 'High-frequency energy spikes (>16kHz) characteristic of ElevenLabs / Bark TTS.', type: 'fail' },
      { title: 'Phoneme Pitch Flatness', description: 'Zero micro-tremor in fundamental frequency F0 across sustained vowel /a/.', type: 'fail' },
      { title: 'Synthetic Respiratory Gap', description: 'Missing natural physiological breathing pauses between sentences.', type: 'warning' }
    ],
    metadata: {
      'Sample Rate': '44.1 kHz',
      'Bit Depth': '16-bit PCM',
      'Channels': 'Mono',
      'Estimated Model': 'ElevenLabs Multilingual v2 Voice Clone'
    }
  },
  {
    id: 'sample-doc-01',
    title: 'Forged Financial Bank Statement (DocTamper)',
    type: 'document',
    datasetName: 'DocTamper Benchmark',
    authenticityScore: 29,
    verdict: 'Manipulated / Deepfake',
    previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    sha256Hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    blockchainId: '0x9901A832BC71940EAA6102934857102938475102',
    blockNumber: 19842131,
    timestamp: '2026-09-11 21:20:11 UTC',
    fileSize: '1.2 MB',
    mimeType: 'application/pdf',
    evidencePoints: [
      { title: 'Font Subsetting Anomaly', description: 'Helvetica Bold character width in field "$450,000" differs by 0.4pt from document master.', type: 'fail' },
      { title: 'PDF Layer Stamp Tampering', description: 'Overlay vector text object created 4 months after initial PDF compilation date.', type: 'fail' },
      { title: 'Digital Signature Status', description: 'PKCS#7 Certificate checksum corrupted / self-signed unknown CA.', type: 'fail' },
      { title: 'Localized Pixel Noise Mismatch', description: 'JPEG ELA analysis highlights numeric edit box in account balance region.', type: 'fail' }
    ],
    metadata: {
      'PDF Producer': 'Adobe Acrobat Pro 2024 (Modified)',
      'Creation Date': '2026-01-15 10:20:00',
      'Modification Date': '2026-05-18 14:02:11',
      'Digital Signature': 'Invalid / Tampered Certificate'
    }
  }
];
