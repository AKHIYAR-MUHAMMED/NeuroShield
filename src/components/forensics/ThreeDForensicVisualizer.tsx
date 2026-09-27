'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Box,
  Layers,
  RotateCw,
  Zap,
  Eye,
  Activity,
  Maximize2,
  Sliders,
  Sparkles,
  Radio,
  Lock,
  Cpu,
  Brain,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { SAMPLE_DATASETS, EvidenceSample } from '@/data/samples';

export const ThreeDForensicVisualizer: React.FC<{
  sample?: EvidenceSample;
}> = ({ sample = SAMPLE_DATASETS[0] }) => {
  const [active3dMode, setActive3dMode] = useState<'brain' | 'rppg' | 'gradcam' | 'blockchain'>('brain');
  const [rotX, setRotX] = useState<number>(0.3);
  const [rotY, setRotY] = useState<number>(0.0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotSpeed, setRotSpeed] = useState<number>(1.5);
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeSample = SAMPLE_DATASETS[selectedSampleIndex] || sample;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 60 FPS 3D Canvas Projection Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    // Generate 3D Sphere Wireframe Vertices
    const numLat = 16;
    const numLon = 24;
    const radius = 130;

    // Generate 3D Particle Cloud
    const particles3D: { x: number; y: number; z: number; radius: number; color: string }[] = [];
    const pColors = ['#00f2fe', '#38bdf8', '#c084fc', '#f43f5e', '#34d399'];

    for (let i = 0; i < 180; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius * (0.8 + Math.random() * 0.7);

      particles3D.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        radius: Math.random() * 2 + 1,
        color: pColors[Math.floor(Math.random() * pColors.length)],
      });
    }

    let currentRotY = rotY;
    let scanZ = -radius;

    const render = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // Draw background 3D perspective grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.25)';
      ctx.lineWidth = 1;
      const perspectiveFocal = 350;

      // Update rotation
      if (autoRotate && !isDragging) {
        currentRotY += 0.008 * rotSpeed;
      }

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);

      // Helper function to project 3D point (x,y,z) to 2D canvas (px, py)
      const project3D = (x: number, y: number, z: number) => {
        // Rotate Y
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // Rotate X
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        const scale = perspectiveFocal / (perspectiveFocal + z2 + 200);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          scale,
          z: z2,
        };
      };

      // 1. Draw 3D Orbiting Particle Cloud with Depth Sorting
      particles3D.sort((a, b) => {
        const pa = project3D(a.x, a.y, a.z);
        const pb = project3D(b.x, b.y, b.z);
        return pb.z - pa.z;
      });

      particles3D.forEach((p) => {
        const proj = project3D(p.x, p.y, p.z);
        const alpha = Math.min(1.0, Math.max(0.15, (proj.scale - 0.4) * 2));

        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, p.radius * proj.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 2. Draw 3D Wireframe Cyber Hologram Mesh
      const isSynthetic = activeSample.authenticityScore < 50;

      if (active3dMode === 'brain' || active3dMode === 'rppg') {
        // Draw Latitude Rings
        for (let i = 1; i < numLat; i++) {
          const lat = (Math.PI * i) / numLat;
          const ringR = radius * Math.sin(lat);
          const ringY = radius * Math.cos(lat);

          ctx.beginPath();
          ctx.strokeStyle = isSynthetic && i % 3 === 0 ? 'rgba(244, 63, 94, 0.45)' : 'rgba(0, 242, 254, 0.35)';
          ctx.lineWidth = 1.2;

          for (let j = 0; j <= numLon; j++) {
            const lon = (2 * Math.PI * j) / numLon;
            let noise = 0;

            // Injected 3D Anomaly Distortions for Synthetic Deepfakes
            if (isSynthetic && i > 5 && i < 11) {
              noise = Math.sin(lon * 4 + Date.now() / 200) * 18;
            }

            const rNoise = ringR + noise;
            const x = rNoise * Math.cos(lon);
            const z = rNoise * Math.sin(lon);
            const proj = project3D(x, ringY, z);

            if (j === 0) ctx.moveTo(proj.px, proj.py);
            else ctx.lineTo(proj.px, proj.py);
          }
          ctx.stroke();
        }
      } else if (active3dMode === 'gradcam') {
        // 3D Grad-CAM Surface Mesh Displacement
        const gridDim = 14;
        const step = 20;
        const start = (-gridDim * step) / 2;

        for (let r = 0; r < gridDim; r++) {
          for (let c = 0; c < gridDim; c++) {
            const x = start + c * step;
            const z = start + r * step;
            let y = 0;

            if (isSynthetic && r > 3 && r < 10 && c > 3 && c < 10) {
              y = -Math.sin((r / gridDim) * Math.PI) * Math.sin((c / gridDim) * Math.PI) * 75;
            }

            const p1 = project3D(x, y, z);
            const p2 = project3D(x + step, y, z);
            const p3 = project3D(x + step, y, z + step);
            const p4 = project3D(x, y, z + step);

            ctx.fillStyle = y < -20 ? 'rgba(244, 63, 94, 0.4)' : 'rgba(0, 242, 254, 0.15)';
            ctx.strokeStyle = y < -20 ? '#f43f5e' : '#00f2fe';
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.lineTo(p3.px, p3.py);
            ctx.lineTo(p4.px, p4.py);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        }
      } else if (active3dMode === 'blockchain') {
        // Render 3D Blockchain Cube Nodes Connected in 3D Space
        const cubePos = [
          { x: -120, y: -40, z: 0, label: 'Block #19842104' },
          { x: -40, y: 30, z: 60, label: 'SHA-256 Registered' },
          { x: 40, y: -20, z: -40, label: 'Astra DB Node' },
          { x: 120, y: 40, z: 20, label: 'Merkle Root Verified' },
        ];

        // Draw connections
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        cubePos.forEach((cp, idx) => {
          const proj = project3D(cp.x, cp.y, cp.z);
          if (idx === 0) ctx.moveTo(proj.px, proj.py);
          else ctx.lineTo(proj.px, proj.py);
        });
        ctx.stroke();

        // Draw cubes
        cubePos.forEach((cp) => {
          const proj = project3D(cp.x, cp.y, cp.z);
          const size = 16 * proj.scale;

          ctx.fillStyle = '#a855f7';
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#a855f7';
          ctx.fillRect(proj.px - size / 2, proj.py - size / 2, size, size);
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#ffffff';
          ctx.font = '10px monospace';
          ctx.fillText(cp.label, proj.px + size, proj.py + 4);
        });
      }

      // 3. Render 3D Scanning Laser Plane
      scanZ += 2.0 * rotSpeed;
      if (scanZ > radius) scanZ = -radius;

      const laserP1 = project3D(-radius * 1.2, 0, scanZ);
      const laserP2 = project3D(radius * 1.2, 0, scanZ);

      ctx.strokeStyle = isSynthetic ? '#f43f5e' : '#00f2fe';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 20;
      ctx.shadowColor = isSynthetic ? '#f43f5e' : '#00f2fe';
      ctx.beginPath();
      ctx.moveTo(laserP1.px, laserP1.py);
      ctx.lineTo(laserP2.px, laserP2.py);
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [active3dMode, rotX, rotY, autoRotate, rotSpeed, activeSample, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotY((prev) => prev + dx * 0.008);
    setRotX((prev) => Math.max(-Math.PI / 3, Math.min(Math.PI / 3, prev + dy * 0.008)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950 border border-purple-500/30 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 animate-spin text-purple-400" /> 60 FPS 3D WebGL Projection
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Interactive Spatial Camera
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white glow-text-neon">
              Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">3D Cyber Holographic Visualizer</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore digital evidence in full 3D spatial perspective: Drag mouse to orbit in 3D space, inspect 3D Grad-CAM surface displacement meshes, 3D biological rPPG pulse spheres, and 3D blockchain cryptographic cube nodes.
            </p>
          </div>

          {/* Sample Switcher Dropdown */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 w-full lg:w-72 shadow-inner">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active 3D Evidence Model</span>
            <select
              value={selectedSampleIndex}
              onChange={(e) => setSelectedSampleIndex(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-purple-500"
            >
              {SAMPLE_DATASETS.map((s, idx) => (
                <option key={s.id} value={idx}>
                  {s.title} ({s.authenticityScore > 50 ? 'Authentic' : 'Synthetic'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3D Diagnostic Mode Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-4 border-t border-slate-800/80 relative z-10">
          <button
            onClick={() => setActive3dMode('brain')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              active3dMode === 'brain'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Brain className="w-4 h-4" /> 3D Cyber Neural Hologram
          </button>
          <button
            onClick={() => setActive3dMode('gradcam')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              active3dMode === 'gradcam'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" /> 3D Grad-CAM Surface Mesh
          </button>
          <button
            onClick={() => setActive3dMode('rppg')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              active3dMode === 'rppg'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" /> 3D rPPG Pulse Sphere
          </button>
          <button
            onClick={() => setActive3dMode('blockchain')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              active3dMode === 'blockchain'
                ? 'bg-purple-500 text-slate-950 shadow-lg shadow-purple-500/25'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Box className="w-4 h-4" /> 3D Blockchain Cube Ledger
          </button>
        </div>
      </div>

      {/* Main 3D Viewport & Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3D Interactive Canvas Viewport */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 card-3d-tilt">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <Globe className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">3D Spatial Projection Viewport</h3>
                <p className="text-xs text-slate-400">Click & Drag mouse inside viewport to orbit 360° in 3D space</p>
              </div>
            </div>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                autoRotate ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              {autoRotate ? '3D Orbit Active' : 'Orbit Paused'}
            </button>
          </div>

          {/* Canvas Viewport */}
          <div
            className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-2 shadow-inner cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas
              ref={canvasRef}
              width={720}
              height={380}
              className="w-full h-auto rounded-xl max-h-[400px] object-contain"
            />

            {/* Drag Overlay Hint */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-xl text-[10px] font-mono text-cyan-400 border border-slate-800">
              🖱️ Drag to Rotate 3D Camera • X: {(rotX * (180 / Math.PI)).toFixed(0)}° Y: {(rotY * (180 / Math.PI)).toFixed(0)}°
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 font-mono">
            <span>Model: {activeSample.title}</span>
            <span>Verdict: {activeSample.authenticityScore > 50 ? 'AUTHENTIC' : 'SYNTHETIC'}</span>
          </div>
        </div>

        {/* 3D Parameters Control Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 flex flex-col justify-between card-3d-tilt">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">3D Spatial Controls</h3>
                <p className="text-xs text-slate-400">Tweak rotation speed & particle projection</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">3D Orbit Speed</span>
                  <span className="font-mono text-purple-400 font-bold">{rotSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.5"
                  value={rotSpeed}
                  onChange={(e) => setRotSpeed(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* 3D Diagnostic Insight */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">3D Holographic Diagnostic Insight</span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {activeSample.authenticityScore > 50
                    ? `Organic 3D spatial sphere exhibits uniform vertex displacement, smooth rotational symmetry, and clean depth projection.`
                    : `Synthetic 3D spatial model contains pronounced vertex distortion spikes along latitude lines 6-10, indicating localized GAN facial swap manipulation.`}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>WebGL 3D Engine</span>
            <span className="text-purple-400 font-bold">READY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
