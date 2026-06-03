# Chart Configuration Guide

Esta steering file guía a Kiro para mantener consistencia visual y estructural al agregar o modificar charts en el Ecommerce Dashboard. Se aplica siempre que se genere o edite un componente de gráfico.

---

## 1. Paleta de Colores

Todos los charts deben usar exclusivamente los colores definidos en `src/chartConfig.ts`. No se permite hardcodear colores fuera de esta paleta.

| Nombre   | Hex       | Uso sugerido                        |
|----------|-----------|-------------------------------------|
| indigo   | `#6366f1` | Color principal / primer elemento   |
| cyan     | `#22d3ee` | Segundo elemento / acento           |
| amber    | `#f59e0b` | Tercer elemento / advertencia suave |
| emerald  | `#10b981` | Cuarto elemento / positivo          |
| rose     | `#f43f5e` | Quinto elemento / alerta            |
| violet   | `#a78bfa` | Sexto elemento / complementario     |

En código, los colores se acceden a través del array `config.colors`:

```ts
// src/chartConfig.ts
export const chartConfig: ChartConfig = {
  colors: ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa'],
  // ...
};
```

Para asignar colores a elementos visuales de Recharts usa el índice del array:

```tsx
// Ejemplo: asignar colores a celdas de un Pie Chart
{data.map((entry, index) => (
  <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length]} />
))}

// Ejemplo: color de una línea o barra
<Line stroke={config.colors[0]} ... />
<Bar fill={config.colors[0]} ... />
```

---

## 2. Tipografía

Todos los elementos de texto dentro de los charts siguen estas reglas:

**Familia tipográfica:**

```
Inter, system-ui, sans-serif
```

**Tamaños por contexto:**

| Contexto        | Tamaño | Propiedad en ChartConfig         |
|-----------------|--------|----------------------------------|
| Título del chart | 16px  | `config.fontSize.title`         |
| Etiquetas de eje | 12px  | `config.fontSize.axisLabel`     |
| Texto de tooltip | 13px  | `config.fontSize.tooltip`       |

Aplicación en componentes Recharts:

```tsx
// Etiquetas de eje
<XAxis
  tick={{ fontFamily: config.fontFamily, fontSize: config.fontSize.axisLabel }}
/>
<YAxis
  tick={{ fontFamily: config.fontFamily, fontSize: config.fontSize.axisLabel }}
/>

// Título del chart (elemento HTML sobre el gráfico)
<h2 style={{ fontFamily: config.fontFamily, fontSize: config.fontSize.title }}>
  Título del Chart
</h2>
```

---

## 3. Comportamiento

### Tooltip

El tooltip se activa al hacer hover y muestra siempre el cursor de línea vertical:

```tsx
<Tooltip cursor={config.tooltip.cursor} />
// config.tooltip.cursor === true
```

### Animaciones

La duración de todas las animaciones de entrada es de **400ms**:

```tsx
// En Line, Bar y Pie, Recharts aplica animación por defecto.
// El valor se referencia desde:
// config.animation.duration === 400
```

Si necesitas pasar la duración explícitamente a algún primitivo:

```tsx
<Line isAnimationActive animationDuration={config.animation.duration} ... />
<Bar isAnimationActive animationDuration={config.animation.duration} ... />
```

### Leyenda

La leyenda siempre se posiciona en la parte inferior del chart:

```tsx
<Legend verticalAlign={config.legend.placement} />
// config.legend.placement === 'bottom'
```

---

## 4. Cómo Agregar un Nuevo Chart

Sigue estos pasos en orden para agregar un cuarto gráfico al dashboard sin romper la estructura existente.

### Paso 1 — Definir el tipo de dato en `src/types/index.ts`

Agrega una nueva interface para los datos del chart. Sigue el patrón de las interfaces existentes:

```ts
// src/types/index.ts

/** Punto de datos para el nuevo chart */
export interface MyNewDataPoint {
  label: string;   // dimensión o categoría
  value: number;   // métrica numérica
}
```

También agrega el nuevo id de sección al tipo `Section`:

```ts
export type Section = 'sales' | 'products' | 'categories' | 'mi-seccion';
```

### Paso 2 — Crear el módulo de datos en `src/data/`

Crea el archivo con los datos mockeados usando la interface del paso anterior:

```ts
// src/data/myNewData.ts
import type { MyNewDataPoint } from '../types';

export const myNewData: MyNewDataPoint[] = [
  { label: 'Elemento A', value: 1200 },
  { label: 'Elemento B', value: 850  },
  { label: 'Elemento C', value: 640  },
  // mínimo 4 elementos, máximo acorde al tipo de chart
];
```

### Paso 3 — Crear el componente en `src/components/charts/`

Crea el archivo del componente siguiendo la misma estructura que los existentes. Ejemplo con un AreaChart:

```tsx
// src/components/charts/MyNewChart.tsx
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import type { MyNewDataPoint, ChartConfig } from '../../types';

interface MyNewChartProps {
  data: MyNewDataPoint[];
  config: ChartConfig;
}

export default function MyNewChart({ data, config }: MyNewChartProps) {
  // Empty state: siempre verificar datos antes de renderizar Recharts
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h2
        className="font-semibold text-gray-800 mb-4"
        style={{ fontFamily: config.fontFamily, fontSize: config.fontSize.title }}
      >
        Mi Nuevo Chart
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            tick={{ fontFamily: config.fontFamily, fontSize: config.fontSize.axisLabel }}
          />
          <YAxis
            tick={{ fontFamily: config.fontFamily, fontSize: config.fontSize.axisLabel }}
          />
          <Tooltip cursor={config.tooltip.cursor} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={config.colors[0]}
            fill={config.colors[0]}
            fillOpacity={0.15}
            strokeWidth={config.strokeWidth}
            isAnimationActive
            animationDuration={config.animation.duration}
          />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
}
```

Reglas del componente:
- Recibe siempre `data` y `config` como props.
- Verifica el empty state antes de renderizar Recharts.
- Usa `config.colors[n]` para todos los colores — nunca valores hex hardcodeados.
- Usa `config.fontFamily` y `config.fontSize.*` para toda tipografía.
- Usa `config.tooltip.cursor` en `<Tooltip>`.
- Usa `config.animation.duration` en elementos animados.
- Usa `config.legend.placement` si el chart incluye `<Legend>`.

### Paso 4 — Importar el componente en `MainContent.tsx`

Agrega el import y la condición de renderizado:

```tsx
// src/components/layout/MainContent.tsx

// 1. Importar datos y componente
import { myNewData } from '../../data/myNewData';
import MyNewChart from '../charts/MyNewChart';

// 2. Dentro del JSX, agregar la condición:
{active === 'mi-seccion' && (
  <MyNewChart data={myNewData} config={chartConfig} />
)}
```

### Paso 5 — Registrar la sección en `Sidebar.tsx`

Agrega la nueva entrada al array `SECTIONS` con el mismo `id` usado en `Section` y en `MainContent.tsx`:

```tsx
// src/components/layout/Sidebar.tsx

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'sales',       label: 'Ventas por período' },
  { id: 'products',    label: 'Top productos'      },
  { id: 'categories',  label: 'Categorías'         },
  { id: 'mi-seccion',  label: 'Mi Nueva Sección'   }, // ← agregar aquí
];
```

El enlace de navegación y el estado activo se manejan automáticamente por el componente existente.

---

## Resumen del Checklist

Al agregar un nuevo chart, verifica que:

- [ ] La interface del dato está en `src/types/index.ts`
- [ ] El id de la sección está añadido al tipo `Section`
- [ ] El módulo de datos está en `src/data/` con el tipo correcto
- [ ] El componente está en `src/components/charts/` y recibe `data` y `config`
- [ ] El componente verifica el empty state antes de renderizar
- [ ] El componente usa solo `config.colors` para colores
- [ ] El componente usa `config.fontFamily` y `config.fontSize.*`
- [ ] `MainContent.tsx` importa datos y componente, y condiciona por `active`
- [ ] `Sidebar.tsx` incluye la nueva entrada en `SECTIONS`
