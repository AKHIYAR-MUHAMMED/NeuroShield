'use client';

import React, { useState } from 'react';
import { Palette, Eye, Sparkles } from 'lucide-react';

export type ColorMapPreset = 'JET' | 'VIRIDIS' | 'PLASMA' | 'MAGMA' | 'INFERNO';

interface HeatmapColorPickerProps {
  selectedPreset?: ColorMapPreset;
  onPresetChange?: (preset: ColorMapPreset) => void;
}

export const HeatmapColorPicker: React.FC<HeatmapColorPickerProps> = ({
  selectedPreset = 'JET',
  onPresetChange,
}) => {
  const [current, setCurrent] = useState<ColorMapPreset>(selectedPreset);

  const presets: { id: ColorMapPreset; label: string; gradient: string }[] = [
    { id: 'JET', label: 'Jet (Classic OpenCV)', gradient: 'from-blue-600 via-yellow-400 to-red-600' },
    { id: 'VIRIDIS', label: 'Viridis (Perceptual)', gradient: 'from-purple-900 via-teal-500 to-yellow-300' },
    { id: 'PLASMA', label: 'Plasma (High Contrast)', gradient: 'from-purple-900 via-pink-500 to-yellow-400' },
    { id: 'MAGMA', label: 'Magma (Deep Dark)', gradient: 'from-slate-950 via-red-800 to-yellow-200' },
    { id: 'INFERNO', label: 'Inferno (Thermal)', gradient: 'from-black via-red-600 to-yellow-300' },
  ];

  const handleSelect = (id: ColorMapPreset) => {
    setCurrent(id);
    if (onPresetChange) onPresetChange(id);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <Palette className="w-5 h-5 text-pink-400" />
        <div>
          <h4 className="font-bold text-sm">Grad-CAM Heatmap Colormap Preset</h4>
          <p className="text-xs text-slate-400">Select spectral gradient for neural activation overlays</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelect(p.id)}
            className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all ${
              current === p.id
                ? 'bg-slate-950 border-pink-500/80 shadow-lg shadow-pink-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center w-full">
              <span className="text-xs font-semibold text-slate-200">{p.label}</span>
              {current === p.id && <Sparkles className="w-3.5 h-3.5 text-pink-400" />}
            </div>

            <div className={`w-full h-3 rounded-full bg-gradient-to-r ${p.gradient}`} />
          </button>
        ))}
      </div>
    </div>
  );
};
