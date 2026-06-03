import type { Section } from '../../types';
import { salesData } from '../../data/salesData';
import { topProductsData } from '../../data/topProductsData';
import { categoryData } from '../../data/categoryData';
import { chartConfig } from '../../chartConfig';
import SalesLineChart from '../charts/SalesLineChart';
import TopProductsBarChart from '../charts/TopProductsBarChart';
import CategoryPieChart from '../charts/CategoryPieChart';

interface MainContentProps {
  active: Section;
}

export default function MainContent({ active: _active }: MainContentProps) {
  return (
    <main className="flex-1 min-w-0 overflow-auto bg-gray-50 p-6 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resumen de Ventas</h1>
        <p className="text-sm text-gray-500 mt-1">Métricas del año en curso</p>
      </div>

      {/* Line Chart — ancho completo */}
      <div className="w-full">
        <SalesLineChart data={salesData} config={chartConfig} />
      </div>

      {/* Bar + Pie — dos columnas iguales */}
      <div className="grid grid-cols-2 gap-6 w-full">
        <TopProductsBarChart data={topProductsData} config={chartConfig} />
        <CategoryPieChart data={categoryData} config={chartConfig} />
      </div>
    </main>
  );
}
