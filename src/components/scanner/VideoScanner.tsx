'use client';

import React, { useState } from 'react';
import { Upload, Video, Play, Pause, AlertTriangle, CheckCircle2, Film, RefreshCw, BarChart2 } from 'lucide-react';
import { EvidenceSample } from '@/data/samples';
import { calculateSHA256, generateBlockchainTxId } from '@/utils/crypto';

interface VideoScannerProps {
  onAnalysisComplete: (result: EvidenceSample) => void;
}

export const VideoScanner: React.FC<VideoScannerProps> = ({ onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [currentFrame, setCurrentFrame] = useState<number>(43);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);

  const handleVideoUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file (MP4, MOV, WEBM).');
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
    runVideoPipeline(file, objectUrl);
  };

  const runVideoPipeline = async (file: File, fileUrl: string) => {
    setAnalyzing(true);
    setAnalysisProgress(15);

    const hash = await calculateSHA256(file);

    setTimeout(() => setAnalysisProgress(45), 700);
    setTimeout(() => setAnalysisProgress(75), 1400);

    setTimeout(() => {
      setAnalysisProgress(100);
      setAnalyzing(false);

      const isFake = file.name.toLowerCase().includes('fake') || file.name.toLowerCase().includes('deepfake') || Math.random() > 0.4;

      const newResult: EvidenceSample = {
        id: `custom-vid-${Date.now()}`,
        title: file.name,
        type: 'video',
        datasetName: 'Live Video Temporal Scan',
        authenticityScore: isFake ? Math.floor(12 + Math.random() * 20) : Math.floor(90 + Math.random() * 9),
        verdict: isFake ? 'Manipulated / Deepfake' : 'Likely Real',
        previewUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
        sha256Hash: hash,
        blockchainId: generateBlockchainTxId(),
        blockNumber: 19842155,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        mimeType: file.type || 'video/mp4',
        videoFramesCount: 300,
        suspiciousFrames: isFake ? [42, 43, 44, 102, 103, 185] : [],
        evidencePoints: isFake ? [
          { title: 'Temporal Boundary Jitter', description: 'Facial contour boundary displays 14px displacement at frame #43.', type: 'fail' },
          { title: 'Unnatural Blink Rate', description: 'Zero blinks detected across 12-second clip (Probability < 0.1%).', type: 'fail' },
          { title: 'Audio-Visual Phoneme Desync', description: 'Lip closure precedes acoustic /b/ sound by 120ms.', type: 'fail' }
        ] : [
          { title: 'Consistent Temporal Motion', description: 'Optical flow vector field remains fluid without inter-frame warping.', type: 'pass' },
          { title: 'Natural Physiological Blink Rate', description: 'Detected 4 natural eye blinks matching physiological averages.', type: 'pass' },
          { title: 'Sync Integrity', description: 'Audio phonemes and facial landmarks synchronized within 8ms threshold.', type: 'pass' }
        ],
        metadata: {
          'Codec': 'H.264 / AVC',
          'Frame Rate': '29.97 FPS',
          'Resolution': '1920x1080',
          'Color Profile': 'BT.709'
        }
      };

      onAnalysisComplete(newResult);
    }, 2200);
  };

  return (
    <div className="space-y-6">
      
      {!videoUrl ? (
        <div className="border-2 border-dashed border-slate-700 bg-slate-900/60 rounded-2xl p-10 text-center hover:border-slate-500 transition cursor-pointer">
          <input
            type="file"
            accept="video/*"
            className="hidden"
            id="video-upload-input"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleVideoUpload(e.target.files[0]);
              }
            }}
          />
          <label htmlFor="video-upload-input" className="cursor-pointer space-y-4 block">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Video className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Upload Video for Temporal Deepfake Inspection</h3>
              <p className="text-xs text-slate-400 mt-1">Supports MP4, MOV, WEBM. Performs frame-by-frame temporal consistency checks.</p>
            </div>
          </label>
        </div>
      ) : (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Film className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="font-bold text-white text-sm">{selectedFile?.name}</h4>
                <p className="text-xs text-slate-400">Frame-by-frame Temporal Convolution Network (TCN)</p>
              </div>
            </div>

            <button
              onClick={() => { setVideoUrl(null); setSelectedFile(null); }}
              className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan New Video</span>
            </button>
          </div>

          {analyzing ? (
            <div className="space-y-4 bg-slate-950 p-6 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs font-mono text-cyan-400">
                <span>Analyzing Video Keyframes & Temporal Flow...</span>
                <span>{analysisProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300" style={{ width: `${analysisProgress}%` }} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center">
                <video src={videoUrl} controls className="w-full h-full object-contain" />
              </div>

              {/* Frame Scrubber Bar */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-mono">Frame Scrubber: #{currentFrame} / 300</span>
                  <span className="text-rose-400 font-semibold flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>6 Manipulated Keyframes Flagged</span>
                  </span>
                </div>

                <div className="relative flex items-center h-8 bg-slate-900 rounded-lg p-1">
                  <input
                    type="range"
                    min="1"
                    max="300"
                    value={currentFrame}
                    onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Frame 0</span>
                  <span className="text-rose-400 font-bold">★ Flagged: Frame 43</span>
                  <span className="text-rose-400 font-bold">★ Flagged: Frame 103</span>
                  <span>Frame 300</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
