/**
 * One Geometric Brownian Motion step:
 *
 *   S(t + dt) = S(t) * exp((μ − ½ σ²) dt + σ √dt Z)
 *
 * μ is the annual continuously compounded expected return,
 * σ is annual volatility, dt is the time step in years,
 * Z is a standard normal shock.
 *
 * Assumptions: constant μ and σ, independent normal log-returns,
 * no jumps, no mean-reversion, no stochastic volatility.
 */
export function nextGbmPrice(
  currentPrice: number,
  expectedReturn: number,
  annualVolatility: number,
  timeStepYears: number,
  randomShock: number,
): number {
  const varianceTerm = annualVolatility * annualVolatility
  const drift = (expectedReturn - 0.5 * varianceTerm) * timeStepYears
  const diffusion =
    annualVolatility * Math.sqrt(timeStepYears) * randomShock
  const logIncrement = drift + diffusion

  // Keep extreme shocks finite so percentiles remain well-defined.
  if (logIncrement > 700) {
    return Number.MAX_VALUE / 1e6
  }
  if (logIncrement < -700) {
    return Number.MIN_VALUE * 1e6
  }

  const nextPrice = currentPrice * Math.exp(logIncrement)
  if (!Number.isFinite(nextPrice) || nextPrice <= 0) {
    return currentPrice
  }
  return nextPrice
}
