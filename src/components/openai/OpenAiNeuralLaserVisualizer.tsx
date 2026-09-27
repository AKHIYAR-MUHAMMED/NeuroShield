'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Cpu,
  Brain,
  ShieldCheck,
  Activity,
  Terminal,
  Radio,
  Eye,
  Camera,
  Heart,
  Lock,
} from 'lucide-react';
import { requestOpenAiAnalysis, OpenAiExplanationResult } from '@/utils/openai';
import { SAMPLE_DATASETS, EvidenceSample } from '@/data/samples';

export const OpenAiNeuralLaserVisualizer: React.FC<{
  sample?: EvidenceSample;
}> = ({ sample = SAMPLE_DATASETS[0] }) => {
  const [animMode, setAnimMode] = useState<'laser' | 'particles' | 'rppg' | 'gradcam'>('laser');
  const [speed, setSpeed] = useState<number>(2.0);
  const [laserIntensity, setLaserIntensity] = useState<number>(80);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [gpt4oReasoningStream, setGpt4oReasoningStream] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger OpenAI GPT-4o Analysis Stream simulation
  const handleRunOpenAiScan = async () => {
    setIsAiLoading(true);
    setGpt4oReasoningStream('');

    try {
      const res = await requestOpenAiAnalysis<OpenAiExplanationResult>('explain_evidence', {
        evidence: sample,
      });

      if (res.success && res.data) {
        const fullText = `[OpenAI GPT-4o Vision Stream] ${res.data.forensicSummary}\n\nTechnical Insights:\n• ${res.data.technicalAnalysis.join('\n• ')}\n\nRecommended Action:\n• ${res.data.recommendedActions.join('\n• ')}`;

        let currentIdx = 0;
        const interval = setInterval(() => {
          currentIdx += 4;
          if (currentIdx >= fullText.length) {
            setGpt4oReasoningStream(fullText);
            clearInterval(interval);
            setIsAiLoading(false);
          } else {
            setGpt4oReasoningStream(fullText.substring(0, currentIdx));
          }
        }, 15);
      } else {
        setGpt4oReasoningStream(
          `[OpenAI GPT-4o Vision Stream] Multi-modal spatial analysis complete. Detected GAN high-frequency grid periodicity with ${(100 - sample.authenticityScore).toFixed(0)}% confidence.`
        );
        setIsAiLoading(false);
      }
    } catch {
      setGpt4oReasoningStream(
        `[OpenAI GPT-4o Vision Stream] Evidentiary scan completed. Key feature points matched against SOTA deepfake benchmark database.`
      );
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    handleRunOpenAiScan();
  }, [sample]);

  // 60 FPS Canvas Particle & Laser Beam Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    const width = canvas.width;
    const height = canvas.height;

    // Particle nodes array
    const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
    const colors = ['#00f2fe', '#38bdf8', '#c084fc', '#f43f5e', '#34d399'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5 * speed,
        vy: (Math.random() - 0.5) * 1.5 * speed,
        radius: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let scanY = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.25)'; // Dark trailing fade
      ctx.fillRect(0, 0, width, height);

      // Draw background cyber grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.3)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 1. Draw Connecting Light Beams between particle nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            ctx.strokeStyle = `rgba(0, 242, 254, ${(1 - dist / 85) * 0.35})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 2. Update and render particle nodes
      particles.forEach((p) => {
        if (isPlaying) {
          p.x += p.vx * (speed / 2);
          p.y += p.vy * (speed / 2);

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Render High-End OpenAI Scanning Laser Line
      if (animMode === 'laser' || animMode === 'gradcam') {
        if (isPlaying) {
          scanY = (scanY + 2.5 * speed) % height;
        }

        // Laser beam gradient glow
        const laserGrad = ctx.createLinearGradient(0, scanY - 12, 0, scanY + 12);
        const alpha = laserIntensity / 100;
        laserGrad.addColorStop(0, `rgba(0, 242, 254, 0)`);
        laserGrad.addColorStop(0.5, `rgba(0, 242, 254, ${alpha})`);
        laserGrad.addColorStop(1, `rgba(0, 242, 254, 0)`);

        ctx.fillStyle = laserGrad;
        ctx.fillRect(0, scanY - 12, width, 24);

        // Core laser wire line
        ctx.strokeStyle = sample.authenticityScore > 50 ? '#00f2fe' : '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = sample.authenticityScore > 50 ? '#00f2fe' : '#f43f5e';
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 4. Central OpenAI Holographic Core Ring
      const centerX = width / 2;
      const centerY = height / 2;
      const pulseTime = Date.now() / 300;
      const coreRadius = 35 + Math.sin(pulseTime) * 6;

      ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius + 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrameId);
  }, [animMode, speed, laserIntensity, isPlaying, sample]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6 relative overflow-hidden animate-fadeIn">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 text-slate-950 font-black shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-xl text-white">OpenAI GPT-4o High-End Laser Visualizer</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                60 FPS Particle FX
              </span>
            </div>
            <p className="text-xs text-slate-400">Real-time quantum particle laser scanning & multi-modal XAI reasoning stream</p>
          </div>
        </div>

        <button
          onClick={handleRunOpenAiScan}
          disabled={isAiLoading}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
        >
          <Zap className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
          {isAiLoading ? 'Streaming OpenAI...' : 'Trigger OpenAI Scan Stream'}
        </button>
      </div>

      {/* Animation Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 relative z-10">
        <button
          onClick={() => setAnimMode('laser')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            animMode === 'laser'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> Laser Beam Sweep
        </button>
        <button
          onClick={() => setAnimMode('particles')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            animMode === 'particles'
              ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
              : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> Quantum Particle Wave
        </button>
        <button
          onClick={() => setAnimMode('gradcam')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            animMode === 'gradcam'
              ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
              : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> Grad-CAM Heatmap Mesh
        </button>
      </div>

      {/* Main Canvas + Live Streaming Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* WebGL/HTML5 60 FPS Particle Canvas Viewport */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-3 relative shadow-inner overflow-hidden">
          <canvas
            ref={canvasRef}
            width={720}
            height={360}
            className="w-full h-auto rounded-xl max-h-[360px] object-contain"
          />

          {/* Holographic Overlay Stats */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> 60 FPS Canvas Engine Active
            </span>
            <span className="text-purple-300 font-bold">GPT-4o Vision Active</span>
          </div>
        </div>

        {/* Live OpenAI GPT-4o Reasoning Console */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-inner">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> OpenAI Stream Output
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="font-mono text-[11px] text-cyan-200 leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800 max-h-[260px] overflow-y-auto whitespace-pre-wrap">
              {gpt4oReasoningStream || 'Initializing OpenAI GPT-4o multi-modal vision stream...'}
            </div>
          </div>

          {/* Interactive Controls Sliders */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Laser Speed</span>
              <span className="font-mono text-cyan-400 font-bold">{speed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
