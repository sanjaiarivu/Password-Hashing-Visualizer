const algorithmMetadata = {
  'SHA-256': { bits: 256, hexLength: 64 },
  'SHA-384': { bits: 384, hexLength: 96 },
  'SHA-512': { bits: 512, hexLength: 128 },
}

export const algorithms = Object.keys(algorithmMetadata)

export function getAlgorithmInfo(algorithm) {
  return algorithmMetadata[algorithm] ?? null
}

export async function generateHash(value, algorithm) {
  if (!value) throw new Error('EMPTY_INPUT')
  if (!getAlgorithmInfo(algorithm) || !window.crypto?.subtle) throw new Error('UNSUPPORTED')

  const encoded = new TextEncoder().encode(value)
  const digest = await window.crypto.subtle.digest(algorithm, encoded)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function countDifferentCharacters(first, second) {
  const length = Math.max(first.length, second.length)
  return Array.from({ length }, (_, index) => first[index] !== second[index]).filter(Boolean).length
}

/* ── Bit-level comparison utilities ─────────────────────────── */

const hexNibbleToBin = {
  '0': '0000', '1': '0001', '2': '0010', '3': '0011',
  '4': '0100', '5': '0101', '6': '0110', '7': '0111',
  '8': '1000', '9': '1001', 'a': '1010', 'b': '1011',
  'c': '1100', 'd': '1101', 'e': '1110', 'f': '1111',
}

/** Convert a lowercase hex string to its binary representation. */
export function hexToBinary(hex) {
  return hex.split('').map((ch) => hexNibbleToBin[ch] ?? '0000').join('')
}

/** Count the number of differing bits between two hex hashes. */
export function countDifferentBits(hexA, hexB) {
  const binA = hexToBinary(hexA)
  const binB = hexToBinary(hexB)
  const len = Math.max(binA.length, binB.length)
  let count = 0
  for (let i = 0; i < len; i++) {
    if (binA[i] !== binB[i]) count++
  }
  return count
}

/**
 * Return an array of booleans — one per hex character — where `true`
 * means the corresponding hex character differs between the two hashes.
 */
export function getCharDiffMap(hexA, hexB) {
  const len = Math.max(hexA.length, hexB.length)
  return Array.from({ length: len }, (_, i) => hexA[i] !== hexB[i])
}
