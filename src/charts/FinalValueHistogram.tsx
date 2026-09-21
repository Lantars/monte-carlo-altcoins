import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../utils/format'
import { buildHistogram } from './histogram'
import type { SimulationResult } from '../types/simulation'

type FinalValueHistogramProps = {
  result: SimulationResult
}

export function FinalValueHistogram({ result }: FinalValueHistogramProps) {
  const bins = buildHistogram(result.finalValues).map((bin) => ({
    ...bin,
    midpoint: (bin.start + bin.end) / 2,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={bins} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="midpoint"
          tickFormatter={(value: number) => formatCurrency(value)}
          tick={{ fill: '#8b98a5', fontSize: 11 }}
          axisLine={{ stroke: '#2a313a' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#8b98a5', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          contentStyle={{
            background: '#14181d',
            border: '1px solid #2a313a',
            borderRadius: 6,
            color: '#e8edf2',
          }}
          formatter={(count) => [Number(count ?? 0), 'Paths']}
          labelFormatter={(value) => `Bin center ${formatCurrency(Number(value))}`}
        />
        <Bar dataKey="count" fill="#6f8fad" isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}
