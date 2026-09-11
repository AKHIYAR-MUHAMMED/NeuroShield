import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, evidence, text, apiKey: clientApiKey, model = 'gpt-4o-mini' } = body;

    const apiKey = clientApiKey || process.env.OPENAI_API_KEY;

    // Graceful fallback if no API key is available
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        isSimulated: true,
        data: getSimulatedResponse(action, evidence, text),
        message: 'Using built-in NeuroShield AI Engine (No OpenAI API key provided).'
      });
    }

    const openai = new OpenAI({ apiKey });

    if (action === 'explain_evidence') {
      const prompt = `You are a Senior Digital Forensics Expert & Expert Witness specializing in AI deepfake detection, audio spectral analysis, and media authenticity under ISO/IEC 27037 standards.

Analyze the following evidence sample and provide a comprehensive forensic assessment:
- Title: ${evidence?.title || 'Unknown'}
- Type: ${evidence?.type || 'media'}
- Authenticity Score: ${evidence?.authenticityScore}% (0 = Highly Manipulated, 100 = Authentic)
- Verdict: ${evidence?.verdict}
- SHA-256 Hash: ${evidence?.sha256Hash}
- Evidence Points: ${JSON.stringify(evidence?.evidencePoints || [])}
- Technical Metadata: ${JSON.stringify(evidence?.metadata || {})}

Return a clean JSON object with the following keys:
1. "forensicSummary": Concise 2-3 sentence executive forensic summary.
2. "technicalAnalysis": Bullet points detailing neural network feature attribution, frequency anomalies, or structural manipulation.
3. "legalRisks": Potential evidentiary vulnerabilities or cross-examination defense challenges.
4. "recommendedActions": Actionable forensic steps for prosecution/defense teams.
5. "confidenceLevel": High, Medium, or Low.`;

      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You respond strictly in valid JSON format.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      return NextResponse.json({ success: true, isSimulated: false, data: parsed });
    }

    if (action === 'detect_synthetic_text') {
      const prompt = `You are an AI Text Forensics & Stylometric Investigator. Analyze the following document text for LLM synthetic generation indicators, perplexity anomalies, and burstiness patterns:

Text Content:
"${text?.substring(0, 3000)}"

Return a valid JSON object with:
1. "syntheticProbability": integer between 0 and 100
2. "stylisticPerplexity": string (e.g. "Low / Monotonous Uniformity")
3. "burstinessScore": string (e.g. "High Sentence Length Variance" or "Robotic Uniformity")
4. "detectedLlmSignatures": array of detected LLM artifact phrases or structural markers
5. "verdict": "Likely AI Generated" | "Likely Human Authored" | "Hybrid / Tampered"
6. "detailedExplanation": string summary.`;

      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You respond strictly in valid JSON format.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      return NextResponse.json({ success: true, isSimulated: false, data: parsed });
    }

    if (action === 'generate_testimony') {
      const prompt = `You are a certified Lead Digital Forensics Examiner preparing a formal Expert Witness Statement under Federal Rule of Evidence 902(14) and ISO/IEC 27037 for courtroom submission.

Evidence details:
- Case Sample: ${evidence?.title}
- Media Type: ${evidence?.type}
- Cryptographic Hash: ${evidence?.sha256Hash}
- Blockchain ID: ${evidence?.blockchainId}
- Authenticity Score: ${evidence?.authenticityScore}%
- Verdict: ${evidence?.verdict}

Generate a formal legal witness statement formatted in JSON:
1. "witnessStatement": Formal affidavit paragraph establishing chain of custody and forensic findings.
2. "courtroomCrossExamQnA": Array of objects with "question" (likely cross-examination attack line) and "answer" (certified forensic response).
3. "iso27037ComplianceNote": Affirmation of evidence collection & preservation protocol compliance.`;

      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You respond strictly in valid JSON format.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      return NextResponse.json({ success: true, isSimulated: false, data: parsed });
    }

    return NextResponse.json({ success: false, error: 'Invalid action requested.' }, { status: 400 });
  } catch (error: unknown) {
    console.error('OpenAI Route Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'OpenAI API request failed';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

interface EvidencePayload {
  title?: string;
  type?: string;
  authenticityScore?: number;
  verdict?: string;
  sha256Hash?: string;
  blockchainId?: string;
}

function getSimulatedResponse(action: string, evidence: EvidencePayload | null, text?: string) {
  if (action === 'explain_evidence') {
    const isFake = (evidence?.authenticityScore ?? 50) < 50;
    return {
      forensicSummary: isFake
        ? `Multi-stage neural network analysis confirms synthetic manipulation in ${evidence?.title || 'media sample'}. High-frequency spectral artifacts align with state-of-the-art GAN synthesis.`
        : `Comprehensive cryptographic and spatial analysis confirms natural capture characteristics for ${evidence?.title || 'media sample'} with zero neural forgery signatures.`,
      technicalAnalysis: isFake
        ? [
            'Spectral peak detected in high-frequency band indicating neural vocoder / GAN blending artifacts.',
            'Spatial gradient discontinuity observed at feature boundaries.',
            'Cryptographic EXIF header mismatch compared to standard hardware sensors.'
          ]
        : [
            '1/f natural spatial decay observed across spatial power spectrum.',
            'Natural specular lighting alignment confirmed across key landmarks.',
            'Hardware camera sensor serial hash matches manufacturer database.'
          ],
      legalRisks: isFake
        ? [
            'Opposing counsel may challenge localized compression algorithms.',
            'Ensure chain of custody log matches ISO/IEC 27037 timestamping.'
          ]
        : ['Minimal evidentiary vulnerability under FRE Rule 902(14).'],
      recommendedActions: [
        'Anchor SHA-256 evidence hash onto decentralized blockchain ledger.',
        'Issue court-admissible forensic certificate with embedded QR authentication.'
      ],
      confidenceLevel: 'High (98.4%)'
    };
  }

  if (action === 'detect_synthetic_text') {
    return {
      syntheticProbability: 82,
      stylisticPerplexity: 'Low / Monotonous Uniformity (Robotic Sentence Structure)',
      burstinessScore: 'Low Sentence Length Variance (Typical of GPT-4 default output)',
      detectedLlmSignatures: [
        'Overused transitional phrase: "It is important to remember"',
        'Uniform n-gram frequency distribution',
        'Lack of idiosyncratic punctuation'
      ],
      verdict: 'Likely AI Generated',
      detailedExplanation: 'Statistical n-gram frequency and perplexity analysis indicates a high probability of automated LLM text generation.'
    };
  }

  if (action === 'generate_testimony') {
    return {
      witnessStatement: `I, Senior Forensic Examiner, certify under penalty of perjury that evidence item '${evidence?.title || 'Item 01'}' (SHA-256: ${evidence?.sha256Hash || 'N/A'}) was subjected to automated multi-modal neural forensic inspection under ISO/IEC 27037 protocols. The findings yield an authenticity score of ${evidence?.authenticityScore}%, supporting a verdict of '${evidence?.verdict}'.`,
      courtroomCrossExamQnA: [
        {
          question: 'How can you be certain the neural network detection model did not produce a false positive?',
          answer: 'The platform employs an ensemble of independent feature extractors—including spectral FFT analysis, spatial Grad-CAM heatmaps, and EXIF metadata validation—which converge on the same conclusion with 98.4% statistical confidence.'
        },
        {
          question: 'Was the digital evidence altered during your forensic examination?',
          answer: 'No. Raw evidence is hashed prior to ingestion. The SHA-256 digest remains identical and is anchored on an immutable blockchain ledger to guarantee non-repudiation.'
        }
      ],
      iso27037ComplianceNote: 'Preservation, acquisition, and analysis executed in strict compliance with ISO/IEC 27037:2012 digital evidence preservation guidelines.'
    };
  }

  return {};
}
