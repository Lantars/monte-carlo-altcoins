/**
 * Maximum drawdown of a level series (price or portfolio value):
 *
 *   drawdown_t = (value_t − running_max_t) / running_max_t
 *
 * The path maximum drawdown is the most negative drawdown on the path.
 * Values are simulated-path statistics, not historical drawdowns.
 */
export function maximumDrawdown(values: ArrayLike<number>): number {
  if (values.length === 0) {
    return 0
  }

  let runningMax = values[0]
  let worstDrawdown = 0

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value > runningMax) {
      runningMax = value
    }
    if (runningMax <= 0) {
      continue
    }
    const drawdown = (value - runningMax) / runningMax
    if (drawdown < worstDrawdown) {
      worstDrawdown = drawdown
    }
  }

  return worstDrawdown
}
