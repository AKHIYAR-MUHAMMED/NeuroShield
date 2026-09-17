import { NextResponse } from 'next/server';
import { buildMerkleTree, verifyMerkleLeaf } from '../../../../utils/merkleProof';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const targetHash: string = body?.targetHash || '';
    const leaves: string[] = Array.isArray(body?.leaves) ? body.leaves : [];

    if (!targetHash || leaves.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Target hash and non-empty leaves array required.' },
        { status: 400 }
      );
    }

    const tree = buildMerkleTree(leaves);
    const isValid = verifyMerkleLeaf(targetHash, tree.rootHash, leaves);

    return NextResponse.json(
      {
        success: true,
        isValid,
        rootHash: tree.rootHash,
        leafCount: tree.leafCount,
        verifiedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Merkle API error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
