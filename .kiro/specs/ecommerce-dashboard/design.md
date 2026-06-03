# Documento de Diseño

## Ecommerce Dashboard

---

## Visión general

El Ecommerce Dashboard es una Single-Page Application (SPA) construida con **React + TypeScript + Vite**. Presenta tres gráficos de Recharts (Line, Bar, Pie/Donut) sobre datos mockeados, organizados en un layout con sidebar de navegación. Su propósito primario es didáctico: sirve como proyecto de referencia en un workshop sobre el flujo spec → design → tasks de Kiro.

No hay backend, no hay llamadas a red, no hay estado persistente — toda la información proviene de módulos TypeScript estáticos en `src/data/`.

---

## Arquitectura

### Estructura de alto nivel

```
workshop_kiro/
├── .kiro/
│   ├── specs/ecommerce-dashboard/
│   │   ├── requirements.md
│   │   ├── design.md        ← este archivo
│   │   └── tasks.md
│   └── steering/
│       └── chart-config.md  ← guía visual para Kiro
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── chartConfig.ts        ← configuración visual centralizada
    ├── data/
    │   ├── salesData.ts      ← datos del Line Chart
    │   ├── topProductsData.ts← datos del Bar Chart
    │   └── categoryData.ts   ← datos del Pie/Donut Chart
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.tsx
    │   │   └── MainContent.tsx
    │   └── charts/
    │       ├── SalesLineChart.tsx
    │       ├── TopProductsBarChart.tsx
    │       └── CategoryPieChart.tsx
    └── types/
        └── index.ts          ← interfaces compartidas
```

### Flujo de datos

```
src/data/*.ts  →  Componentes Chart  →  Primitivos Recharts  →  DOM
     ↑
chartConfig.ts (props visuales compartidos)
```

Los datos son importados directamente por los componentes de chart. No hay context global ni estado de aplicación — todos los valores son constantes importadas.

---

## Componentes

### `App.tsx`

Componente raíz. Renderiza el layout principal: `Sidebar` a la izquierda y `MainContent` a la derecha usando CSS Grid o Flexbox de Tailwind.

```tsx
// Estructura simplificada
export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('sales');
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active={activeSection} onNavigate={setActiveSection} />
      <MainContent active={activeSection} />
    </div>
  );
}
```

**Props:** ninguna (es el root)  
**Estado local:** `activeSection: Section` — la sección activa del sidebar.

---

### `Sidebar.tsx`

Panel de navegación lateral. Recibe la sección activa y un callback de navegación.

```tsx
interface SidebarProps {
  active: Section;
  onNavigate: (section: Section) => void;
}
```

- Renderiza un `<nav>` con un enlace/botón por cada sección definida en `SECTIONS`.
- Aplica clase CSS de "activo" al enlace cuya `id` coincide con `active`.
- En viewports < 1024 px, usa la clase `hidden lg:flex` de Tailwind para ocultarse.

**Secciones definidas:**

```ts
const SECTIONS: { id: Section; label: string }[] = [
  { id: 'sales',      label: 'Ventas por período' },
  { id: 'products',   label: 'Top productos'      },
  { id: 'categories', label: 'Categorías'          },
];
```

---

### `MainContent.tsx`

Área principal. Recibe la sección activa y renderiza el chart correspondiente o todos los charts en modo "overview".

```tsx
interface MainContentProps {
  active: Section;
}
```

Estructura:

```tsx
<main className="flex-1 overflow-auto p-6">
  <SalesLineChart data={salesData} config={chartConfig} />
  <TopProductsBarChart data={topProductsData} config={chartConfig} />
  <CategoryPieChart data={categoryData} config={chartConfig} />
</main>
```

---

### `SalesLineChart.tsx`

Gráfico de líneas de Recharts. Muestra evolución de ventas por período.

```tsx
interface SalesLineChartProps {
  data: SalesDataPoint[];
  config: ChartConfig;
}
```

Primitivos Recharts utilizados: `<LineChart>`, `<Line>`, `<XAxis>`, `<YAxis>`, `<CartesianGrid>`, `<Tooltip>`, `<ResponsiveContainer>`.

---

### `TopProductsBarChart.tsx`

Gráfico de barras. Muestra top productos ordenados de mayor a menor.

```tsx
interface TopProductsBarChartProps {
  data: ProductDataPoint[];
  config: ChartConfig;
}
```

El componente ordena los datos recibidos en orden descendente por `value` antes de renderizarlos, garantizando el orden independientemente de cómo lleguen del módulo de datos.

Primitivos Recharts: `<BarChart>`, `<Bar>`, `<XAxis>`, `<YAxis>`, `<CartesianGrid>`, `<Tooltip>`, `<ResponsiveContainer>`.

---

### `CategoryPieChart.tsx`

Gráfico tipo donut. Muestra distribución de ventas por categoría.

```tsx
interface CategoryPieChartProps {
  data: CategoryDataPoint[];
  config: ChartConfig;
}
```

Primitivos Recharts: `<PieChart>`, `<Pie>`, `<Cell>`, `<Tooltip>`, `<Legend>`, `<ResponsiveContainer>`.

El `innerRadius` se establece > 0 para producir el estilo donut.

---

### Estado vacío (patrón compartido)

Todos los componentes de chart verifican si `data` está vacío o es `undefined` antes de renderizar Recharts. Si la condición se cumple, renderizan un placeholder:

```tsx
if (!data || data.length === 0) {
  return (
    <div className="flex items-center justify-center h-48 text-gray-400">
      No hay datos disponibles
    </div>
  );
}
```

---

## Modelos de datos

### Interfaces (src/types/index.ts)

```ts
/** Punto de datos para el Line Chart */
export interface SalesDataPoint {
  period: string;   // ej. "Ene 2024", "Sem 01"
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
export type Section = 'sales' | 'products' | 'categories';

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
```

---

### Módulos de Mock Data

#### `src/data/salesData.ts`

```ts
import type { SalesDataPoint } from '../types';

export const salesData: SalesDataPoint[] = [
  { period: 'Ene', sales: 4200 },
  { period: 'Feb', sales: 3800 },
  { period: 'Mar', sales: 5100 },
  { period: 'Abr', sales: 4700 },
  { period: 'May', sales: 5600 },
  { period: 'Jun', sales: 6200 },
  { period: 'Jul', sales: 5900 },
  { period: 'Ago', sales: 6800 },
  { period: 'Sep', sales: 7100 },
  { period: 'Oct', sales: 7400 },
  { period: 'Nov', sales: 8200 },
  { period: 'Dic', sales: 9500 },
];
```

#### `src/data/topProductsData.ts`

```ts
import type { ProductDataPoint } from '../types';

export const topProductsData: ProductDataPoint[] = [
  { name: 'Laptop Pro 15"', value: 1240 },
  { name: 'Auriculares BT',  value: 980  },
  { name: 'Monitor 27"',     value: 870  },
  { name: 'Teclado Mec.',    value: 760  },
  { name: 'Webcam 4K',       value: 650  },
  { name: 'Mouse Inalám.',   value: 540  },
  { name: 'Hub USB-C',       value: 420  },
];
```

#### `src/data/categoryData.ts`

```ts
import type { CategoryDataPoint } from '../types';

export const categoryData: CategoryDataPoint[] = [
  { name: 'Electrónica',    value: 38 },
  { name: 'Periféricos',    value: 25 },
  { name: 'Audio',          value: 17 },
  { name: 'Conectividad',   value: 12 },
  { name: 'Accesorios',     value: 8  },
];
```

---

### `src/chartConfig.ts`

```ts
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
```

---

## Steering File

El archivo `.kiro/steering/chart-config.md` documenta las mismas reglas visuales que `chartConfig.ts` en formato narrativo, orientado a guiar al agente Kiro cuando un participante del workshop agrega un cuarto chart. Incluye:

1. Paleta de colores (6 valores hex nombrados).
2. Tipografía (familia, tamaños por contexto).
3. Comportamiento de tooltips y animaciones.
4. Posición de leyendas.
5. Instrucciones paso a paso para agregar un nuevo chart siguiendo las convenciones del proyecto.

---

## Manejo de errores

| Escenario | Comportamiento esperado |
|---|---|
| `data` es `undefined` | El chart renderiza el placeholder "No hay datos disponibles" |
| `data` es array vacío `[]` | Ídem anterior |
| `data` tiene un solo punto | El chart renderiza normalmente (Recharts lo soporta) |
| Incompatibilidad de tipos TypeScript | Error de compilación en tiempo de build — nunca llega a runtime |
| Recharts falla internamente | React ErrorBoundary (opcional para el workshop) captura el error |

---

## Propiedades de corrección

*Una propiedad es una característica o comportamiento que debe cumplirse en todas las ejecuciones válidas de un sistema — es decir, una afirmación formal sobre lo que el sistema debe hacer. Las propiedades sirven como puente entre las especificaciones legibles por humanos y las garantías de corrección verificables por máquina.*

### Propiedad 1: Cada sección tiene su enlace en el Sidebar

*Para cualquier* conjunto de secciones definidas en el sistema, el componente Sidebar DEBERÁ renderizar exactamente un enlace de navegación por cada sección, sin omitir ni duplicar entradas.

**Valida: Requisito 1.2**

---

### Propiedad 2: El enlace activo es el único con clase activa

*Para cualquier* sección válida pasada como prop `active` al Sidebar, ese enlace DEBERÁ tener aplicada la clase CSS de estado activo, y ningún otro enlace DEBERÁ tenerla simultáneamente.

**Valida: Requisito 1.3**

---

### Propiedad 3: Los datos de ventas tienen al menos 12 puntos

*Para cualquier* instancia del módulo `salesData`, el array DEBERÁ contener 12 o más elementos de tipo `SalesDataPoint`, garantizando suficiente densidad de datos para el Line Chart.

**Valida: Requisito 2.2**

---

### Propiedad 4: Los datos de productos están en rango válido

*Para cualquier* instancia del módulo `topProductsData`, el array DEBERÁ contener entre 5 y 10 elementos de tipo `ProductDataPoint`.

**Valida: Requisito 3.2**

---

### Propiedad 5: Los datos de categorías están en rango válido

*Para cualquier* instancia del módulo `categoryData`, el array DEBERÁ contener entre 4 y 8 elementos de tipo `CategoryDataPoint`.

**Valida: Requisito 4.2**

---

### Propiedad 6: El Bar Chart presenta productos en orden descendente

*Para cualquier* array de `ProductDataPoint` pasado al componente `TopProductsBarChart`, los valores (`value`) de los elementos renderizados DEBERÁN estar ordenados de mayor a menor, independientemente del orden de entrada.

**Valida: Requisito 3.4**

---

### Propiedad 7: Charts con data vacía renderizan placeholder

*Para cualquier* componente de chart (Line, Bar, Pie) al que se le pase un array vacío o `undefined` como dato, el componente DEBERÁ renderizar el mensaje de placeholder "No hay datos disponibles" y NO DEBERÁ intentar renderizar el gráfico de Recharts.

**Valida: Requisito 5.4**

---

### Propiedad 8: Los charts aplican colores del ChartConfig

*Para cualquier* instancia de un componente chart al que se le pase un `ChartConfig`, los colores usados en los elementos visuales DEBERÁN ser un subconjunto de la paleta `config.colors`, sin introducir colores hardcodeados fuera de la configuración.

**Valida: Requisitos 2.5, 3.5, 4.5**
