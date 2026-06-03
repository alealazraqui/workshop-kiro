# Requirements Document

## Introduction

This feature adds a new area chart to the existing ecommerce dashboard that displays the monthly evolution of new customers throughout the current year. The chart renders as a full-width third row directly inside the `overview` section of `MainContent.tsx`, below the existing Bar and Pie chart grid. No new sidebar section or navigation entry is created. The chart follows the project's centralized visual configuration (`chartConfig`) and the patterns established by the existing chart components.

## Glossary

- **Dashboard**: The single-page ecommerce analytics application rendered by `App.tsx`.
- **Overview Section**: The only visible section of the dashboard, identified by `active === 'overview'`, rendered by `MainContent.tsx`.
- **NewCustomersAreaChart**: The new React component that renders an area chart of new customers per month.
- **NewCustomerDataPoint**: The TypeScript interface representing one month's data point (month label + customer count).
- **chartConfig**: The centralized `ChartConfig` object exported from `src/chartConfig.ts` that defines all visual tokens (colors, fonts, animation, tooltip, legend).
- **config.colors\[3\]**: The emerald color (`#10b981`) at index 3 of `chartConfig.colors`, used as the primary color for the new chart.
- **Empty State**: The fallback UI rendered when the `data` prop is absent or contains zero elements.
- **Mock Data**: Static, hardcoded data defined in `src/data/newCustomersData.ts` representing 12 months of the current year.

---

## Requirements

### Requirement 1: Data Interface

**User Story:** As a developer, I want a typed data interface for new-customer data points, so that the component and data module share a single source of truth for the data shape.

#### Acceptance Criteria

1. THE `src/types/index.ts` module SHALL export an interface named `NewCustomerDataPoint` with a `month` property of type `string` and a `customers` property of type `number`.
2. THE `NewCustomerDataPoint` interface SHALL be added to the existing `src/types/index.ts` file without modifying any currently exported interface or type.

---

### Requirement 2: Mock Data Module

**User Story:** As a developer, I want a dedicated data module with realistic mock values, so that the chart has meaningful data to render without a backend dependency.

#### Acceptance Criteria

1. THE `src/data/newCustomersData.ts` module SHALL export a constant named `newCustomersData` typed as `NewCustomerDataPoint[]`.
2. THE `newCustomersData` array SHALL contain exactly 12 elements, one per month of the current year, using Spanish abbreviated month labels (`Ene`, `Feb`, `Mar`, `Abr`, `May`, `Jun`, `Jul`, `Ago`, `Sep`, `Oct`, `Nov`, `Dic`).
3. THE `newCustomersData` array SHALL contain realistic integer customer-count values that reflect a plausible growth trend across the year (values between 80 and 600 inclusive).

---

### Requirement 3: NewCustomersAreaChart Component

**User Story:** As a dashboard user, I want to see a clearly labeled area chart of new customers per month, so that I can understand customer acquisition trends at a glance.

#### Acceptance Criteria

1. THE `NewCustomersAreaChart` component SHALL accept two props: `data` of type `NewCustomerDataPoint[]` and `config` of type `ChartConfig`.
2. WHEN the `data` prop is an empty array or `undefined`, THE `NewCustomersAreaChart` SHALL render a fallback `<div>` containing the text `"No hay datos disponibles"` and SHALL NOT render any Recharts element.
3. WHEN the `data` prop contains one or more elements, THE `NewCustomersAreaChart` SHALL render a Recharts `AreaChart` wrapped in a `ResponsiveContainer` with `width="100%"` and `height={300}`.
4. THE `NewCustomersAreaChart` SHALL use `config.colors[3]` as the stroke color and fill color for the `<Area>` element.
5. THE `NewCustomersAreaChart` SHALL set `fillOpacity` to `0.15` on the `<Area>` element.
6. THE `NewCustomersAreaChart` SHALL set `strokeWidth` to `config.strokeWidth` on the `<Area>` element.
7. THE `NewCustomersAreaChart` SHALL pass `isAnimationActive={true}` and `animationDuration={config.animation.duration}` to the `<Area>` element.
8. THE `NewCustomersAreaChart` SHALL configure `<XAxis>` with `dataKey="month"` and tick styles using `config.fontFamily` and `config.fontSize.axisLabel`.
9. THE `NewCustomersAreaChart` SHALL configure `<YAxis>` with tick styles using `config.fontFamily` and `config.fontSize.axisLabel`.
10. THE `NewCustomersAreaChart` SHALL pass `cursor={config.tooltip.cursor}` to the `<Tooltip>` element and apply `fontFamily: config.fontFamily` and `fontSize: config.fontSize.tooltip` to the tooltip `contentStyle`.
11. THE `NewCustomersAreaChart` SHALL render a title element using `config.fontFamily` and `config.fontSize.title` with the text `"Nuevos Clientes por Mes"`.
12. THE `NewCustomersAreaChart` SHALL be placed in `src/components/charts/NewCustomersAreaChart.tsx` and SHALL NOT import any hex color value directly.

---

### Requirement 4: Dashboard Integration

**User Story:** As a dashboard user, I want the new area chart to appear as a full-width third row in the overview section, so that I can see customer acquisition data alongside the existing sales and product charts without navigating elsewhere.

#### Acceptance Criteria

1. THE `MainContent.tsx` component SHALL import `newCustomersData` from `../../data/newCustomersData` and `NewCustomersAreaChart` from `../charts/NewCustomersAreaChart`.
2. WHEN `active === 'overview'`, THE `MainContent.tsx` component SHALL render `<NewCustomersAreaChart>` with `data={newCustomersData}` and `config={chartConfig}` as a direct child of the main scrollable container.
3. THE `NewCustomersAreaChart` render block in `MainContent.tsx` SHALL appear after the existing `grid grid-cols-2` row that contains `TopProductsBarChart` and `CategoryPieChart`, making it the third content row.
4. THE `NewCustomersAreaChart` render block SHALL be wrapped in a `<div className="w-full">` element so the chart occupies the full available width.
5. THE `Sidebar.tsx` file SHALL NOT be modified as part of this feature.
6. THE `Section` type in `src/types/index.ts` SHALL NOT be modified as part of this feature.
