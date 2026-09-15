/**
 * Multi-LLM Forensic Router & Ensemble Bridge for NeuroShield
 * Coordinates 10 top LLM backends for multi-model deepfake verification,
 * consensus agreement scoring, and offline fallback routing.
 */

export interface LlmProvider {
  id: string;
  name: string;
  vendor: string;
  modelName: string;
  isLocal: boolean;
  active: boolean;
  weight: number; // 0.0 to 1.0 weight in consensus scoring
  latencyMs: number;
  apiKeyStorageKey?: string;
  status: 'ONLINE' | 'STANDBY' | 'DEGRADED' | 'OFFLINE';
}

export interface MultiLlmConsensusResult {
  consensusScore: number; // 0% to 100% deepfake probability
  agreementRatio: number; // 0.0 to 1.0 (e.g. 0.9 = 9/10 models agree)
  finalVerdict: 'AUTHENTIC' | 'SUSPECT' | 'CONFIRMED_DEEPFAKE';
  modelsConsultedCount: number;
  breakdown: {
    providerId: string;
    providerName: string;
    modelName: string;
    verdict: 'REAL' | 'SYNTHETIC';
    confidence: number;
    latencyMs: number;
  }[];
  timestampUtc: string;
}

export const DEFAULT_10_LLM_PROVIDERS: LlmProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI GPT-4o',
    vendor: 'OpenAI',
    modelName: 'gpt-4o',
    isLocal: false,
    active: true,
    weight: 0.15,
    latencyMs: 140,
    status: 'ONLINE',
    apiKeyStorageKey: 'neuroshield_openai_api_key',
  },
  {
    id: 'gemini',
    name: 'Google Gemini 1.5 Pro',
    vendor: 'Google DeepMind',
    modelName: 'gemini-1.5-pro',
    isLocal: false,
    active: true,
    weight: 0.15,
    latencyMs: 110,
    status: 'ONLINE',
    apiKeyStorageKey: 'neuroshield_gemini_api_key',
  },
  {
    id: 'claude',
    name: 'Anthropic Claude 3.5 Sonnet',
    vendor: 'Anthropic',
    modelName: 'claude-3-5-sonnet-20241022',
    isLocal: false,
    active: true,
    weight: 0.15,
    latencyMs: 160,
    status: 'ONLINE',
    apiKeyStorageKey: 'neuroshield_claude_api_key',
  },
  {
    id: 'llama',
    name: 'Meta Llama 3.3 70B',
    vendor: 'Meta AI',
    modelName: 'llama-3.3-70b-versatile',
    isLocal: false,
    active: true,
    weight: 0.10,
    latencyMs: 85,
    status: 'ONLINE',
    apiKeyStorageKey: 'neuroshield_groq_api_key',
  },
  {
    id: 'mistral',
    name: 'Mistral Large 2',
    vendor: 'Mistral AI',
    modelName: 'mistral-large-latest',
    isLocal: false,
    active: true,
    weight: 0.09,
    latencyMs: 125,
    status: 'ONLINE',
    apiKeyStorageKey: 'neuroshield_mistral_api_key',
  },
  {
    id: 'cohere',
    name: 'Cohere Command R+',
    vendor: 'Cohere',
    modelName: 'command-r-plus',
    isLocal: false,
    active: true,
    weight: 0.08,
    latencyMs: 135,
    status: 'ONLINE',
    apiKeyStorageKey: 'neuroshield_cohere_api_key',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek R1 / V3',
    vendor: 'DeepSeek AI',
    modelName: 'deepseek-reasoner',
    isLocal: false,
    active: true,
    weight: 0.10,
    latencyMs: 195,
    status: 'ONLINE',
    apiKeyStorageKey: 'neuroshield_deepseek_api_key',
  },
  {
    id: 'qwen',
    name: 'Qwen 2.5 Max',
    vendor: 'Alibaba Cloud',
    modelName: 'qwen-max-latest',
    isLocal: false,
    active: true,
    weight: 0.06,
    latencyMs: 175,
    status: 'ONLINE',
    apiKeyStorageKey: 'neuroshield_dashscope_api_key',
  },
  {
    id: 'perplexity',
    name: 'Perplexity Sonar Deep Research',
    vendor: 'Perplexity AI',
    modelName: 'sonar-reasoning-pro',
    isLocal: false,
    active: true,
    weight: 0.06,
    latencyMs: 220,
    status: 'ONLINE',
    apiKeyStorageKey: 'neuroshield_perplexity_api_key',
  },
  {
    id: 'ollama',
    name: 'Local Ollama Offline Vault',
    vendor: 'Self-Hosted',
    modelName: 'llama3:8b-instruct-fp16',
    isLocal: true,
    active: true,
    weight: 0.06,
    latencyMs: 45,
    status: 'ONLINE',
  },
];

const LLM_ROUTER_CONFIG_KEY = 'neuroshield_llm_router_providers_v1';

export function getLlmProviders(): LlmProvider[] {
  if (typeof window === 'undefined') return DEFAULT_10_LLM_PROVIDERS;
  const stored = localStorage.getItem(LLM_ROUTER_CONFIG_KEY);
  if (!stored) return DEFAULT_10_LLM_PROVIDERS;
  try {
    const parsed: LlmProvider[] = JSON.parse(stored);
    return DEFAULT_10_LLM_PROVIDERS.map((def) => {
      const found = parsed.find((p) => p.id === def.id);
      return found ? { ...def, ...found } : def;
    });
  } catch {
    return DEFAULT_10_LLM_PROVIDERS;
  }
}

export function saveLlmProviderConfig(id: string, updates: Partial<LlmProvider>): LlmProvider[] {
  const providers = getLlmProviders();
  const updated = providers.map((p) => (p.id === id ? { ...p, ...updates } : p));
  if (typeof window !== 'undefined') {
    localStorage.setItem(LLM_ROUTER_CONFIG_KEY, JSON.stringify(updated));
  }
  return updated;
}

/**
 * Calculates weighted ensemble consensus across all active LLM backend predictions.
 */
export function calculateMultiLlmConsensusScore(
  providerResponses: { providerId: string; syntheticProbability: number; latencyMs?: number }[]
): MultiLlmConsensusResult {
  const providers = getLlmProviders();
  let totalWeightedScore = 0;
  let totalActiveWeight = 0;
  let syntheticVotes = 0;

  const breakdown: MultiLlmConsensusResult['breakdown'] = [];

  for (const resp of providerResponses) {
    const prov = providers.find((p) => p.id === resp.providerId) || {
      id: resp.providerId,
      name: resp.providerId.toUpperCase(),
      modelName: 'default-model',
      weight: 0.1,
      latencyMs: 100,
    };

    const isSynthetic = resp.syntheticProbability > 0.5;
    if (isSynthetic) syntheticVotes++;

    const weight = prov.weight || 0.1;
    totalWeightedScore += resp.syntheticProbability * weight;
    totalActiveWeight += weight;

    breakdown.push({
      providerId: resp.providerId,
      providerName: prov.name,
      modelName: prov.modelName,
      verdict: isSynthetic ? 'SYNTHETIC' : 'REAL',
      confidence: parseFloat(resp.syntheticProbability.toFixed(2)),
      latencyMs: resp.latencyMs || prov.latencyMs || 100,
    });
  }

  const consensusScore = totalActiveWeight > 0 ? parseFloat((totalWeightedScore / totalActiveWeight).toFixed(2)) : 0.5;
  const agreementRatio = breakdown.length > 0 ? parseFloat((Math.max(syntheticVotes, breakdown.length - syntheticVotes) / breakdown.length).toFixed(2)) : 1.0;

  let finalVerdict: MultiLlmConsensusResult['finalVerdict'] = 'AUTHENTIC';
  if (consensusScore > 0.7) finalVerdict = 'CONFIRMED_DEEPFAKE';
  else if (consensusScore > 0.35) finalVerdict = 'SUSPECT';

  return {
    consensusScore,
    agreementRatio,
    finalVerdict,
    modelsConsultedCount: breakdown.length,
    breakdown,
    timestampUtc: new Date().toISOString(),
  };
}
