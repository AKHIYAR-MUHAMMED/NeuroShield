import { buildMerkleTree, verifyMerkleLeaf } from '../merkleProof';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test assertion failed: ${message}`);
  }
}

export function runMerkleProofTests() {
  console.log('[Test Suite] Running Merkle Proof verification tests...');

  // Test 1: Empty leaf list fallback
  const emptyTree = buildMerkleTree([]);
  assert(emptyTree.leafCount === 0, 'Empty tree must have leafCount = 0');
  assert(emptyTree.rootHash.startsWith('0x0000'), 'Empty tree root should be zeroed');

  // Test 2: Valid Merkle tree construction
  const hashes = [
    '0xa1b2c3d4e5f6',
    '0xf6e5d4c3b2a1',
    '0x1234567890ab',
    '0xba0987654321',
  ];
  const tree = buildMerkleTree(hashes);
  assert(tree.leafCount === 4, 'Tree leaf count must be 4');
  assert(tree.rootHash.length === 66, 'Root hash must be a 66-character hex string');

  // Test 3: Valid leaf verification
  const isValid = verifyMerkleLeaf('0xa1b2c3d4e5f6', tree.rootHash, hashes);
  assert(isValid === true, 'Leaf present in hashes must verify successfully');

  // Test 4: Invalid leaf verification
  const isInvalid = verifyMerkleLeaf('0xbadleaf12345', tree.rootHash, hashes);
  assert(isInvalid === false, 'Tampered leaf must fail verification');

  console.log('[Test Suite] Merkle proof tests passed successfully.');
}
