const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) {
    return '—'
  }
  if (Math.abs(value) >= 1_000_000) {
    return compactCurrencyFormatter.format(value)
  }
  return currencyFormatter.format(value)
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) {
    return '—'
  }
  return percentFormatter.format(value)
}

export function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function parametersEqual(
  left: { seed: number; simulationCount: number; horizonMonths: number; expectedReturn: number; annualVolatility: number; initialCapital: number; initialPrice: number; stepsPerYear: number },
  right: typeof left,
): boolean {
  return (
    left.seed === right.seed &&
    left.simulationCount === right.simulationCount &&
    left.horizonMonths === right.horizonMonths &&
    left.expectedReturn === right.expectedReturn &&
    left.annualVolatility === right.annualVolatility &&
    left.initialCapital === right.initialCapital &&
    left.initialPrice === right.initialPrice &&
    left.stepsPerYear === right.stepsPerYear
  )
}
