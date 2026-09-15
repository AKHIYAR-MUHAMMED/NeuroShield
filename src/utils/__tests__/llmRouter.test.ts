import {
  DEFAULT_10_LLM_PROVIDERS,
  calculateMultiLlmConsensusScore,
  getLlmProviders,
} from '../llmRouter';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test assertion failed: ${message}`);
  }
}

export function runLlmRouterTests() {
  console.log('[Test Suite] Running 10 LLM Backend Router tests...');

  // Test 1: Verify 10 LLM providers are configured
  const providers = getLlmProviders();
  assert(providers.length === 10, 'Provider count must equal exactly 10');
  assert(providers.some((p) => p.id === 'openai'), 'OpenAI provider missing');
  assert(providers.some((p) => p.id === 'gemini'), 'Gemini provider missing');
  assert(providers.some((p) => p.id === 'claude'), 'Claude provider missing');
  assert(providers.some((p) => p.id === 'llama'), 'Llama provider missing');
  assert(providers.some((p) => p.id === 'mistral'), 'Mistral provider missing');
  assert(providers.some((p) => p.id === 'cohere'), 'Cohere provider missing');
  assert(providers.some((p) => p.id === 'deepseek'), 'DeepSeek provider missing');
  assert(providers.some((p) => p.id === 'qwen'), 'Qwen provider missing');
  assert(providers.some((p) => p.id === 'perplexity'), 'Perplexity provider missing');
  assert(providers.some((p) => p.id === 'ollama'), 'Local Ollama provider missing');

  // Test 2: Multi-LLM Consensus Calculation
  const mockResponses = providers.map((p) => ({
    providerId: p.id,
    syntheticProbability: 0.85,
  }));

  const consensus = calculateMultiLlmConsensusScore(mockResponses);
  assert(consensus.modelsConsultedCount === 10, 'Must consult 10 models');
  assert(consensus.consensusScore >= 0.8, 'Consensus score must be >= 0.8');
  assert(consensus.agreementRatio === 1.0, 'Agreement ratio must be 1.0 (unanimous)');
  assert(consensus.finalVerdict === 'CONFIRMED_DEEPFAKE', 'Final verdict must be CONFIRMED_DEEPFAKE');

  console.log('[Test Suite] All 10 LLM Backend Router tests passed successfully.');
}
