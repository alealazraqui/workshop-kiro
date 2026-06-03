# Implementation Plan: new-customers-area-chart

## Overview

Add a `NewCustomersAreaChart` component to the ecommerce dashboard. The chart renders monthly new-customer acquisition data as a filled area chart, integrated as a third full-width row in the `overview` section of `MainContent.tsx`. All visual tokens come exclusively from `chartConfig`, following the same patterns already established by the existing chart components.

## Tasks

- [ ] 1. Add `NewCustomerDataPoint` interface to `src/types/index.ts`
  - [ ] 1.1 Append the `NewCustomerDataPoint` interface below the existing `CategoryDataPoint` interface
    - Add `month: string` and `customers: number` fields with JSDoc comment
    - Do not modify any existing interface or type declaration (including the `Section` type)
    - _Requirements: 1.1, 1.2_

- [ ] 2. Create mock data module `src/data/newCustomersData.ts`
  - [ ] 2.1 Create the file and export `newCustomersData` typed as `NewCustomerDataPoint[]`
    - Import `NewCustomerDataPoint` from `'../types'`
    - Include exactly 12 entries using Spanish abbreviated month labels: `Ene`, `Feb`, `Mar`, `Abr`, `May`, `Jun`, `Jul`, `Ago`, `Sep`, `Oct`, `Nov`, `Dic`
    - Use integer `customers` values between 80 and 600 that reflect a plausible growth trend (e.g. 120 → 580)
    - Mirror the module structure of `salesData.ts`: single named export, no default export
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 2.2 Write property test for mock data values range (Property 1)
    - **Property 1: Mock data values are in the valid range**
    - Assert that every element of `newCustomersData` has a finite integer `customers` value satisfying `80 ≤ customers ≤ 600`
    - Use `fast-check` to iterate over each element as a universal property
    - **Validates: Requirements 2.3**

- [ ] 3. Create `NewCustomersAreaChart` component at `src/components/charts/NewCustomersAreaChart.tsx`
  - [ ] 3.1 Implement the component skeleton with props interface and empty-state guard
    - Import `AreaChart`, `Area`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer` from `recharts`
    - Import `NewCustomerDataPoint` and `ChartConfig` types from `'../../types'`
    - Define `NewCustomersAreaChartProps` with `data: NewCustomerDataPoint[]` and `config: ChartConfig`
    - When `!data || data.length === 0` render `<div className="flex items-center justify-center h-48 text-gray-400">No hay datos disponibles</div>` and return early without mounting any Recharts element
    - _Requirements: 3.1, 3.2, 3.12_

  - [ ] 3.2 Implement the chart rendering path
    - Render outer `<div className="bg-white rounded-2xl shadow-md p-6">`
    - Render `<h2>` title `"Nuevos Clientes por Mes"` with `style={{ fontFamily: config.fontFamily, fontSize: config.fontSize.title }}`
    - Wrap `AreaChart` in `<ResponsiveContainer width="100%" height={300}>`
    - Configure `<XAxis dataKey="month">` with tick using `config.fontFamily` and `config.fontSize.axisLabel`
    - Configure `<YAxis>` with the same tick font tokens
    - Configure `<Tooltip cursor={config.tooltip.cursor}>` with `contentStyle` using `config.fontFamily` and `config.fontSize.tooltip`
    - Configure `<Area>` with `stroke={config.colors[3]}`, `fill={config.colors[3]}`, `fillOpacity={0.15}`, `strokeWidth={config.strokeWidth}`, `isAnimationActive`, `animationDuration={config.animation.duration}`
    - Do not import or use any hex color literal in the file
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12_

  - [ ]* 3.3 Write property test for non-empty data always rendering AreaChart (Property 2)
    - **Property 2: Non-empty data always produces an AreaChart**
    - Use `fast-check` to generate arbitrary `NewCustomerDataPoint[]` with length ≥ 1
    - Assert the rendered output contains a Recharts `AreaChart` and does NOT contain the fallback text
    - **Validates: Requirements 3.3**

  - [ ]* 3.4 Write property test for Area color and stroke tokens from config (Property 3)
    - **Property 3: Area element reflects config color and stroke tokens**
    - Use `fast-check` to generate arbitrary `ChartConfig` objects with varied `colors`, `strokeWidth`, and `animation.duration`
    - Assert `<Area>` receives `stroke={config.colors[3]}`, `fill={config.colors[3]}`, `strokeWidth={config.strokeWidth}`, and `animationDuration={config.animation.duration}`
    - **Validates: Requirements 3.4, 3.6, 3.7**

  - [ ]* 3.5 Write property test for typography tokens from config (Property 4)
    - **Property 4: All axis and tooltip typography tokens come from config**
    - Use `fast-check` to generate arbitrary `ChartConfig` objects with varied font families and font sizes
    - Assert that XAxis ticks, YAxis ticks, Tooltip `contentStyle`, and the title `<h2>` all apply `config.fontFamily`; assert axis labels use `config.fontSize.axisLabel`, tooltip uses `config.fontSize.tooltip`, title uses `config.fontSize.title`
    - **Validates: Requirements 3.8, 3.9, 3.10, 3.11**

- [ ] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Integrate `NewCustomersAreaChart` into `MainContent.tsx`
  - [ ] 5.1 Add imports and render the chart as the third full-width row
    - Add `import { newCustomersData } from '../../data/newCustomersData'` alongside existing data imports
    - Add `import NewCustomersAreaChart from '../charts/NewCustomersAreaChart'` alongside existing chart imports
    - Inside the `active === 'overview'` JSX (always true since `Section = 'overview'`), add a `<div className="w-full">` wrapper after the existing `grid grid-cols-2` div containing `TopProductsBarChart` and `CategoryPieChart`
    - Render `<NewCustomersAreaChart data={newCustomersData} config={chartConfig} />` inside that wrapper
    - Do not modify `Sidebar.tsx` or the `Section` type
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 5.2 Write unit tests for dashboard integration
    - Render `MainContent` with `active="overview"` and assert `NewCustomersAreaChart` is present in the output
    - Assert the chart is placed after the `grid grid-cols-2` row (third content row)
    - _Requirements: 4.2, 4.3_

- [ ] 6. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- The `Section` type and `Sidebar.tsx` are explicitly out of scope for this feature
- The steering file (`chart-config.md`) requires that no hex color literals appear in chart components — all colors must go through `config.colors[index]`
- Property tests use `vitest` + `fast-check`, matching the project's existing test tooling
- Unit tests validate specific rendering examples and edge cases; property tests validate universal invariants over arbitrary inputs

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "3.1"] },
    { "id": 3, "tasks": ["3.2"] },
    { "id": 4, "tasks": ["3.3", "3.4", "3.5", "5.1"] },
    { "id": 5, "tasks": ["5.2"] }
  ]
}
```
