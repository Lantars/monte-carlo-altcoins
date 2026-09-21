import { formatCurrency, formatPercent } from '../utils/format'
import type { SimulationResult } from '../types/simulation'

type ResultsPanelProps = {
  result: SimulationResult
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  const { summary, parameters } = result

  return (
    <section className="results-grid">
      <Metric
        label="Median"
        value={formatCurrency(summary.medianFinalValue)}
        note="50th percentile of simulated finals"
      />
      <Metric
        label="Mean"
        value={formatCurrency(summary.meanFinalValue)}
        note="Arithmetic average. Can be pulled by a few extreme paths."
      />
      <Metric
        label="5th percentile"
        value={formatCurrency(summary.percentile5)}
      />
      <Metric
        label="25th percentile"
        value={formatCurrency(summary.percentile25)}
      />
      <Metric
        label="75th percentile"
        value={formatCurrency(summary.percentile75)}
      />
      <Metric
        label="95th percentile"
        value={formatCurrency(summary.percentile95)}
      />
      <Metric
        label="P(loss)"
        value={formatPercent(summary.probabilityOfLoss)}
        note={`Share of paths ending below ${formatCurrency(parameters.initialCapital)}`}
      />
      <Metric
        label="P(−50%)"
        value={formatPercent(summary.probabilityOfLossOver50)}
        note="Share of paths ending below half of initial capital"
      />
      <Metric
        label="P(2×)"
        value={formatPercent(summary.probabilityOfDoubling)}
        note="Share of paths ending at or above 2× initial capital"
      />
      <Metric
        label="Median max drawdown"
        value={formatPercent(summary.medianMaximumDrawdown)}
        note="Simulated path drawdowns under this model, not historical."
      />
      <Metric
        label="Drawdown p25 / p75"
        value={`${formatPercent(summary.percentile25MaximumDrawdown)} / ${formatPercent(summary.percentile75MaximumDrawdown)}`}
      />
      <Metric
        label="Worst simulated drawdown"
        value={formatPercent(summary.worstMaximumDrawdown)}
      />
    </section>
  )
}

function Metric({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note?: string
}) {
  return (
    <article className="metric-card" title={note}>
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      {note ? <p className="metric-note">{note}</p> : null}
    </article>
  )
}
