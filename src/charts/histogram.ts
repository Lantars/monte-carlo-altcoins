import { percentile } from '../simulation/statistics'

export type HistogramBin = {
  label: string
  count: number
  start: number
  end: number
}

export function buildHistogram(
  values: ArrayLike<number>,
  binCount = 32,
): HistogramBin[] {
  if (values.length === 0) {
    return []
  }

  const start = percentile(values, 0.01)
  const end = percentile(values, 0.99)
  const span = Math.max(end - start, Number.EPSILON)
  const bins: HistogramBin[] = []

  for (let index = 0; index < binCount; index += 1) {
    const binStart = start + (span * index) / binCount
    const binEnd = start + (span * (index + 1)) / binCount
    bins.push({
      label: String(index),
      count: 0,
      start: binStart,
      end: binEnd,
    })
  }

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value < start || value > end) {
      continue
    }
    let binIndex = Math.floor(((value - start) / span) * binCount)
    if (binIndex === binCount) {
      binIndex = binCount - 1
    }
    bins[binIndex].count += 1
  }

  return bins
}
