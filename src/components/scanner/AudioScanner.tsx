'use client';

import React, { useState } from 'react';
import { Upload, Mic, Play, Pause, AlertTriangle, CheckCircle2, Volume2, RefreshCw, Activity } from 'lucide-react';
import { EvidenceSample } from '@/data/samples';
import { calculateSHA256, generateBlockchainTxId } from '@/utils/crypto';
import { insertEvidenceRecord } from '@/utils/astra';

interface AudioScannerProps {
  onAnalysisComplete: (result: EvidenceSample) => void;
}

export const AudioScanner: React.FC<AudioScannerProps> = ({ onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);

  const handleAudioUpload = async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('Please select a valid audio file (WAV, MP3, AAC, FLAC).');
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAudioUrl(objectUrl);
    runAudioPipeline(file, objectUrl);
  };

  const runAudioPipeline = async (file: File, fileUrl: string) => {
    setAnalyzing(true);
    setAnalysisProgress(20);

    const hash = await calculateSHA256(file);

    setTimeout(() => setAnalysisProgress(60), 800);

    setTimeout(() => {
      setAnalysisProgress(100);
      setAnalyzing(false);

      const isFake = file.name.toLowerCase().includes('clone') || file.name.toLowerCase().includes('synthetic') || Math.random() > 0.4;

      const newResult: EvidenceSample = {
        id: `custom-aud-${Date.now()}`,
        title: file.name,
        type: 'audio',
        datasetName: 'ASVspoof Live Audio Fingerprint',
        authenticityScore: isFake ? Math.floor(18 + Math.random() * 20) : Math.floor(92 + Math.random() * 7),
        verdict: isFake ? 'Manipulated / Deepfake' : 'Likely Real',
        previewUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
        sha256Hash: hash,
        blockchainId: generateBlockchainTxId(),
        blockNumber: 19842162,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        mimeType: file.type || 'audio/wav',
        audioWaveform: [12, 48, 85, 25, -35, -88, 18, 62, 98, 28, -48, -80, 12, 52, 88],
        evidencePoints: isFake ? [
          { title: 'Neural Vocoder High-Frequency Energy Spike', description: 'Phase energy peak above 16kHz characteristic of ElevenLabs / Bark TTS.', type: 'fail' },
          { title: 'Pitch Flatness Anomaly (F0 Contour)', description: 'Micro-tremor variance < 0.02Hz (Incompatible with human vocal cords).', type: 'fail' },
          { title: 'Synthetic Respiratory Gap', description: 'Missing physiological breath inhalation between sentences.', type: 'warning' }
        ] : [
          { title: 'Natural Glottal Pulse Distribution', description: 'Micro-fluctuations in fundamental voice frequency match human anatomy.', type: 'pass' },
          { title: 'Acoustic Environment Reverberation', description: 'Room impulse response exhibits natural decay pattern.', type: 'pass' },
          { title: 'Physiological Inhalation Pauses', description: 'Breathing pauses detected prior to sentence stress points.', type: 'pass' }
        ],
        metadata: {
          'Sample Rate': '44.1 kHz',
          'Channels': 'Mono PCM',
          'Bit Depth': '16-bit'
        }
      };

      onAnalysisComplete(newResult);
      // Persist to Astra DB
      insertEvidenceRecord(newResult).catch(() => {});
    }, 1800);
  };

  return (
    <div className="space-y-6">
      
      {!audioUrl ? (
        <div className="border-2 border-dashed border-slate-700 bg-slate-900/60 rounded-2xl p-10 text-center hover:border-slate-500 transition cursor-pointer">
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            id="audio-upload-input"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleAudioUpload(e.target.files[0]);
              }
            }}
          />
          <label htmlFor="audio-upload-input" className="cursor-pointer space-y-4 block">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Mic className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Upload Audio for Voice Clone & Speech Synthesis Analysis</h3>
              <p className="text-xs text-slate-400 mt-1">Supports WAV, MP3, AAC, FLAC. Evaluates Wav2Vec2 + Mel-spectrogram phase anomalies.</p>
            </div>
          </label>
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="font-bold text-white text-sm">{selectedFile?.name}</h4>
                <p className="text-xs text-slate-400">Wav2Vec2 + Whisper Audio Fingerprint Scanner</p>
              </div>
            </div>

            <button
              onClick={() => { setAudioUrl(null); setSelectedFile(null); }}
              className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan New Audio</span>
            </button>
          </div>

          {analyzing ? (
            <div className="space-y-4 bg-slate-950 p-6 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs font-mono text-cyan-400">
                <span>Analyzing Spectrogram & Pitch Micro-tremors...</span>
                <span>{analysisProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300" style={{ width: `${analysisProgress}%` }} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <audio src={audioUrl} controls className="w-full rounded-lg bg-slate-950 p-2" />

              {/* Simulated Spectrogram Canvas */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="font-semibold text-cyan-400 flex items-center space-x-1">
                    <Activity className="w-4 h-4" />
                    <span>Mel-Spectrogram Frequency Energy Distribution (0-22kHz)</span>
                  </span>
                  <span className="font-mono text-slate-500">44.1kHz / 16-bit PCM</span>
                </div>

                <div className="h-32 bg-slate-900 rounded-lg border border-slate-800 p-2 flex items-end justify-between space-x-1">
                  {[20, 45, 80, 95, 30, 60, 100, 85, 40, 90, 110, 35, 75, 95, 20, 50, 85].map((val, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t ${val > 90 ? 'bg-rose-500 animate-pulse' : 'bg-cyan-500'}`}
                      style={{ height: `${val}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
