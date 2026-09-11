import { EvidenceSample } from '@/data/samples';

export interface OpenAiExplanationResult {
  forensicSummary: string;
  technicalAnalysis: string[];
  legalRisks: string[];
  recommendedActions: string[];
  confidenceLevel: string;
}

export interface OpenAiSyntheticTextResult {
  syntheticProbability: number;
  stylisticPerplexity: string;
  burstinessScore: string;
  detectedLlmSignatures: string[];
  verdict: 'Likely AI Generated' | 'Likely Human Authored' | 'Hybrid / Tampered';
  detailedExplanation: string;
}

export interface OpenAiTestimonyResult {
  witnessStatement: string;
  courtroomCrossExamQnA: { question: string; answer: string }[];
  iso27037ComplianceNote: string;
}

export interface OpenAiApiResponse<T> {
  success: boolean;
  isSimulated?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const STORAGE_KEY_API_KEY = 'neuroshield_openai_api_key';
const STORAGE_KEY_MODEL = 'neuroshield_openai_model';

export const getStoredOpenAiApiKey = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
};

export const setStoredOpenAiApiKey = (key: string): void => {
  if (typeof window === 'undefined') return;
  if (!key) {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
  }
};

export const getStoredOpenAiModel = (): string => {
  if (typeof window === 'undefined') return 'gpt-4o-mini';
  return localStorage.getItem(STORAGE_KEY_MODEL) || 'gpt-4o-mini';
};

export const setStoredOpenAiModel = (model: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_MODEL, model);
};

export async function requestOpenAiAnalysis<T>(
  action: 'explain_evidence' | 'detect_synthetic_text' | 'generate_testimony',
  payload: { evidence?: EvidenceSample; text?: string }
): Promise<OpenAiApiResponse<T>> {
  try {
    const apiKey = getStoredOpenAiApiKey();
    const model = getStoredOpenAiModel();

    const response = await fetch('/api/openai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        evidence: payload.evidence,
        text: payload.text,
        apiKey: apiKey || undefined,
        model
      })
    });

    const json = await response.json();
    return json as OpenAiApiResponse<T>;
  } catch (err: unknown) {
    console.error('Client OpenAI API Request Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to reach OpenAI server route';
    return {
      success: false,
      error: errorMessage
    };
  }
}
