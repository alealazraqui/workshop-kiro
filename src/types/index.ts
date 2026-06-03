/** Punto de datos para el Line Chart */
export interface SalesDataPoint {
  period: string;   // e.g. "Ene 2024", "Sem 01"
  sales: number;    // valor numérico de ventas
}

/** Punto de datos para el Bar Chart */
export interface ProductDataPoint {
  name: string;     // nombre del producto
  value: number;    // unidades vendidas o ingresos
}

/** Punto de datos para el Pie/Donut Chart */
export interface CategoryDataPoint {
  name: string;     // nombre de la categoría
  value: number;    // valor absoluto o porcentaje
}

/** Tipos de sección del Sidebar */
export type Section = 'overview';

/** Configuración visual centralizada */
export interface ChartConfig {
  colors: string[];           // paleta de colores hex (mín. 6)
  fontFamily: string;
  fontSize: {
    title: number;
    axisLabel: number;
    tooltip: number;
  };
  animation: {
    duration: number;         // ms
  };
  tooltip: {
    cursor: boolean;
  };
  legend: {
    placement: 'bottom' | 'right' | 'top';
  };
  strokeWidth: number;
  barSize: number;
  innerRadius: number;        // > 0 para donut
}
