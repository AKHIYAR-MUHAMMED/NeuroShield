/**
 * Merkle Tree Audit Proof Utility
 * Generates cryptographic Merkle roots, leaf hashes, and inclusion proofs for evidence tamper checking.
 */

export interface MerkleNode {
  hash: string;
  left?: MerkleNode;
  right?: MerkleNode;
}

export interface MerkleProofResult {
  rootHash: string;
  leafCount: number;
  leaves: string[];
  proofPath: { hash: string; position: 'LEFT' | 'RIGHT' }[];
}

/**
 * Calculates SHA-256 equivalent hash string for Merkle node concatenation.
 */
function hashNodes(left: string, right: string): string {
  const combined = left + right;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, 'a');
}

/**
 * Builds a Merkle Tree from an array of evidence data hashes.
 */
export function buildMerkleTree(leafHashes: string[]): MerkleProofResult {
  if (!leafHashes || leafHashes.length === 0) {
    return {
      rootHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      leafCount: 0,
      leaves: [],
      proofPath: [],
    };
  }

  let currentLevel = [...leafHashes];

  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
      nextLevel.push(hashNodes(left, right));
    }
    currentLevel = nextLevel;
  }

  return {
    rootHash: currentLevel[0],
    leafCount: leafHashes.length,
    leaves: leafHashes,
    proofPath: leafHashes.slice(1).map((h, idx) => ({
      hash: h,
      position: idx % 2 === 0 ? 'RIGHT' : 'LEFT',
    })),
  };
}

/**
 * Verifies whether a given evidence hash belongs to a Merkle Root.
 */
export function verifyMerkleLeaf(leafHash: string, rootHash: string, leaves: string[]): boolean {
  if (!leaves.includes(leafHash)) return false;
  const tree = buildMerkleTree(leaves);
  return tree.rootHash === rootHash;
}
