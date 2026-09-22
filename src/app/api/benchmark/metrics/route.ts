import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    benchmarkScores: [
      { dataset: 'FaceForensics++', precision: 99.1, recall: 98.4, f1: 98.7, auc: 0.996, eer: '1.2%' },
      { dataset: 'Celeb-DF v2', precision: 97.8, recall: 96.9, f1: 97.3, auc: 0.989, eer: '2.1%' },
      { dataset: 'DFDC Challenge', precision: 96.2, recall: 95.4, f1: 95.8, auc: 0.978, eer: '3.4%' },
      { dataset: 'ASVspoof 2024', precision: 98.9, recall: 98.1, f1: 98.5, auc: 0.994, eer: '1.1%' },
      { dataset: 'DocTamper', precision: 99.4, recall: 98.8, f1: 99.1, auc: 0.998, eer: '0.8%' },
    ],
  });
}
