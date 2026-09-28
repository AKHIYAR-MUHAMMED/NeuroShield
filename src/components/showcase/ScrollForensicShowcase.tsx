'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  Video,
  Mic,
  FileText,
  Database,
  ShieldCheck,
  Zap,
  Activity,
  ArrowDown,
  Sparkles,
  Layers,
  CheckCircle2,
  Lock,
  Radio,
  Sliders,
  Cpu,
  Brain,
} from 'lucide-react';
import { SAMPLE_DATASETS } from '@/data/samples';

export const ScrollForensicShowcase: React.FC<{
  onSelectSample?: (sample: (typeof SAMPLE_DATASETS)[0]) => void;
  onNavigateScanner?: () => void;
}> = ({ onSelectSample, onNavigateScanner }) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeDomain, setActiveDomain] = useState<'image' | 'video' | 'audio' | 'document' | 'blockchain'>('image');
  const [interactiveParam, setInteractiveParam] = useState<number>(75);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);

  // References to section blocks for scroll triggers
  const secImageRef = useRef<HTMLDivElement | null>(null);
  const secVideoRef = useRef<HTMLDivElement | null>(null);
  const secAudioRef = useRef<HTMLDivElement | null>(null);
  const secDocRef = useRef<HTMLDivElement | null>(null);
  const secChainRef = useRef<HTMLDivElement | null>(null);

  // Track window scroll progress & active section
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const currentScroll = window.scrollY;
      const progress = Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100));
      setScrollProgress(progress);

      // Determine active section based on scroll offset
      const y = currentScroll + window.innerHeight / 2;
      if (secChainRef.current && y >= secChainRef.current.offsetTop) setActiveDomain('blockchain');
      else if (secDocRef.current && y >= secDocRef.current.offsetTop) setActiveDomain('document');
      else if (secAudioRef.current && y >= secAudioRef.current.offsetTop) setActiveDomain('audio');
      else if (secVideoRef.current && y >= secVideoRef.current.offsetTop) setActiveDomain('video');
      else setActiveDomain('image');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 relative pb-16 animate-fadeIn">
      {/* Top Fixed Scroll Progress Bar & Telemetry Dock */}
      <div className="sticky top-16 z-40 bg-slate-950/90 backdrop-blur-md border-y border-slate-800 px-4 py-2.5 shadow-2xl flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{
                backgroundColor:
                  activeDomain === 'image'
                    ? '#00f2fe'
                    : activeDomain === 'video'
                    ? '#f43f5e'
                    : activeDomain === 'audio'
                    ? '#10b981'
                    : activeDomain === 'document'
                    ? '#c084fc'
                    : '#f59e0b',
              }}
            />
            <span className="font-extrabold text-xs text-white uppercase tracking-wider">
              {activeDomain === 'image' && '🖼️ Domain 1: Spatial GAN Image Spectrum'}
              {activeDomain === 'video' && '🎥 Domain 2: Video Deepfake & rPPG Pulse'}
              {activeDomain === 'audio' && '🎙️ Domain 3: Audio Voice Clone & Mel-Pitch'}
              {activeDomain === 'document' && '📄 Domain 4: Document OCR & PDF Layers'}
              {activeDomain === 'blockchain' && '⛓️ Domain 5: Web3 Ledger & Merkle Hashes'}
            </span>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="flex items-center gap-4">
          <div className="w-36 sm:w-56 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className="h-full scroll-progress-bar transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          <span className="font-mono text-xs font-bold text-cyan-400">
            {scrollProgress.toFixed(0)}% SCROLLED
          </span>
        </div>
      </div>

      {/* Hero Interactive Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-8 text-slate-100 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 inline-flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" /> Real-Life Scroll-Driven Motion Showcase
        </span>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white glow-text-neon">
          Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-rose-400">Cyber-Forensic Motion Experience</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Scroll down to experience real-life domain-tailored animation themes, interactive 60 FPS spatial filters, subcutaneous blood pulse waves, and unforgeable blockchain audit streams.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => scrollToSection(secImageRef)}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
          >
            <ArrowDown className="w-4 h-4 animate-bounce" /> Scroll Down Showcase
          </button>
        </div>
      </div>

      {/* Floating Domain Quick Navigation Dock */}
      <div className="flex flex-wrap items-center justify-center gap-2 relative z-10 max-w-3xl mx-auto px-4">
        <button
          onClick={() => scrollToSection(secImageRef)}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeDomain === 'image'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 scale-105'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-500/50'
          }`}
        >
          <Eye className="w-4 h-4" /> Image GAN
        </button>
        <button
          onClick={() => scrollToSection(secVideoRef)}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeDomain === 'video'
              ? 'bg-rose-500 text-slate-950 shadow-lg shadow-rose-500/30 scale-105'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-rose-500/50'
          }`}
        >
          <Video className="w-4 h-4" /> Video Deepfake
        </button>
        <button
          onClick={() => scrollToSection(secAudioRef)}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeDomain === 'audio'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 scale-105'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-emerald-500/50'
          }`}
        >
          <Mic className="w-4 h-4" /> Audio Voice Clone
        </button>
        <button
          onClick={() => scrollToSection(secDocRef)}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeDomain === 'document'
              ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/30 scale-105'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-purple-500/50'
          }`}
        >
          <FileText className="w-4 h-4" /> PDF Tamper OCR
        </button>
        <button
          onClick={() => scrollToSection(secChainRef)}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeDomain === 'blockchain'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105'
              : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <Database className="w-4 h-4" /> Web3 Ledger
        </button>
      </div>

      {/* SECTION 1: Image Forensics Domain (Cyber Cyan Theme) */}
      <div
        ref={secImageRef}
        className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-scroll-reveal theme-image-cyan"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/20">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Domain 1 • Image Forensics</span>
              <h2 className="text-2xl font-black text-white">GAN Spatial Grid & JPEG ELA Compression Resampling</h2>
            </div>
          </div>
          <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-bold font-mono">
            CYAN METRIC ACTIVE
          </span>
        </div>

        {/* Section Interactive Showcase Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm text-slate-300">
            <p className="leading-relaxed">
              Detects GAN frequency checkerboarding, localized JPEG Error Level Analysis (ELA) compression mismatch, EXIF header tampering, and eye specular reflection asymmetry across digital images.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-300">
                <span>Spatial Anomaly High-Pass Filter Sensitivity</span>
                <span className="font-mono text-cyan-400">{interactiveParam}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={interactiveParam}
                onChange={(e) => setInteractiveParam(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-950 rounded-2xl border border-cyan-500/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase">GAN Frequency Peak</span>
                <div className="text-lg font-black text-cyan-400 mt-0.5">24.8 kHz</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-cyan-500/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase">ELA Compression Delta</span>
                <div className="text-lg font-black text-rose-400 mt-0.5">+48.2% Anomaly</div>
              </div>
            </div>
          </div>

          {/* Animated Interactive Image ELA Preview Card */}
          <div className="relative bg-slate-950 rounded-2xl border border-cyan-500/40 p-4 shadow-2xl overflow-hidden card-3d-tilt">
            <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400 animate-laser" />
            <img
              src={SAMPLE_DATASETS[0].previewUrl}
              alt="Image ELA Preview"
              className="w-full h-56 object-cover rounded-xl border border-slate-800"
            />
            <div className="mt-3 flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold">Exhibit #01: Synthetic GAN Portrait</span>
              <span className="text-rose-400 font-bold">12% Authentic</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Video Deepfake Domain (Neon Rose Theme) */}
      <div
        ref={secVideoRef}
        className="bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border border-rose-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-scroll-reveal theme-video-rose"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-rose-500/20 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-lg shadow-rose-500/20">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-rose-400 uppercase">Domain 2 • Video Deepfake</span>
              <h2 className="text-2xl font-black text-white">Temporal Optical Flow & Subcutaneous rPPG Pulse Wave</h2>
            </div>
          </div>
          <span className="px-3 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-full text-xs font-bold font-mono">
            ROSE METRIC ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm text-slate-300">
            <p className="leading-relaxed">
              Extracts frame-by-frame temporal boundary jitter, unnatural blink rates, lip-sync audio-visual latency offsets, and subcutaneous capillary blood flow pulse signals to verify live human presence vs. OpenAI Sora / Runway Gen-2 video deepfakes.
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/30 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-rose-400 font-bold">
                <span>🫀 Live Capillary rPPG Pulse Estimator</span>
                <span>0 BPM (ABSENT)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Subcutaneous capillary blood flow absorption wave absent across 120 evaluated keyframes.
              </p>
            </div>
          </div>

          <div className="relative bg-slate-950 rounded-2xl border border-rose-500/40 p-4 shadow-2xl overflow-hidden card-3d-tilt">
            <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500 animate-laser" />
            <img
              src={SAMPLE_DATASETS[1].previewUrl}
              alt="Video Deepfake Preview"
              className="w-full h-56 object-cover rounded-xl border border-slate-800"
            />
            <div className="mt-3 flex items-center justify-between text-xs font-mono">
              <span className="text-rose-400 font-bold">Exhibit #02: Video Face Swap</span>
              <span className="text-rose-400 font-bold">18% Authentic</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Audio Voice Clone Domain (Deep Emerald Theme) */}
      <div
        ref={secAudioRef}
        className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-scroll-reveal theme-audio-emerald"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/20">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Domain 3 • Audio Voice Clone</span>
              <h2 className="text-2xl font-black text-white">Neural Vocoder Phase & Phoneme Pitch Flatness ($F_0$)</h2>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold font-mono">
            EMERALD METRIC ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm text-slate-300">
            <p className="leading-relaxed">
              Detects ElevenLabs v2 and Bark neural vocoder phase artifacts, artificial glottal pulse flatness, unnatural respiratory silence gaps, and Mel-spectrogram high-frequency cutoff ceilings.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-2xl border border-emerald-500/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Pitch Flatness ($F_0$)</span>
                <div className="text-lg font-black text-emerald-400 mt-0.5">0.92 Artificial</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-emerald-500/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Vocoder Match</span>
                <div className="text-lg font-black text-emerald-400 mt-0.5">ElevenLabs v2</div>
              </div>
            </div>
          </div>

          <div className="relative bg-slate-950 rounded-2xl border border-emerald-500/40 p-4 shadow-2xl overflow-hidden card-3d-tilt">
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-400 animate-laser" />
            <img
              src={SAMPLE_DATASETS[2].previewUrl}
              alt="Audio Vocoder Preview"
              className="w-full h-56 object-cover rounded-xl border border-slate-800"
            />
            <div className="mt-3 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">Exhibit #03: Audio Voice Clone</span>
              <span className="text-rose-400 font-bold">24% Authentic</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Document Tamper Domain (Holographic Amethyst Theme) */}
      <div
        ref={secDocRef}
        className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-purple-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-scroll-reveal theme-document-purple"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-purple-500/20 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-lg shadow-purple-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-purple-400 uppercase">Domain 4 • Document Tamper OCR</span>
              <h2 className="text-2xl font-black text-white">PDF Vector Subsetting & PKCS#7 Digital Signatures</h2>
            </div>
          </div>
          <span className="px-3 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold font-mono">
            AMETHYST METRIC ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm text-slate-300">
            <p className="leading-relaxed">
              Analyzes court contract vector layers, font subsetting inconsistencies, localized ELA text block resampling, and PKCS#7 cryptographic digital signature envelope integrity.
            </p>

            <div className="p-4 bg-slate-950 rounded-2xl border border-purple-500/30 space-y-1 font-mono text-xs">
              <div className="flex items-center justify-between text-purple-300 font-bold">
                <span>📄 PKCS#7 Digital Signature Status</span>
                <span className="text-emerald-400">INTACT (VERIFIED)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Official court document contract layers matched with 98% structural authenticity.
              </p>
            </div>
          </div>

          <div className="relative bg-slate-950 rounded-2xl border border-purple-500/40 p-4 shadow-2xl overflow-hidden card-3d-tilt">
            <div className="absolute top-0 left-0 right-0 h-1 bg-purple-400 animate-laser" />
            <img
              src={SAMPLE_DATASETS[3].previewUrl}
              alt="Document Tamper Preview"
              className="w-full h-56 object-cover rounded-xl border border-slate-800"
            />
            <div className="mt-3 flex items-center justify-between text-xs font-mono">
              <span className="text-purple-400 font-bold">Exhibit #04: Official Legal Contract</span>
              <span className="text-emerald-400 font-bold">98% Authentic</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Web3 Blockchain & Astra DB Domain (Amber Gold Theme) */}
      <div
        ref={secChainRef}
        className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-scroll-reveal theme-blockchain-amber"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg shadow-amber-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">Domain 5 • Web3 Blockchain Ledger</span>
              <h2 className="text-2xl font-black text-white">SHA-256 Merkle Proofs & DataStax Astra DB Vector Storage</h2>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold font-mono">
            GOLD METRIC ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-sm text-slate-300">
            <p className="leading-relaxed">
              Registers unforgeable evidence hashes, custodian hardware serials, and multi-model consensus predictions onto an immutable SHA-256 decentralized blockchain ledger synced with DataStax Astra DB vector search.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Blockchain Block #</span>
                <div className="text-lg font-black text-amber-400 mt-0.5">#19,842,104</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/30">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Astra DB Vector Match</span>
                <div className="text-lg font-black text-emerald-400 mt-0.5">100% Synced</div>
              </div>
            </div>
          </div>

          <div className="relative bg-slate-950 rounded-2xl border border-amber-500/40 p-5 shadow-2xl space-y-3 font-mono text-xs card-3d-tilt">
            <div className="flex items-center justify-between text-amber-400 font-bold border-b border-slate-800 pb-2">
              <span>⛓️ SHA-256 Merkle Block Certificate</span>
              <span className="text-emerald-400">UNFORGEABLE</span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1">
              <p>Root Hash: <span className="text-amber-300 font-bold">0x0e4a881f...c8996fb9</span></p>
              <p>Timestamp: <span className="text-cyan-300 font-bold">2026-09-28 12:15:49 UTC</span></p>
              <p>Custodian: <span className="text-purple-300 font-bold">Agent Sarah Vance</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
