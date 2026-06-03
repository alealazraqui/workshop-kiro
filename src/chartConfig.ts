import type { ChartConfig } from './types';

export const chartConfig: ChartConfig = {
  colors: ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa'],
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: { title: 16, axisLabel: 12, tooltip: 13 },
  animation: { duration: 400 },
  tooltip: { cursor: true },
  legend: { placement: 'bottom' },
  strokeWidth: 2,
  barSize: 40,
  innerRadius: 60,
};
