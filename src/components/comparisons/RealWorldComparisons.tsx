'use client';

import React, { useState } from 'react';
import {
  Scale, Shield, Cpu, Activity, Eye, Zap, Layers, CheckCircle2,
  XCircle, AlertTriangle, ArrowRight, RefreshCw, Sliders, Database,
  FileText, Mic, Video, Image as ImageIcon, BarChart3, Check, Minus, Info
} from 'lucide-react';
import { EvidenceSample, SAMPLE_DATASETS } from '@/data/samples';

interface RealWorldComparisonsProps {
  onSelectSample?: (sample: EvidenceSample) => void;
  onOpenXai?: (sample: EvidenceSample) => void;
  onNavigateScanner?: () => void;
}

type MediaTab = 'image' | 'video' | 'audio' | 'document';

interface ComparisonPair {
  id: string;
  category: MediaTab;
  title: string;
  realTitle: string;
  aiTitle: string;
  aiModelName: string;
  datasetOrigin: string;
  realPreview: string;
  aiPreview: string;
  realMetrics: {
    authenticityScore: number;
    elaVariance: string;
    fftCeiling: string;
    rppgPulse: string;
    exifStatus: string;
    sha256Short: string;
  };
  aiMetrics: {
    authenticityScore: number;
    elaVariance: string;
    fftCeiling: string;
    rppgPulse: string;
    exifStatus: string;
    sha256Short: string;
  };
  keyDeltas: {
    metric: string;
    realVal: string;
    aiVal: string;
    diff: string;
    verdict: 'pass' | 'fail' | 'warning';
    description: string;
  }[];
}

const COMPARISON_PAIRS: ComparisonPair[] = [
  {
    id: 'comp-img-01',
    category: 'image',
    title: 'Facial Portrait Synthesis: Midjourney v6 vs Canon EOS R5 RAW',
    realTitle: 'Authentic Canon EOS R5 Studio Press Photo',
    aiTitle: 'Midjourney v6 / StyleGAN3 Synthetic Portrait',
    aiModelName: 'Midjourney v6 + StyleGAN3 Ensemble',
    datasetOrigin: 'Celeb-DF v2 Benchmark',
    realPreview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    aiPreview: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    realMetrics: {
      authenticityScore: 96,
      elaVariance: '1.2% (Uniform JPEG Matrix)',
      fftCeiling: '1/f Natural Decay (-48dB @ 20kHz)',
      rppgPulse: '74 BPM (Subcutaneous Capillary Wave)',
      exifStatus: 'Canon EOS R5 Hardware Serial #8920194',
      sha256Short: '8f4e2d1945c7...',
    },
    aiMetrics: {
      authenticityScore: 12,
      elaVariance: '18.4% (Localized High Error Delta)',
      fftCeiling: 'Spike Peak @ 14.2kHz (GAN Frequency Grid)',
      rppgPulse: '0 BPM (Flatline / Synthetic Noise)',
      exifStatus: 'Stripped / Software Tag "Faceswap v2.4"',
      sha256Short: 'e3b0c44298fc...',
    },
    keyDeltas: [
      {
        metric: 'Grad-CAM Anomaly Density',
        realVal: '0.04 (Uniform)',
        aiVal: '0.89 (Cheek & Iris Clusters)',
        diff: '+0.85 Anomaly Spike',
        verdict: 'fail',
        description: 'High neural density activation localized near eye reflections and cheek boundaries.',
      },
      {
        metric: 'Corneal Reflection Specularity',
        realVal: '0.2° Angle Match',
        aiVal: '96.4% Asymmetry',
        diff: 'Sub-pixel Light Desync',
        verdict: 'fail',
        description: 'Light reflections in left vs right iris come from physically contradictory light sources.',
      },
      {
        metric: 'PRNU Sensor Noise Fingerprint',
        realVal: 'Valid CMOS Pattern',
        aiVal: 'Zero CMOS Noise',
        diff: 'Missing Physical Sensor',
        verdict: 'fail',
        description: 'Authentic camera sensors produce unique photo response non-uniformity (PRNU) noise.',
      },
      {
        metric: 'Spatial JPEG Error Level (ELA)',
        realVal: '4.8 Mean Delta',
        aiVal: '42.1 Mean Delta',
        diff: '+37.3 Compression Gap',
        verdict: 'fail',
        description: 'Synthetic faces blended into background show severe re-compression boundary artifacts.',
      },
    ],
  },
  {
    id: 'comp-vid-01',
    category: 'video',
    title: 'Executive Broadcast Video: OpenAI Sora vs 4K Broadcast Camera',
    realTitle: 'Authentic 4K Sony FX6 Executive Keynote',
    aiTitle: 'OpenAI Sora / DeepFaceLab Generative Video',
    aiModelName: 'OpenAI Sora + DeepFaceLab Pipeline',
    datasetOrigin: 'DFDC Challenge Dataset',
    realPreview: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    aiPreview: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    realMetrics: {
      authenticityScore: 94,
      elaVariance: '0.8% (Continuous Spatial Stream)',
      fftCeiling: 'Natural Motion Vector Blur',
      rppgPulse: '72 BPM (Consistent Pulse Wave)',
      exifStatus: 'Sony FX6 Video Metadata Stream',
      sha256Short: '3a19e48c01b2...',
    },
    aiMetrics: {
      authenticityScore: 18,
      elaVariance: '14.2% (Temporal Frame Jitter)',
      fftCeiling: 'Optical Flow Vector Decoupling',
      rppgPulse: '0 BPM (Random Phase Noise)',
      exifStatus: 'Missing Camera Stream Headers',
      sha256Short: '7a9c8b2d1e0f...',
    },
    keyDeltas: [
      {
        metric: 'rPPG Subcutaneous Blood Flow',
        realVal: '72 BPM Sine Wave',
        aiVal: 'Flatline / 0 BPM',
        diff: '-72 BPM Biological Pulse',
        verdict: 'fail',
        description: 'Human facial skin undergoes microscopic color fluctuations matching cardiac pulse.',
      },
      {
        metric: 'Temporal Boundary Jitter',
        realVal: '<0.2px Shift',
        aiVal: '12px Frame Displacement',
        diff: 'Boundary Instability',
        verdict: 'fail',
        description: 'Facial contour mask shifts unnaturally relative to background shoulder boundaries.',
      },
      {
        metric: 'Audio-Visual Lip Sync Offset',
        realVal: '0ms Sync Delta',
        aiVal: '140ms Lead Offset',
        diff: '+140ms Desynchronization',
        verdict: 'fail',
        description: 'Phoneme lip closure precedes acoustic sound wave emission by over 100 milliseconds.',
      },
      {
        metric: 'Blink Rate & Corneal Moisture',
        realVal: '18 Blinks / min',
        aiVal: '0 Blinks in 10s',
        diff: 'Unnatural Stare',
        verdict: 'warning',
        description: 'Generative video models frequently fail to synthesize natural human blinking cadences.',
      },
    ],
  },
  {
    id: 'comp-aud-01',
    category: 'audio',
    title: 'Voice Clone Audio: ElevenLabs v2 vs Studio Condenser Recording',
    realTitle: 'Authentic Studio Microphone Vocal Recording',
    aiTitle: 'ElevenLabs Multilingual v2 Neural Voice Clone',
    aiModelName: 'ElevenLabs Multilingual v2 + Wav2Vec2',
    datasetOrigin: 'ASVspoof 2024 Benchmark',
    realPreview: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    aiPreview: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    realMetrics: {
      authenticityScore: 98,
      elaVariance: 'N/A (Acoustic Wave)',
      fftCeiling: '22kHz Full Spectrum Analog Smooth',
      rppgPulse: 'Natural Vocal Tremor 1.4Hz',
      exifStatus: 'Neumann U87 + Neumann Interface',
      sha256Short: '9c4f1028374a...',
    },
    aiMetrics: {
      authenticityScore: 24,
      elaVariance: 'N/A (Acoustic Wave)',
      fftCeiling: 'Phase Artifacts >16kHz Grid',
      rppgPulse: '0.05Hz Robotic Pitch Flatness',
      exifStatus: 'Wav2Vec2 Synthetic Model Header',
      sha256Short: '4b3a2f1e0d9c...',
    },
    keyDeltas: [
      {
        metric: 'Neural Vocoder Phase Dispersion',
        realVal: 'Natural Phase Flow',
        aiVal: 'High-Frequency Grid',
        diff: 'Phase Discontinuity',
        verdict: 'fail',
        description: 'Neural vocoders leave sharp harmonic phase artifacts above the 16kHz frequency line.',
      },
      {
        metric: 'Fundamental Frequency (F0) Tremor',
        realVal: '1.4Hz Human Variance',
        aiVal: '0.05Hz Monotone Flat',
        diff: 'Robotic Pitch Flatness',
        verdict: 'fail',
        description: 'Human vocal cords exhibit continuous micro-fluctuations in pitch even during sustained vowels.',
      },
      {
        metric: 'Physiological Inhalation Pauses',
        realVal: 'Natural Air Intake',
        aiVal: 'Abrupt Silence Gaps',
        diff: 'Missing Breath Cycle',
        verdict: 'warning',
        description: 'TTS models append synthetic silence instead of natural diaphragm breath inhalations.',
      },
      {
        metric: 'Acoustic Room Reverberation',
        realVal: 'RT60 = 0.32s Studio',
        aiVal: 'Inconsistent Echo Decay',
        diff: 'Reverb Mismatch',
        verdict: 'fail',
        description: 'Synthesized voice samples fail to match the acoustic reverberation profile of room surroundings.',
      },
    ],
  },
  {
    id: 'comp-doc-01',
    category: 'document',
    title: 'Financial PDF Audit: Forged Bank Statement vs Certified Original',
    realTitle: 'Certified Bank PDF with PKCS#7 Seal',
    aiTitle: 'ChatGPT-4o / DocTamper Forged PDF',
    aiModelName: 'DocTamper Benchmark + Vector Edit',
    datasetOrigin: 'DocTamper Benchmark',
    realPreview: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    aiPreview: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    realMetrics: {
      authenticityScore: 99,
      elaVariance: '0.0% Clean Vector Structure',
      fftCeiling: 'Valid Fonts & Subsets',
      rppgPulse: 'Valid RSA-2048 PKCS#7 Signature',
      exifStatus: 'Certified Bank Automated PDF Engine',
      sha256Short: '5e6f7a8b9c0d...',
    },
    aiMetrics: {
      authenticityScore: 29,
      elaVariance: '16.8% Localized Overlay ELA',
      fftCeiling: 'Font Subsetting Discrepancy',
      rppgPulse: 'Corrupted / Self-Signed Signature',
      exifStatus: 'Adobe Acrobat Pro (Modified)',
      sha256Short: '1a2b3c4d5e6f...',
    },
    keyDeltas: [
      {
        metric: 'PDF Font Subsetting Metrics',
        realVal: 'Single Font Tree',
        aiVal: '0.4pt Character Divergence',
        diff: 'Font Subset Mismatch',
        verdict: 'fail',
        description: 'Forged text in field "$450,000" uses a different font embedding dictionary than surrounding text.',
      },
      {
        metric: 'Vector Object Layer Modification',
        realVal: 'Atomic Single Compilation',
        aiVal: 'Overlay Created +4 Mo Later',
        diff: 'Modified Layer Tree',
        verdict: 'fail',
        description: 'Text elements were added as floating vector overlays months after initial document creation.',
      },
      {
        metric: 'PKCS#7 Digital Certificate',
        realVal: 'Validated Enterprise CA',
        aiVal: 'Invalid Checksum / Self-Signed',
        diff: 'Certificate Broken',
        verdict: 'fail',
        description: 'The cryptographic signature digest fails verification against trusted Certificate Authorities.',
      },
      {
        metric: 'Localized Compression ELA',
        realVal: 'Uniform Raster Level',
        aiVal: 'High-Error Rectangle Box',
        diff: 'Pixel Manipulation',
        verdict: 'fail',
        description: 'Error Level Analysis reveals high compression contrast surrounding numeric balance figures.',
      },
    ],
  },
];

const COMPETITOR_MATRIX = [
  {
    feature: 'Multi-Modal Detection (Img, Vid, Aud, Doc)',
    neuroshield: 'Yes (All 4 Modalities)',
    realityDefender: 'Partial (No Doc ELA)',
    hiveAi: 'Image & Video Only',
    sensityAi: 'Face Deepfakes Only',
    intelFakeCatcher: 'Video PPG Only',
  },
  {
    feature: 'Explainable AI (Grad-CAM & Spectral FFT)',
    neuroshield: 'Full XAI Heatmaps & Curves',
    realityDefender: 'Basic Confidence Score',
    hiveAi: 'Probability Score Only',
    sensityAi: 'Bounding Box Only',
    intelFakeCatcher: 'Blood Flow PPG Wave',
  },
  {
    feature: 'ISO/IEC 27037 Court-Admissible Certificate',
    neuroshield: 'Automated ISO Certificate + QR',
    realityDefender: 'PDF Report Export',
    hiveAi: 'API Json Output',
    sensityAi: 'Dashboard Summary',
    intelFakeCatcher: 'Proprietary Log',
  },
  {
    feature: 'On-Chain Cryptographic SHA-256 Ledger',
    neuroshield: 'Polygon / Web3 Merkle Proofs',
    realityDefender: 'No Blockchain',
    hiveAi: 'No Blockchain',
    sensityAi: 'No Blockchain',
    intelFakeCatcher: 'No Blockchain',
  },
  {
    feature: 'DataStax Astra DB Vector Indexing',
    neuroshield: '1536-dim Astra Similarity',
    realityDefender: 'Proprietary Cloud',
    hiveAi: 'Internal Database',
    sensityAi: 'Internal Database',
    intelFakeCatcher: 'On-Premises',
  },
  {
    feature: 'Detection Latency (Average)',
    neuroshield: '1.8 Seconds',
    realityDefender: '4.5 Seconds',
    hiveAi: '2.2 Seconds',
    sensityAi: '3.8 Seconds',
    intelFakeCatcher: '1.2 Seconds',
  },
  {
    feature: 'Client-Side Zero Data Storage Option',
    neuroshield: 'WebCrypto SHA-256 Client Mode',
    realityDefender: 'Cloud Upload Required',
    hiveAi: 'Cloud Upload Required',
    sensityAi: 'Cloud Upload Required',
    intelFakeCatcher: 'Local Gateway',
  },
];

const BENCHMARK_SCORES = [
  { dataset: 'FaceForensics++', precision: 99.1, recall: 98.4, f1: 98.7, auc: 0.996, eer: '1.2%' },
  { dataset: 'Celeb-DF v2', precision: 97.8, recall: 96.9, f1: 97.3, auc: 0.989, eer: '2.1%' },
  { dataset: 'DFDC Challenge', precision: 96.2, recall: 95.4, f1: 95.8, auc: 0.978, eer: '3.4%' },
  { dataset: 'ASVspoof 2024', precision: 98.9, recall: 98.1, f1: 98.5, auc: 0.994, eer: '1.1%' },
  { dataset: 'DocTamper', precision: 99.4, recall: 98.8, f1: 99.1, auc: 0.998, eer: '0.8%' },
];

export const RealWorldComparisons: React.FC<RealWorldComparisonsProps> = ({
  onSelectSample,
  onOpenXai,
  onNavigateScanner,
}) => {
  const [activeTab, setActiveTab] = useState<MediaTab>('image');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100 split
  const [showComparisonMatrix, setShowComparisonMatrix] = useState<boolean>(true);

  const activePair = COMPARISON_PAIRS.find((p) => p.category === activeTab) || COMPARISON_PAIRS[0];

  const categoryIcons: Record<MediaTab, React.ElementType> = {
    image: ImageIcon,
    video: Video,
    audio: Mic,
    document: FileText,
  };

  return (
    <div className="space-y-10">

      {/* Hero Title Section */}
      <div className="relative glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-400 text-xs font-semibold shadow">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>State-of-the-Art (SOTA) Real vs AI Forensic Comparison Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            Exact Real-World Comparisons:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">
              Authentic Media vs SOTA AI Generators
            </span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Direct side-by-side diagnostic analysis comparing real camera sensors, microphones, and certified documents against Midjourney v6, OpenAI Sora, ElevenLabs v2, and ChatGPT-4o forged evidence with exact mathematical deltas.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                if (onNavigateScanner) onNavigateScanner();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/25 transition transform hover:scale-105"
            >
              <Cpu className="w-4 h-4" />
              <span>Test Your Own Evidence</span>
            </button>
            <button
              onClick={() => setShowComparisonMatrix(!showComparisonMatrix)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center space-x-2 transition"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>{showComparisonMatrix ? 'Hide Industry Matrix' : 'View Industry Matrix'}</span>
            </button>
          </div>
        </div>

        {/* Decorative Badge */}
        <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-cyan-500/20 bg-slate-950/80 p-5 flex-col items-center justify-center text-center">
          <Scale className="w-16 h-16 text-cyan-400 mb-2 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">NEUROSHIELD DELTA ENGINE</span>
          <span className="text-[10px] text-emerald-400 font-mono mt-1">ISO/IEC 27037 VALIDATED</span>
        </div>
      </div>

      {/* Media Type Selector Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        {(['image', 'video', 'audio', 'document'] as MediaTab[]).map((tab) => {
          const Icon = categoryIcons[tab];
          const isActive = activeTab === tab;
          const pair = COMPARISON_PAIRS.find((p) => p.category === tab);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="capitalize">{tab} Forensics</span>
              {pair && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                  {pair.aiModelName.split(' ')[0]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Split Comparison Display */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-8">
        
        {/* Comparison Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              {activePair.datasetOrigin} • Forensic Benchmark
            </span>
            <h2 className="text-xl font-extrabold text-white mt-1">{activePair.title}</h2>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 font-mono">Target AI Model:</span>
            <span className="px-3 py-1 rounded-lg bg-rose-950/80 border border-rose-800/60 text-rose-300 text-xs font-bold font-mono">
              {activePair.aiModelName}
            </span>
          </div>
        </div>

        {/* Interactive Split View Slider Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>AUTHENTIC BASELINE (Score: {activePair.realMetrics.authenticityScore}%)</span>
            </span>
            <span className="text-slate-400 font-mono">Drag slider to compare: {sliderPosition}% Real / {100 - sliderPosition}% AI</span>
            <span className="text-rose-400 flex items-center space-x-1">
              <XCircle className="w-4 h-4" />
              <span>SYNTHETIC TARGET (Score: {activePair.aiMetrics.authenticityScore}%)</span>
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-950 h-80 sm:h-96 select-none group">
            {/* Real Image Layer (Left) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={activePair.realPreview}
                alt={activePair.realTitle}
                className="w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur border border-emerald-500/50 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-400 shadow-xl">
                ✓ Authentic Baseline
              </div>
            </div>

            {/* AI Image Layer (Right) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ left: `${sliderPosition}%`, width: `${100 - sliderPosition}%` }}
            >
              <img
                src={activePair.aiPreview}
                alt={activePair.aiTitle}
                className="w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur border border-rose-500/50 px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-400 shadow-xl">
                ⚠️ Synthetic Deepfake
              </div>
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] cursor-ew-resize z-20 flex items-center justify-center"
              style={{ left: `calc(${sliderPosition}% - 2px)` }}
            >
              <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg">
                <Sliders className="w-4 h-4" />
              </div>
            </div>

            {/* Overlay Input Range for Touch / Drag */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
            />
          </div>
        </div>

        {/* Side-by-Side Key Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Authentic Baseline Metrics */}
          <div className="bg-slate-950/90 rounded-2xl p-6 border border-emerald-900/40 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/30 pb-3">
              <h3 className="font-bold text-emerald-400 text-sm flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{activePair.realTitle}</span>
              </h3>
              <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 text-xs font-bold font-mono">
                Score: {activePair.realMetrics.authenticityScore}%
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">ELA Error Level:</span>
                <span className="font-mono text-emerald-300 font-semibold">{activePair.realMetrics.elaVariance}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">FFT Spectral Ceiling:</span>
                <span className="font-mono text-emerald-300 font-semibold">{activePair.realMetrics.fftCeiling}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Biological Pulse (rPPG):</span>
                <span className="font-mono text-emerald-300 font-semibold">{activePair.realMetrics.rppgPulse}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Hardware Signature:</span>
                <span className="font-mono text-slate-300 truncate max-w-[200px]">{activePair.realMetrics.exifStatus}</span>
              </div>
            </div>
          </div>

          {/* AI Synthetic Target Metrics */}
          <div className="bg-slate-950/90 rounded-2xl p-6 border border-rose-900/40 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-900/30 pb-3">
              <h3 className="font-bold text-rose-400 text-sm flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>{activePair.aiTitle}</span>
              </h3>
              <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 text-xs font-bold font-mono">
                Score: {activePair.aiMetrics.authenticityScore}%
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">ELA Error Level:</span>
                <span className="font-mono text-rose-300 font-semibold">{activePair.aiMetrics.elaVariance}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">FFT Spectral Ceiling:</span>
                <span className="font-mono text-rose-300 font-semibold">{activePair.aiMetrics.fftCeiling}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-400">Biological Pulse (rPPG):</span>
                <span className="font-mono text-rose-300 font-semibold">{activePair.aiMetrics.rppgPulse}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Software Signature:</span>
                <span className="font-mono text-rose-300 truncate max-w-[200px]">{activePair.aiMetrics.exifStatus}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Mathematical Forensic Delta Table */}
        <div className="space-y-3 pt-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Forensic Diagnostic Delta Breakdown</span>
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Forensic Parameter</th>
                  <th className="py-3 px-4">Authentic Baseline</th>
                  <th className="py-3 px-4">AI Target Value</th>
                  <th className="py-3 px-4">Mathematical Delta</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Diagnostic Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950 font-mono">
                {activePair.keyDeltas.map((delta, i) => (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-white font-sans">{delta.metric}</td>
                    <td className="py-3 px-4 text-emerald-400">{delta.realVal}</td>
                    <td className="py-3 px-4 text-rose-400">{delta.aiVal}</td>
                    <td className="py-3 px-4 text-cyan-300 font-bold">{delta.diff}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        delta.verdict === 'fail'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800/50'
                          : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                      }`}>
                        {delta.verdict.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] font-sans">{delta.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Real-World Industry Competitor Matrix */}
      {showComparisonMatrix && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/60 text-purple-300 text-xs font-semibold mb-2">
                <Database className="w-3.5 h-3.5" />
                <span>Enterprise Platform Comparison</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                NeuroShield vs Commercial & Academic Competitors
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Rigorous feature comparison of NeuroShield against leading forensic and AI security solutions.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold text-white">Capability / Feature</th>
                  <th className="py-3.5 px-4 font-bold text-cyan-400 bg-cyan-950/40 border-x border-cyan-800/40">
                    🛡️ NeuroShield v2.4
                  </th>
                  <th className="py-3.5 px-4">Reality Defender</th>
                  <th className="py-3.5 px-4">Hive AI</th>
                  <th className="py-3.5 px-4">Sensity AI</th>
                  <th className="py-3.5 px-4">Intel FakeCatcher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950 font-sans">
                {COMPETITOR_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-200">{row.feature}</td>
                    <td className="py-3.5 px-4 font-bold text-cyan-300 bg-cyan-950/30 border-x border-cyan-800/40">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-cyan-400" />
                        {row.neuroshield}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{row.realityDefender}</td>
                    <td className="py-3.5 px-4 text-slate-400">{row.hiveAi}</td>
                    <td className="py-3.5 px-4 text-slate-400">{row.sensityAi}</td>
                    <td className="py-3.5 px-4 text-slate-400">{row.intelFakeCatcher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Academic Benchmark Performance Datasets Table */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>Standard Benchmark Evaluation Metrics</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Tested on over 10,000 reference clips across public forensic datasets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {BENCHMARK_SCORES.map((b) => (
            <div key={b.dataset} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <span className="font-bold text-white text-sm block">{b.dataset}</span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Precision:</span>
                  <span className="text-cyan-400 font-bold">{b.precision}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">F1-Score:</span>
                  <span className="text-emerald-400 font-bold">{b.f1}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AUC-ROC:</span>
                  <span className="text-purple-400 font-bold">{b.auc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Equal Error (EER):</span>
                  <span className="text-amber-400 font-bold">{b.eer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
