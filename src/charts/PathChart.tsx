import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../utils/format'
import type { SimulationResult } from '../types/simulation'

type PathChartProps = {
  result: SimulationResult
}

const PATH_COLOR = 'rgba(143, 176, 204, 0.35)'

export function PathChart({ result }: PathChartProps) {
  const stepCount = result.stepCount
  const horizonMonths = result.parameters.horizonMonths
  const stride = Math.max(1, Math.floor(stepCount / 80))
  const rows: Array<Record<string, number>> = []

  for (let step = 0; step <= stepCount; step += stride) {
    const row: Record<string, number> = {
      month: (step / stepCount) * horizonMonths,
    }
    result.representativePaths.forEach((path, pathIndex) => {
      row[`p${pathIndex}`] = path.prices[step]
    })
    rows.push(row)
  }
  if ((stepCount / stride) * stride !== stepCount) {
    const row: Record<string, number> = { month: horizonMonths }
    result.representativePaths.forEach((path, pathIndex) => {
      row[`p${pathIndex}`] = path.prices[stepCount]
    })
    rows.push(row)
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="month"
          tickFormatter={(value: number) => `${value.toFixed(0)}m`}
          tick={{ fill: '#8b98a5', fontSize: 11 }}
          axisLine={{ stroke: '#2a313a' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(value: number) => formatCurrency(value)}
          tick={{ fill: '#8b98a5', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip
          contentStyle={{
            background: '#14181d',
            border: '1px solid #2a313a',
            borderRadius: 6,
            color: '#e8edf2',
          }}
          formatter={(value) => formatCurrency(Number(value ?? 0))}
          labelFormatter={(month) => `Month ${Number(month).toFixed(1)}`}
        />
        {result.representativePaths.map((_, pathIndex) => (
          <Line
            key={pathIndex}
            type="monotone"
            dataKey={`p${pathIndex}`}
            stroke={PATH_COLOR}
            dot={false}
            isAnimationActive={false}
            legendType="none"
            strokeWidth={1}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
