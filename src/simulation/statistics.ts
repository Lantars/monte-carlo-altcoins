function toSortedCopy(values: ArrayLike<number>): Float64Array {
  const sorted = new Float64Array(values.length)
  sorted.set(values)
  sorted.sort()
  return sorted
}

export function mean(values: ArrayLike<number>): number {
  if (values.length === 0) {
    return Number.NaN
  }
  let total = 0
  for (let index = 0; index < values.length; index += 1) {
    total += values[index]
  }
  return total / values.length
}

/**
 * Linear interpolation percentile. `p` is in [0, 1].
 * Index = p * (n − 1).
 */
export function percentile(values: ArrayLike<number>, p: number): number {
  if (values.length === 0) {
    return Number.NaN
  }
  const clamped = Math.min(1, Math.max(0, p))
  const sorted = toSortedCopy(values)
  const position = clamped * (sorted.length - 1)
  const lowerIndex = Math.floor(position)
  const upperIndex = Math.ceil(position)
  if (lowerIndex === upperIndex) {
    return sorted[lowerIndex]
  }
  const weight = position - lowerIndex
  return sorted[lowerIndex] * (1 - weight) + sorted[upperIndex] * weight
}

export function probabilityBelow(
  values: ArrayLike<number>,
  threshold: number,
): number {
  if (values.length === 0) {
    return Number.NaN
  }
  let count = 0
  for (let index = 0; index < values.length; index += 1) {
    if (values[index] < threshold) {
      count += 1
    }
  }
  return count / values.length
}

export function probabilityAtOrAbove(
  values: ArrayLike<number>,
  threshold: number,
): number {
  if (values.length === 0) {
    return Number.NaN
  }
  let count = 0
  for (let index = 0; index < values.length; index += 1) {
    if (values[index] >= threshold) {
      count += 1
    }
  }
  return count / values.length
}

export function sampleStandardDeviation(values: ArrayLike<number>): number {
  if (values.length < 2) {
    return Number.NaN
  }
  const average = mean(values)
  let sumSquares = 0
  for (let index = 0; index < values.length; index += 1) {
    const delta = values[index] - average
    sumSquares += delta * delta
  }
  return Math.sqrt(sumSquares / (values.length - 1))
}
