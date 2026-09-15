'use client';

import React, { useState } from 'react';
import { Sliders, Eye, Palette, RotateCcw, Sparkles } from 'lucide-react';
import { HeatmapPalette } from '../../utils/xaiHeatmap';

interface HeatmapControlPanelProps {
  onSettingsChange?: (settings: {
    opacity: number;
    threshold: number;
    palette: HeatmapPalette;
    gridDensity: number;
  }) => void;
}

export const HeatmapControlPanel: React.FC<HeatmapControlPanelProps> = ({
  onSettingsChange,
}) => {
  const [opacity, setOpacity] = useState<number>(0.75);
  const [threshold, setThreshold] = useState<number>(0.65);
  const [palette, setPalette] = useState<HeatmapPalette>('thermal');
  const [gridDensity, setGridDensity] = useState<number>(16);

  const update = (
    newOpacity = opacity,
    newThreshold = threshold,
    newPalette = palette,
    newDensity = gridDensity
  ) => {
    if (onSettingsChange) {
      onSettingsChange({
        opacity: newOpacity,
        threshold: newThreshold,
        palette: newPalette,
        gridDensity: newDensity,
      });
    }
  };

  const handleReset = () => {
    setOpacity(0.75);
    setThreshold(0.65);
    setPalette('thermal');
    setGridDensity(16);
    update(0.75, 0.65, 'thermal', 16);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-base text-white">XAI Heatmap Sensitivity Controls</h4>
            <p className="text-xs text-slate-400">Customize activation threshold and thermal overlay parameters</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          aria-label="Reset heatmap settings"
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Opacity Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              Overlay Opacity
            </span>
            <span className="text-purple-400 font-mono">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={opacity}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setOpacity(val);
              update(val, threshold, palette, gridDensity);
            }}
            aria-label="Adjust overlay opacity"
            className="w-full accent-purple-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Sensitivity Threshold Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Sensitivity Threshold
            </span>
            <span className="text-purple-400 font-mono">{Math.round(threshold * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.4"
            max="0.95"
            step="0.05"
            value={threshold}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setThreshold(val);
              update(opacity, val, palette, gridDensity);
            }}
            aria-label="Adjust sensitivity threshold"
            className="w-full accent-purple-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Palette Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          Color Scheme Palette
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['thermal', 'infrared', 'neon'] as HeatmapPalette[]).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPalette(p);
                update(opacity, threshold, p, gridDensity);
              }}
              className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                palette === p
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {p} Mode
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
