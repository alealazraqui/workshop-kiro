# Design Document — new-customers-area-chart

## Overview

This feature adds a `NewCustomersAreaChart` component that renders monthly new-customer acquisition data as a filled area chart. It integrates into the existing `overview` section of `MainContent.tsx` as a third, full-width row below the two-column Bar + Pie grid. All visual tokens are consumed exclusively from `chartConfig`, following the same patterns already established by `SalesLineChart`, `TopProductsBarChart`, and `CategoryPieChart`.

---

## Architecture

The feature touches four files and creates two new ones, keeping the existing architecture intact:

```
src/
├── types/
│   └── index.ts                          ← ADD NewCustomerDataPoint interface
├── data/
│   └── newCustomersData.ts               ← NEW: static mock data module
├── components/
│   └── charts/
│       └── NewCustomersAreaChart.tsx     ← NEW: area chart component
└── components/
    └── layout/
        └── MainContent.tsx               ← MODIFY: import + render third row
```

No changes to `Sidebar.tsx`, `chartConfig.ts`, or the `Section` type.

---

## Data Models

### `NewCustomerDataPoint` (added to `src/types/index.ts`)

```ts
/** Punto de datos para el Area Chart de nuevos clientes */
export interface NewCustomerDataPoint {
  month: string;     // e.g. "Ene", "Feb" — abbreviated Spanish month label
  customers: number; // integer count of new customers acquired that month
}
```

This interface is added below the existing `CategoryDataPoint` interface without touching any other declaration. It follows the same two-field pattern used by all existing chart data interfaces.

---

## Mock Data Module

### `src/data/newCustomersData.ts`

```ts
import type { NewCustomerDataPoint } from '../types';

export const newCustomersData: NewCustomerDataPoint[] = [
  { month: 'Ene', customers: 120 },
  { month: 'Feb', customers: 145 },
  { month: 'Mar', customers: 160 },
  { month: 'Abr', customers: 190 },
  { month: 'May', customers: 230 },
  { month: 'Jun', customers: 275 },
  { month: 'Jul', customers: 310 },
  { month: 'Ago', customers: 360 },
  { month: 'Sep', customers: 405 },
  { month: 'Oct', customers: 450 },
  { month: 'Nov', customers: 510 },
  { month: 'Dic', customers: 580 },
];
```

- Exactly 12 entries, one per month, using the same Spanish abbreviated labels already used in `salesData.ts`.
- Values range from 120 to 580 — all integers within [80, 600] — and show a plausible monotone growth trend.
- Module structure mirrors `salesData.ts`: single named export typed with the domain interface.

---

## Components and Interfaces

### `NewCustomersAreaChartProps`

```ts
interface NewCustomersAreaChartProps {
  data: NewCustomerDataPoint[];
  config: ChartConfig;
}
```

Both props are required and match the signature of every other chart component in the project. `data` carries the monthly acquisition figures; `config` supplies all visual tokens (colors, fonts, animation, tooltip behavior) from the centralized `chartConfig` object.

---

## Component: `NewCustomersAreaChart`

### File: `src/components/charts/NewCustomersAreaChart.tsx`

#### Rendering logic

Two rendering paths:

1. **Empty state** — when `!data || data.length === 0`: render a centered `<div>` with the text `"No hay datos disponibles"` and do not mount any Recharts element. This is identical to the guard used by `SalesLineChart` and the other charts.

2. **Chart state** — when data is present: render the container card, the title `<h2>`, and the `ResponsiveContainer` > `AreaChart` tree.

#### Full component structure

```tsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { NewCustomerDataPoint, ChartConfig } from '../../types';

interface NewCustomersAreaChartProps {
  data: NewCustomerDataPoint[];
  config: ChartConfig;
}

export default function NewCustomersAreaChart({ data, config }: NewCustomersAreaChartProps) {
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
        style={{
          fontFamily: config.fontFamily,
          fontSize: config.fontSize.title,
        }}
      >
        Nuevos Clientes por Mes
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 24, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
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
              value != null ? new Intl.NumberFormat('es-ES').format(Number(value)) : '—',
              'Nuevos Clientes',
            ]}
          />
          <Area
            type="monotone"
            dataKey="customers"
            stroke={config.colors[3]}
            fill={config.colors[3]}
            fillOpacity={0.15}
            strokeWidth={config.strokeWidth}
            dot={{ fill: config.colors[3], strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: config.colors[3] }}
            isAnimationActive
            animationDuration={config.animation.duration}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

#### chartConfig token usage

| Token | Where used |
|---|---|
| `config.colors[3]` (`#10b981` emerald) | `Area` stroke, fill, dot fill, activeDot fill |
| `config.fontFamily` | `h2` title, XAxis tick, YAxis tick, Tooltip contentStyle |
| `config.fontSize.title` | `h2` inline style |
| `config.fontSize.axisLabel` | XAxis tick, YAxis tick |
| `config.fontSize.tooltip` | Tooltip contentStyle |
| `config.strokeWidth` | `Area` strokeWidth |
| `config.animation.duration` | `Area` animationDuration |
| `config.tooltip.cursor` | `Tooltip` cursor prop |

No hex color literals appear in the file. All color references go through `config.colors[index]`.

---

## Integration into `MainContent.tsx`

Two changes are required:

### 1. New imports (added alongside existing chart imports)

```tsx
import { newCustomersData } from '../../data/newCustomersData';
import NewCustomersAreaChart from '../charts/NewCustomersAreaChart';
```

### 2. Third full-width row in JSX

Added **after** the `grid grid-cols-2` div that holds `TopProductsBarChart` and `CategoryPieChart`:

```tsx
{/* Area Chart — ancho completo, tercera fila */}
<div className="w-full">
  <NewCustomersAreaChart data={newCustomersData} config={chartConfig} />
</div>
```

The resulting layout order in `MainContent.tsx`:

1. Header (`<div>` with `h1` + `p`)
2. `SalesLineChart` — full width (`w-full`)
3. `grid grid-cols-2` — `TopProductsBarChart` + `CategoryPieChart`
4. `NewCustomersAreaChart` — full width (`w-full`) ← **new**

The `<div className="w-full">` wrapper mirrors the pattern already used for `SalesLineChart` in row 2, ensuring consistent layout behavior.

---

## Error Handling

- **Empty / missing data**: the component's first-render guard (`if (!data || data.length === 0)`) handles both `undefined` and `[]` gracefully, rendering a placeholder without crashing or mounting Recharts.
- **Type safety**: `NewCustomerDataPoint` is defined in the shared types module, so TypeScript enforces the correct shape at both the data module and the component call site.
- **Config completeness**: `ChartConfig` is already enforced by TypeScript; any missing token would be a compile error.

---

## Testing Strategy

This feature uses a **dual testing approach**: example-based unit tests for specific rendering conditions and error handling, and property-based tests for universal invariants over varying config and data inputs.

### Unit / Example Tests

| Criterion | Test | Type |
|---|---|---|
| Empty state renders fallback text | Render with `data={[]}` and `data={undefined}`, assert `"No hay datos disponibles"` present | Example |
| Empty state renders no Recharts element | Same render, assert `AreaChart` absent | Example |
| Mock data has exactly 12 entries | Assert `newCustomersData.length === 12` | Example |
| Mock data uses correct month labels | Assert each element's `month` matches the expected Spanish abbreviation in order | Example |
| `fillOpacity` is 0.15 | Render with valid data, assert `Area` `fillOpacity === 0.15` | Example |
| Dashboard integration | Render `MainContent` with `active="overview"`, assert `NewCustomersAreaChart` present | Integration |

### Property-Based Tests

| Property | What varies | Framework |
|---|---|---|
| **P1** — Mock data values in [80, 600] | All elements of `newCustomersData` | Vitest + fast-check (universal over array) |
| **P2** — Non-empty data renders AreaChart | Any generated `NewCustomerDataPoint[]` with length ≥ 1 | Vitest + fast-check |
| **P3** — Area tokens from config | Any generated `ChartConfig` | Vitest + fast-check |
| **P4** — Typography tokens from config | Any generated `ChartConfig` | Vitest + fast-check |

Properties P3 and P4 use a fast-check `Arbitrary<ChartConfig>` that generates random color palettes, font families, font sizes, stroke widths, and animation durations. This ensures no token is hardcoded in the component.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Mock data values are in the valid range

*For any* element in `newCustomersData`, its `customers` value must be a finite integer and must satisfy `80 ≤ customers ≤ 600`.

**Validates: Requirements 2.3**

---

### Property 2: Non-empty data always produces an AreaChart

*For any* non-empty array of `NewCustomerDataPoint` values, rendering `NewCustomersAreaChart` with that array must produce a Recharts `AreaChart` element wrapped in a `ResponsiveContainer`, and must NOT render the fallback `"No hay datos disponibles"` text.

**Validates: Requirements 3.3**

---

### Property 3: Area element reflects config color and stroke tokens

*For any* `ChartConfig` object, the `<Area>` element rendered by `NewCustomersAreaChart` must use `config.colors[3]` as both its stroke color and fill color, and must set `strokeWidth` equal to `config.strokeWidth` and `animationDuration` equal to `config.animation.duration`.

**Validates: Requirements 3.4, 3.6, 3.7**

---

### Property 4: All axis and tooltip typography tokens come from config

*For any* `ChartConfig` object, every rendered text element (XAxis ticks, YAxis ticks, Tooltip contentStyle, and the title `<h2>`) must apply `config.fontFamily`. The XAxis and YAxis ticks must use `config.fontSize.axisLabel`, the Tooltip must use `config.fontSize.tooltip`, and the title must use `config.fontSize.title`. No hard-coded font family or size may appear.

**Validates: Requirements 3.8, 3.9, 3.10, 3.11**
