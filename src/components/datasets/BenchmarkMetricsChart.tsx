'use client';

import React from 'react';
import { BarChart3, TrendingUp, Cpu, Award } from 'lucide-react';

interface MetricItem {
  datasetName: string;
  accuracy: number;
  aucScore: number;
  eer: number; // Equal Error Rate (%)
}

const benchmarkData: MetricItem[] = [
  { datasetName: 'FaceForensics++', accuracy: 98.4, aucScore: 0.992, eer: 1.6 },
  { datasetName: 'Celeb-DF v2', accuracy: 96.8, aucScore: 0.985, eer: 3.2 },
  { datasetName: 'DFDC Challenge', accuracy: 94.2, aucScore: 0.961, eer: 5.8 },
  { datasetName: 'ASVspoof 2024', accuracy: 99.1, aucScore: 0.998, eer: 0.9 },
  { datasetName: 'DocTamper v1', accuracy: 97.5, aucScore: 0.989, eer: 2.5 },
];

export const BenchmarkMetricsChart: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          <div>
            <h3 className="text-lg font-bold">Neural Model Performance Benchmarks</h3>
            <p className="text-xs text-slate-400">Validated across standard forensic dataset challenges</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-purple-950/60 border border-purple-800/40 px-3 py-1.5 rounded-lg text-purple-300 text-xs font-semibold">
          <Award className="w-4 h-4 text-purple-400" />
          <span>SOTA Standard AUC 0.985+</span>
        </div>
      </div>

      <div className="space-y-4">
        {benchmarkData.map((item) => (
          <div key={item.datasetName} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-sm text-purple-300">{item.datasetName}</span>
              <div className="flex gap-4 text-xs font-mono">
                <span className="text-slate-400">Acc: <strong className="text-emerald-400">{item.accuracy}%</strong></span>
                <span className="text-slate-400">AUC: <strong className="text-purple-400">{item.aucScore}</strong></span>
                <span className="text-slate-400">EER: <strong className="text-amber-400">{item.eer}%</strong></span>
              </div>
            </div>

            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${item.accuracy}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
