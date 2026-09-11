'use client';

import React, { useState } from 'react';
import { Camera, Mic, Video, StopCircle, RefreshCw, Radio } from 'lucide-react';

interface LiveCaptureRecorderProps {
  onCaptureComplete?: (streamData: { durationSec: number; framesCount: number }) => void;
}

export const LiveCaptureRecorder: React.FC<LiveCaptureRecorderProps> = ({
  onCaptureComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [captureType, setCaptureType] = useState<'video' | 'audio'>('video');

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (onCaptureComplete) {
        onCaptureComplete({ durationSec: elapsedSeconds, framesCount: elapsedSeconds * 30 });
      }
    } else {
      setIsRecording(true);
      setElapsedSeconds(0);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Radio className={`w-5 h-5 ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
          <h4 className="font-bold text-md">Live Media Stream Capture</h4>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setCaptureType('video')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
              captureType === 'video' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5 inline mr-1" />
            Video Feed
          </button>
          <button
            onClick={() => setCaptureType('audio')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
              captureType === 'audio' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5 inline mr-1" />
            Audio Mic
          </button>
        </div>
      </div>

      <div className="relative aspect-video bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
        {isRecording ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
            <p className="text-red-400 font-mono text-sm tracking-wider font-bold">
              LIVE RECORDING: {elapsedSeconds.toString().padStart(2, '0')}s
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Camera className="w-12 h-12 stroke-[1.5]" />
            <p className="text-xs">Click start to initiate real-time neural capture stream</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleToggleRecording}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all ${
            isRecording
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isRecording ? <StopCircle className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
          {isRecording ? 'Stop & Analyze Capture' : 'Start Live Capture'}
        </button>
      </div>
    </div>
  );
};
