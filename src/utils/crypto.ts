// Helper function to calculate real SHA-256 hash from File, Blob, string or ArrayBuffer
export async function calculateSHA256(input: File | Blob | string | ArrayBuffer): Promise<string> {
  let arrayBuffer: ArrayBuffer;
  if (typeof input === 'string') {
    arrayBuffer = new TextEncoder().encode(input).buffer;
  } else if (input instanceof ArrayBuffer) {
    arrayBuffer = input;
  } else {
    arrayBuffer = await input.arrayBuffer();
  }
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Generate realistic simulated Ethereum/Polygon Contract Address
export function generateBlockchainTxId(): string {
  const chars = '0123456789ABCDEF';
  let tx = '0x';
  for (let i = 0; i < 40; i++) {
    tx += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return tx;
}

export function generateIPFSCid(): string {
  return 'Qm' + Array.from({ length: 44 }, () => 
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]
  ).join('');
}
