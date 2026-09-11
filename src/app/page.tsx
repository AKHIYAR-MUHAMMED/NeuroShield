'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Dashboard } from '@/components/Dashboard';
import { ScannerHub } from '@/components/scanner/ScannerHub';
import { BlockchainLedger } from '@/components/blockchain/BlockchainLedger';
import { QrVerifier } from '@/components/blockchain/QrVerifierModal';
import { CourtCertificate } from '@/components/certificate/CourtCertificate';
import { DatasetExplorer } from '@/components/datasets/DatasetExplorer';
import { XaiModal } from '@/components/xai/XaiModal';
import { OpenAiSettingsModal } from '@/components/openai/OpenAiSettingsModal';
import { EvidenceSample, SAMPLE_DATASETS } from '@/data/samples';
import confetti from 'canvas-confetti';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [customResults, setCustomResults] = useState<EvidenceSample[]>([]);
  const [selectedCertificateSample, setSelectedCertificateSample] = useState<EvidenceSample | null>(null);
  const [xaiSample, setXaiSample] = useState<EvidenceSample | null>(null);
  const [isXaiOpen, setIsXaiOpen] = useState<boolean>(false);
  const [isOpenAiSettingsOpen, setIsOpenAiSettingsOpen] = useState<boolean>(false);

  const handleAnalysisComplete = (result: EvidenceSample) => {
    setCustomResults(prev => [result, ...prev]);
    setSelectedCertificateSample(result);
    setActiveTab('certificate');

    // Trigger celebration confetti on on-chain hash registration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleSelectSample = (sample: EvidenceSample) => {
    setSelectedCertificateSample(sample);
    setActiveTab('certificate');
  };

  const handleOpenXai = (sample: EvidenceSample) => {
    setXaiSample(sample);
    setIsXaiOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-cyber-grid flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Bar */}
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onQuickVerify={() => setActiveTab('scanner')}
          onOpenOpenAiSettings={() => setIsOpenAiSettingsOpen(true)}
        />

        {/* Main Content Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              onSelectSample={handleSelectSample}
              onOpenXai={handleOpenXai}
            />
          )}

          {activeTab === 'scanner' && (
            <ScannerHub
              onAnalysisComplete={handleAnalysisComplete}
              onOpenXai={handleOpenXai}
            />
          )}

          {activeTab === 'ledger' && (
            <BlockchainLedger
              customResults={customResults}
              onSelectSample={handleSelectSample}
            />
          )}

          {activeTab === 'verifier' && (
            <QrVerifier
              customResults={customResults}
              onSelectSample={handleSelectSample}
            />
          )}

          {activeTab === 'certificate' && (
            <CourtCertificate
              sample={selectedCertificateSample || SAMPLE_DATASETS[0]}
              onBack={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'datasets' && (
            <DatasetExplorer
              onSelectSample={handleSelectSample}
              onOpenXai={handleOpenXai}
            />
          )}
        </main>
      </div>

      {/* XAI Modal */}
      <XaiModal
        sample={xaiSample}
        isOpen={isXaiOpen}
        onClose={() => setIsXaiOpen(false)}
      />

      {/* OpenAI Settings Modal */}
      <OpenAiSettingsModal
        isOpen={isOpenAiSettingsOpen}
        onClose={() => setIsOpenAiSettingsOpen(false)}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
