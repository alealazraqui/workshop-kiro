import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { SalesDataPoint, ChartConfig } from '../../types';

interface SalesLineChartProps {
  data: SalesDataPoint[];
  config: ChartConfig;
}

export default function SalesLineChart({ data, config }: SalesLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2
        className="text-lg font-bold text-gray-800 mb-4"
        style={{ fontFamily: config.fontFamily }}
      >
        Ventas por Período
      </h2>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 24, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="period"
            tick={{
              fontSize: config.fontSize.axisLabel,
              fontFamily: config.fontFamily,
              fill: '#6b7280',
            }}
            axisLine={{ stroke: '#d1d5db' }}
            tickLine={false}
          />
          <YAxis
            tick={{
              fontSize: config.fontSize.axisLabel,
              fontFamily: config.fontFamily,
              fill: '#6b7280',
            }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: number) =>
              value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value)
            }
          />
          <Tooltip
            cursor={config.tooltip.cursor}
            contentStyle={{
              fontFamily: config.fontFamily,
              fontSize: config.fontSize.tooltip,
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            }}
            formatter={(value) => [
              value != null
                ? new Intl.NumberFormat('es-ES').format(Number(value))
                : '—',
              'Ventas',
            ]}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke={config.colors[0]}
            strokeWidth={config.strokeWidth}
            dot={{ fill: config.colors[0], strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: config.colors[0] }}
            isAnimationActive
            animationDuration={config.animation.duration}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
