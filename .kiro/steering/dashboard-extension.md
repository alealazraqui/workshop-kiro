---
inclusion: auto
---

# Guía de Extensión del Dashboard

Esta steering file explica cómo extender el Ecommerce Dashboard de dos maneras:

1. **Agregar un nuevo gráfico a una sección existente**
2. **Crear un nuevo ítem de menú con sus propios gráficos**

Seguí los pasos en orden. Cada paso referencia el archivo exacto a modificar.

---

## Estructura actual del proyecto

```
src/
├── types/index.ts                        ← interfaces de datos y tipo Section
├── chartConfig.ts                        ← paleta, tipografía y comportamiento
├── data/
│   ├── salesData.ts                      ← datos del Line Chart
│   ├── topProductsData.ts                ← datos del Bar Chart
│   └── categoryData.ts                   ← datos del Donut Chart
└── components/
    ├── layout/
    │   ├── Sidebar.tsx                   ← ítems del menú lateral
    │   └── MainContent.tsx               ← qué se renderiza por sección
    └── charts/
        ├── SalesLineChart.tsx
        ├── TopProductsBarChart.tsx
        └── CategoryPieChart.tsx
```

El tipo `Section` en `src/types/index.ts` controla qué secciones existen.
`Sidebar.tsx` define los ítems del menú.
`MainContent.tsx` decide qué gráficos se muestran por sección.

---

## Caso 1 — Agregar un gráfico a una sección existente

Usá este caso cuando querés sumar un gráfico más a una página que ya existe
(por ejemplo, agregar un Area Chart a la sección "Resumen de Ventas").

### Paso 1 — Definir la interface de datos en `src/types/index.ts`

```ts
// Agregá al final del archivo, antes del cierre

/** Punto de datos para el nuevo gráfico */
export interface NuevoDataPoint {
  label: string;   // eje X o dimensión
  value: number;   // métrica numérica
}
```

### Paso 2 — Crear el módulo de datos en `src/data/`

```ts
// src/data/nuevoData.ts
import type { NuevoDataPoint } from '../types';

export const nuevoData: NuevoDataPoint[] = [
  { label: 'Ene', value: 320 },
  { label: 'Feb', value: 480 },
  { label: 'Mar', value: 290 },
  { label: 'Abr', value: 610 },
  // mínimo 4 puntos
];
```

### Paso 3 — Crear el componente en `src/components/charts/`

Seguí exactamente esta estructura. Siempre:
- Verificar empty state antes de renderizar Recharts
- Usar `config.colors[n]` — nunca colores hardcodeados
- Usar `config.fontFamily` y `config.fontSize.*`
- Usar `config.animation.duration` en elementos animados

```tsx
// src/components/charts/NuevoChart.tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { NuevoDataPoint, ChartConfig } from '../../types';

interface NuevoChartProps {
  data: NuevoDataPoint[];
  config: ChartConfig;
}

export default function NuevoChart({ data, config }: NuevoChartProps) {
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
        Título del Gráfico
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: config.fontSize.axisLabel, fontFamily: config.fontFamily, fill: '#6b7280' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: config.fontSize.axisLabel, fontFamily: config.fontFamily, fill: '#6b7280' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={config.tooltip.cursor}
            contentStyle={{
              fontFamily: config.fontFamily,
              fontSize: config.fontSize.tooltip,
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={config.colors[3]}
            fill={config.colors[3]}
            fillOpacity={0.15}
            strokeWidth={config.strokeWidth}
            isAnimationActive
            animationDuration={config.animation.duration}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### Paso 4 — Importar y renderizar en `src/components/layout/MainContent.tsx`

```tsx
// 1. Agregar imports al inicio del archivo
import { nuevoData } from '../../data/nuevoData';
import NuevoChart from '../charts/NuevoChart';

// 2. Dentro del JSX, agregar el gráfico en la sección correspondiente.
// Ejemplo: sumarlo debajo del grid existente en la sección 'overview'

<div className="w-full">
  <NuevoChart data={nuevoData} config={chartConfig} />
</div>
```

Para ponerlo en el grid de dos columnas junto a otro gráfico existente:

```tsx
<div className="grid grid-cols-2 gap-6 w-full">
  <TopProductsBarChart data={topProductsData} config={chartConfig} />
  <NuevoChart data={nuevoData} config={chartConfig} />   {/* reemplaza o agrega */}
</div>
```

---

## Caso 2 — Crear un nuevo ítem de menú con sus propios gráficos

Usá este caso cuando querés una sección completamente nueva en el sidebar
con su propia página de gráficos (por ejemplo, "Clientes" o "Logística").

### Paso 1 — Agregar el nuevo id al tipo `Section` en `src/types/index.ts`

```ts
// Antes:
export type Section = 'overview';

// Después (agregar el nuevo id):
export type Section = 'overview' | 'clientes';
```

### Paso 2 — Definir la interface de datos e implementar los pasos 2 y 3 del Caso 1

Creá los tipos, datos y componentes para cada gráfico de la nueva sección,
siguiendo exactamente la misma estructura del Caso 1.

### Paso 3 — Registrar el ítem en `src/components/layout/Sidebar.tsx`

```tsx
// Antes:
const SECTIONS: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Resumen de Ventas' },
];

// Después:
const SECTIONS: { id: Section; label: string }[] = [
  { id: 'overview',  label: 'Resumen de Ventas' },
  { id: 'clientes',  label: 'Clientes'           },  // ← nuevo ítem
];
```

El ícono SVG, el estado activo y el hover se aplican automáticamente
por el componente existente — no hay que tocar más nada en Sidebar.

### Paso 4 — Renderizar la nueva sección en `src/components/layout/MainContent.tsx`

```tsx
// 1. Importar datos y componentes de la nueva sección
import { clientesData } from '../../data/clientesData';
import ClientesChart from '../charts/ClientesChart';

// 2. Cambiar el prop active: _active por active (quitar el _ para usarlo)
export default function MainContent({ active }: MainContentProps) {

// 3. Dentro del JSX, agregar la condición para la nueva sección
// La sección 'overview' ya existente no se toca:

return (
  <main className="flex-1 min-w-0 overflow-auto bg-gray-50 p-6 flex flex-col gap-6">
    {active === 'overview' && (
      <>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumen de Ventas</h1>
          <p className="text-sm text-gray-500 mt-1">Métricas del año en curso</p>
        </div>
        <div className="w-full">
          <SalesLineChart data={salesData} config={chartConfig} />
        </div>
        <div className="grid grid-cols-2 gap-6 w-full">
          <TopProductsBarChart data={topProductsData} config={chartConfig} />
          <CategoryPieChart data={categoryData} config={chartConfig} />
        </div>
      </>
    )}

    {active === 'clientes' && (
      <>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-1">Análisis de la base de clientes</p>
        </div>
        <div className="w-full">
          <ClientesChart data={clientesData} config={chartConfig} />
        </div>
      </>
    )}
  </main>
);
```

---

## Checklist rápido

### Agregar un gráfico a sección existente
- [ ] Interface del dato en `src/types/index.ts`
- [ ] Módulo de datos en `src/data/`
- [ ] Componente en `src/components/charts/` con empty state
- [ ] Import y render en `MainContent.tsx`

### Crear nuevo ítem de menú
- [ ] Todo lo anterior, más:
- [ ] Nuevo id en el tipo `Section` en `src/types/index.ts`
- [ ] Nueva entrada en el array `SECTIONS` de `Sidebar.tsx`
- [ ] Condición `{active === 'nuevo-id' && (...)}` en `MainContent.tsx`

---

## Reglas de estilo obligatorias

Siempre usar `chartConfig` — nunca valores hardcodeados:

| Qué           | Cómo                                        |
|---------------|---------------------------------------------|
| Colores       | `config.colors[0..5]`                       |
| Fuente        | `config.fontFamily`                         |
| Tamaño texto  | `config.fontSize.title/axisLabel/tooltip`   |
| Animación     | `config.animation.duration`                 |
| Tooltip       | `config.tooltip.cursor`                     |
| Leyenda       | `config.legend.placement`                   |
| Grosor línea  | `config.strokeWidth`                        |
| Tamaño barra  | `config.barSize`                            |
| Radio donut   | `config.innerRadius`                        |
