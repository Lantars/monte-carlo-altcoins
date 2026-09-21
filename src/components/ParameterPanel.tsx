import type { ReactNode } from 'react'
import type { SimulationParameters, ValidationIssue } from '../types/simulation'

export const DEFAULT_PARAMETERS: SimulationParameters = {
  initialCapital: 10_000,
  initialPrice: 100,
  expectedReturn: 0.3,
  annualVolatility: 0.8,
  horizonMonths: 12,
  simulationCount: 10_000,
  stepsPerYear: 252,
  seed: 42,
}

type ParameterPanelProps = {
  parameters: SimulationParameters
  issues: ValidationIssue[]
  running: boolean
  onChange: (parameters: SimulationParameters) => void
  onRun: () => void
}

function fieldError(
  issues: ValidationIssue[],
  field: ValidationIssue['field'],
): string | undefined {
  return issues.find((issue) => issue.field === field)?.message
}

export function ParameterPanel({
  parameters,
  issues,
  running,
  onChange,
  onRun,
}: ParameterPanelProps) {
  const update = (patch: Partial<SimulationParameters>) => {
    onChange({ ...parameters, ...patch })
  }

  return (
    <section className="panel">
      <header className="panel-header">
        <h2>Simulation parameters</h2>
        <p>Assumptions are explicit. Nothing is estimated from market data.</p>
      </header>

      <Field
        label="Initial capital"
        suffix="USD"
        error={fieldError(issues, 'initialCapital')}
      >
        <input
          type="number"
          min={1}
          step={100}
          value={parameters.initialCapital}
          onChange={(event) =>
            update({ initialCapital: Number(event.target.value) })
          }
        />
      </Field>

      <Field
        label="Initial asset price"
        suffix="USD"
        error={fieldError(issues, 'initialPrice')}
      >
        <input
          type="number"
          min={0.0001}
          step={1}
          value={parameters.initialPrice}
          onChange={(event) =>
            update({ initialPrice: Number(event.target.value) })
          }
        />
      </Field>

      <Field
        label="Expected annual return (μ)"
        suffix={`${Math.round(parameters.expectedReturn * 100)}%`}
        hint="Continuously compounded."
        error={fieldError(issues, 'expectedReturn')}
      >
        <input
          type="range"
          min={-50}
          max={150}
          step={1}
          value={Math.round(parameters.expectedReturn * 100)}
          onChange={(event) =>
            update({ expectedReturn: Number(event.target.value) / 100 })
          }
        />
      </Field>

      <Field
        label="Annual volatility (σ)"
        suffix={`${Math.round(parameters.annualVolatility * 100)}%`}
        error={fieldError(issues, 'annualVolatility')}
      >
        <input
          type="range"
          min={0}
          max={200}
          step={1}
          value={Math.round(parameters.annualVolatility * 100)}
          onChange={(event) =>
            update({ annualVolatility: Number(event.target.value) / 100 })
          }
        />
      </Field>

      <Field
        label="Horizon"
        suffix={`${parameters.horizonMonths} months`}
        error={fieldError(issues, 'horizonMonths')}
      >
        <input
          type="range"
          min={1}
          max={120}
          step={1}
          value={parameters.horizonMonths}
          onChange={(event) =>
            update({ horizonMonths: Number(event.target.value) })
          }
        />
      </Field>

      <Field
        label="Number of simulations"
        suffix={parameters.simulationCount.toLocaleString()}
        error={fieldError(issues, 'simulationCount')}
      >
        <input
          type="range"
          min={100}
          max={100000}
          step={100}
          value={parameters.simulationCount}
          onChange={(event) =>
            update({ simulationCount: Number(event.target.value) })
          }
        />
      </Field>

      <div className="field-row">
        <Field label="Steps / year" error={fieldError(issues, 'stepsPerYear')}>
          <input
            type="number"
            min={12}
            max={365}
            step={1}
            value={parameters.stepsPerYear}
            onChange={(event) =>
              update({ stepsPerYear: Number(event.target.value) })
            }
          />
        </Field>
        <Field label="Random seed" error={fieldError(issues, 'seed')}>
          <input
            type="number"
            min={0}
            step={1}
            value={parameters.seed}
            onChange={(event) => update({ seed: Number(event.target.value) })}
          />
        </Field>
      </div>

      <button
        type="button"
        className="run-button"
        onClick={onRun}
        disabled={running || issues.length > 0}
      >
        {running ? 'Running simulation…' : 'Run simulation'}
      </button>
    </section>
  )
}

type FieldProps = {
  label: string
  suffix?: string
  hint?: string
  error?: string
  children: ReactNode
}

function Field({ label, suffix, hint, error, children }: FieldProps) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {suffix ? <span className="field-suffix">{suffix}</span> : null}
      </span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  )
}
