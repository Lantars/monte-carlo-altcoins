/**
 * Mulberry32: a small 32-bit PRNG. Returns uniforms in [0, 1).
 * Same seed => same sequence, which keeps debugging deterministic.
 */
export function createMulberry32(seed: number): () => number {
  let state = seed >>> 0

  return function nextUniform(): number {
    state += 0x6d2b79f5
    let next = Math.imul(state ^ (state >>> 15), 1 | state)
    next ^= next + Math.imul(next ^ (next >>> 7), 61 | next)
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Standard normal shock via Box–Muller.
 * Uses two uniforms from the provided generator.
 */
export function nextStandardNormal(nextUniform: () => number): number {
  let uniform = 0
  while (uniform === 0) {
    uniform = nextUniform()
  }
  const angle = 2 * Math.PI * nextUniform()
  return Math.sqrt(-2 * Math.log(uniform)) * Math.cos(angle)
}
