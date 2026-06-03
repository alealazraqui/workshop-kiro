import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { ProductDataPoint, ChartConfig } from '../../types';

interface TopProductsBarChartProps {
  data: ProductDataPoint[];
  config: ChartConfig;
}

export default function TopProductsBarChart({ data, config }: TopProductsBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        No hay datos disponibles
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2
        className="text-lg font-bold text-gray-800 mb-6"
        style={{ fontFamily: config.fontFamily }}
      >
        Top Productos
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={sortedData}
          margin={{ top: 4, right: 16, left: 8, bottom: 56 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{
              fontSize: config.fontSize.axisLabel,
              fontFamily: config.fontFamily,
              fill: '#6b7280',
            }}
            angle={-35}
            textAnchor="end"
            interval={0}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{
              fontSize: config.fontSize.axisLabel,
              fontFamily: config.fontFamily,
              fill: '#6b7280',
            }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={config.tooltip.cursor ? { fill: '#f3f4f6' } : false}
            contentStyle={{
              fontFamily: config.fontFamily,
              fontSize: config.fontSize.tooltip,
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          />
          <Bar
            dataKey="value"
            fill={config.colors[1]}
            barSize={32}
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationDuration={config.animation.duration}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
