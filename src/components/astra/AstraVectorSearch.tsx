'use client';

import React, { useState } from 'react';
import { Database, Search, Sparkles, ShieldCheck, AlertTriangle, Layers, Cpu, RefreshCw } from 'lucide-react';
import { queryAstraVectorSimilarity, VectorSearchResult } from '../../utils/astra';

export const AstraVectorSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('FaceForensics++ GAN deepfake embedding vector sample');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<VectorSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVectorQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const res = await queryAstraVectorSimilarity(searchQuery, 4);
      if (res.success && res.results) {
        setResults(res.results);
      }
    } catch {
      // Handled gracefully
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 text-slate-100 shadow-xl relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300">
              DataStax Astra DB Vector Similarity Search
            </h3>
            <p className="text-xs text-slate-400">Query 1536-dim latent vector embeddings across global synthetic media registry</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-purple-950/80 border border-purple-800/50 px-3 py-1.5 rounded-xl text-purple-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span>Astra Vector Index Online</span>
        </div>
      </div>

      <form onSubmit={handleVectorQuery} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter evidence hash or deepfake feature description to query Astra DB..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isSearching ? 'Querying Astra...' : 'Vector Search'}
        </button>
      </form>

      {hasSearched && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
            <span>Astra DB Latent Cosine Similarity Top Matches</span>
            <span>Collection: deepfake_embeddings (1536-d)</span>
          </div>

          {results.map((res) => (
            <div
              key={res.id}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-purple-500/40 transition-all flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    res.threatLevel === 'CONFIRMED_SYNTHETIC'
                      ? 'bg-red-950 text-red-400 border border-red-800/40'
                      : res.threatLevel === 'SUSPECTED_DEEPFAKE'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                  }`}
                >
                  {res.threatLevel === 'AUTHENTIC' ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-200">{res.sampleTitle}</h4>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                    <span>Dataset: {res.metadata.datasetOrigin}</span>
                    <span>Model: {res.metadata.modelUsed}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Similarity Score</span>
                  <span className="text-xs font-bold font-mono text-purple-300">
                    {(res.similarityScore * 100).toFixed(2)}% Match
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md uppercase tracking-wider ${
                    res.threatLevel === 'CONFIRMED_SYNTHETIC'
                      ? 'bg-red-950 text-red-400 border border-red-500/40'
                      : res.threatLevel === 'SUSPECTED_DEEPFAKE'
                      ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {res.threatLevel.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
