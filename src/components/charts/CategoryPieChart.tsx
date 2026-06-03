import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import type { CategoryDataPoint, ChartConfig } from '../../types';

interface CategoryPieChartProps {
  data: CategoryDataPoint[];
  config: ChartConfig;
}

interface TooltipPayloadEntry {
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const entry = payload[0];
  const total = entry.value; // valores ya son porcentajes en nuestros datos

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <p className="font-semibold text-gray-700">{entry.name}</p>
      <p className="text-gray-500">{total}% del total</p>
    </div>
  );
}

export default function CategoryPieChart({ data, config }: CategoryPieChartProps) {
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
        className="font-bold text-gray-800 mb-4"
        style={{ fontSize: config.fontSize.title }}
      >
        Distribución por Categoría
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={config.innerRadius}
            outerRadius={120}
            animationDuration={config.animation.duration}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={config.colors[index % config.colors.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign={config.legend.placement === 'bottom' ? 'bottom' : config.legend.placement === 'top' ? 'top' : 'middle'}
            align={config.legend.placement === 'right' ? 'right' : 'center'}
            wrapperStyle={{ fontFamily: config.fontFamily, fontSize: config.fontSize.axisLabel }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
