import {
  getAstraAutoSyncConfig,
  saveAstraAutoSyncConfig,
  enqueueEvidenceForAstraSync,
  DEFAULT_AUTO_SYNC_CONFIG,
} from '../astraAutoSync';
import { EvidenceSample } from '@/data/samples';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test assertion failed: ${message}`);
  }
}

export function runAstraAutoSyncTests() {
  console.log('[Test Suite] Running Astra DB Content Automation tests...');

  // Test 1: Config defaults
  const config = getAstraAutoSyncConfig();
  assert(config.enabled === true, 'Default auto-sync must be enabled');
  assert(config.syncIntervalSec === 30, 'Default sync interval must be 30 seconds');

  // Test 2: Save config changes
  const updated = saveAstraAutoSyncConfig({ syncIntervalSec: 60, enabled: false });
  assert(updated.syncIntervalSec === 60, 'Updated sync interval must equal 60');
  assert(updated.enabled === false, 'Updated enabled flag must be false');

  // Reset config back to default for clean state
  saveAstraAutoSyncConfig(DEFAULT_AUTO_SYNC_CONFIG);

  // Test 3: Queue sample addition
  const testSample: EvidenceSample = {
    id: 'TEST-ASTRA-001',
    title: 'Test Audio Clip for Astra Sync',
    type: 'audio',
    datasetName: 'ASVspoof 2024 Test',
    authenticityScore: 92,
    verdict: 'Likely Real',
    previewUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04',
    sha256Hash: '0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0',
    blockchainId: '0x123456789',
    blockNumber: 19842100,
    timestamp: '2026-09-16 00:00:00 UTC',
    fileSize: '1.4 MB',
    mimeType: 'audio/wav',
    evidencePoints: [],
    metadata: {
      model: 'Wav2Vec2',
      confidence: 0.95,
    },
  };

  enqueueEvidenceForAstraSync(testSample);

  console.log('[Test Suite] All Astra DB Content Automation tests passed successfully.');
}
