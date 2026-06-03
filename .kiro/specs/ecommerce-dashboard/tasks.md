# Implementation Plan: Ecommerce Dashboard

## Overview

Implementación de una SPA React + TypeScript + Vite que muestra tres gráficos Recharts (Line, Bar, Pie/Donut) sobre datos mockeados, con layout Sidebar + MainContent y estilos centralizados en `chartConfig.ts`. Las tareas siguen el orden de dependencias: infraestructura → tipos → datos → configuración → componentes → integración → steering file.

## Tasks

- [x] 1. Inicializar proyecto y configurar herramientas
  - [x] 1.1 Inicializar proyecto React con Vite y TypeScript
    - Ejecutar `npm create vite@latest . -- --template react-ts` en la raíz del workspace
    - Verificar que `package.json`, `tsconfig.json`, `vite.config.ts` y `src/main.tsx` existan y sean válidos
    - _Requirements: 5.1_

  - [x] 1.2 Instalar y configurar Tailwind CSS
    - Instalar `tailwindcss@3`, `postcss` y `autoprefixer` como devDependencies
    - Ejecutar `npx tailwindcss init -p` para generar `tailwind.config.js` y `postcss.config.js`
    - Configurar `content` en `tailwind.config.js` para incluir `./index.html` y `./src/**/*.{ts,tsx}`
    - Añadir las directivas `@tailwind base/components/utilities` en `src/index.css`
    - _Requirements: 1.1, 1.4, 1.5_

  - [x] 1.3 Instalar Recharts
    - Instalar `recharts` como dependencia de producción
    - Verificar que la importación básica `import { LineChart } from 'recharts'` compila sin errores
    - _Requirements: 2.1, 3.1, 4.1_

- [x] 2. Definir tipos compartidos y datos mockeados
  - [x] 2.1 Crear interfaces compartidas en `src/types/index.ts`
    - Definir `SalesDataPoint`, `ProductDataPoint`, `CategoryDataPoint`, `Section` y `ChartConfig` tal como especifica el diseño
    - Exportar todos los tipos desde el mismo archivo
    - _Requirements: 5.2_

  - [ ]* 2.2 Escribir property test para los módulos de datos (Property 3, 4, 5)
    - **Property 3: Los datos de ventas tienen al menos 12 puntos**
    - **Property 4: Los datos de productos están en rango válido (5–10 elementos)**
    - **Property 5: Los datos de categorías están en rango válido (4–8 elementos)**
    - **Validates: Requirements 2.2, 3.2, 4.2**

  - [x] 2.3 Crear módulo de datos `src/data/salesData.ts`
    - Exportar `salesData: SalesDataPoint[]` con 12 puntos mensuales (Ene–Dic) conforme al diseño
    - Usar el tipo importado desde `src/types`
    - _Requirements: 2.2, 5.1, 5.2, 5.3_

  - [x] 2.4 Crear módulo de datos `src/data/topProductsData.ts`
    - Exportar `topProductsData: ProductDataPoint[]` con 7 productos ordenados descendentemente conforme al diseño
    - Usar el tipo importado desde `src/types`
    - _Requirements: 3.2, 5.1, 5.2, 5.3_

  - [x] 2.5 Crear módulo de datos `src/data/categoryData.ts`
    - Exportar `categoryData: CategoryDataPoint[]` con 5 categorías conforme al diseño
    - Usar el tipo importado desde `src/types`
    - _Requirements: 4.2, 5.1, 5.2, 5.3_

- [x] 3. Crear configuración visual centralizada
  - [x] 3.1 Crear `src/chartConfig.ts`
    - Exportar `chartConfig: ChartConfig` con los valores exactos definidos en el diseño: paleta de 6 colores hex, tipografía Inter, `animation.duration: 400`, `innerRadius: 60`, `barSize: 40`, `strokeWidth: 2`
    - _Requirements: 2.5, 3.5, 4.5_

- [x] 4. Checkpoint — Verificar compilación de tipos y datos
  - Asegurarse de que `tsc --noEmit` no reporta errores en `src/types/index.ts`, `src/data/*.ts` y `src/chartConfig.ts`. Consultar al usuario si surgen dudas.

- [x] 5. Implementar componentes de layout
  - [x] 5.1 Crear componente `src/components/layout/Sidebar.tsx`
    - Aceptar props `{ active: Section; onNavigate: (s: Section) => void }`
    - Renderizar un `<nav>` con los tres enlaces definidos en `SECTIONS` (`sales`, `products`, `categories`)
    - Aplicar clase CSS de estado activo solo al enlace cuya `id === active`
    - Usar `hidden lg:flex` de Tailwind para ocultarse en viewports < 1024 px
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 5.2 Escribir property test para Sidebar (Property 1, 2)
    - **Property 1: Cada sección tiene exactamente un enlace en el Sidebar**
    - **Property 2: El enlace activo es el único con clase activa**
    - **Validates: Requirements 1.2, 1.3**

  - [x] 5.3 Crear componente `src/components/layout/MainContent.tsx`
    - Aceptar props `{ active: Section }`
    - Renderizar `<SalesLineChart>`, `<TopProductsBarChart>` y `<CategoryPieChart>` pasando los datos y `chartConfig`
    - Estructura: `<main className="flex-1 overflow-auto p-6">` con los tres charts
    - _Requirements: 1.1_

- [x] 6. Implementar componentes de gráficos
  - [x] 6.1 Crear `src/components/charts/SalesLineChart.tsx`
    - Aceptar props `{ data: SalesDataPoint[]; config: ChartConfig }`
    - Implementar empty state: si `data` está vacío o es `undefined`, renderizar `<div>No hay datos disponibles</div>`
    - Renderizar `<ResponsiveContainer>` → `<LineChart>` con `<Line>`, `<XAxis>`, `<YAxis>`, `<CartesianGrid>`, `<Tooltip>`
    - Aplicar `config.colors[0]`, `config.strokeWidth`, `config.fontFamily` y `config.animation.duration`
    - _Requirements: 2.1, 2.3, 2.4, 2.5, 5.4_

  - [ ]* 6.2 Escribir property test para SalesLineChart (Property 7, 8)
    - **Property 7: Chart con data vacía renderiza placeholder**
    - **Property 8: Los charts aplican colores del ChartConfig**
    - **Validates: Requirements 5.4, 2.5**

  - [x] 6.3 Crear `src/components/charts/TopProductsBarChart.tsx`
    - Aceptar props `{ data: ProductDataPoint[]; config: ChartConfig }`
    - Implementar empty state con el mismo patrón de placeholder
    - Ordenar `data` descendentemente por `value` dentro del componente antes de renderizar
    - Renderizar `<ResponsiveContainer>` → `<BarChart>` con `<Bar>`, `<XAxis>`, `<YAxis>`, `<CartesianGrid>`, `<Tooltip>`
    - Aplicar `config.colors[1]`, `config.barSize`, `config.fontFamily` y `config.animation.duration`
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 5.4_

  - [ ]* 6.4 Escribir property test para TopProductsBarChart (Property 6, 7, 8)
    - **Property 6: El Bar Chart presenta productos en orden descendente**
    - **Property 7: Chart con data vacía renderiza placeholder**
    - **Property 8: Los charts aplican colores del ChartConfig**
    - **Validates: Requirements 3.4, 5.4, 3.5**

  - [x] 6.5 Crear `src/components/charts/CategoryPieChart.tsx`
    - Aceptar props `{ data: CategoryDataPoint[]; config: ChartConfig }`
    - Implementar empty state con el mismo patrón de placeholder
    - Renderizar `<ResponsiveContainer>` → `<PieChart>` con `<Pie innerRadius={config.innerRadius}>`, `<Cell>`, `<Tooltip>`, `<Legend>`
    - Colorear cada `<Cell>` con `config.colors[index % config.colors.length]`
    - Posicionar la `<Legend>` según `config.legend.placement`
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 5.4_

  - [ ]* 6.6 Escribir property test para CategoryPieChart (Property 7, 8)
    - **Property 7: Chart con data vacía renderiza placeholder**
    - **Property 8: Los charts aplican colores del ChartConfig**
    - **Validates: Requirements 5.4, 4.5**

- [x] 7. Checkpoint — Verificar renderizado de charts en aislamiento
  - Asegurarse de que cada chart compila y renderiza sin errores con datos válidos y con array vacío. Consultar al usuario si surgen dudas.

- [x] 8. Integrar todo en `App.tsx`
  - [x] 8.1 Implementar `src/App.tsx` con layout raíz
    - Declarar estado `activeSection: Section` inicializado en `'sales'`
    - Renderizar `<div className="flex h-screen bg-gray-50">` conteniendo `<Sidebar>` y `<MainContent>`
    - Pasar `active={activeSection}` y `onNavigate={setActiveSection}` al `<Sidebar>`
    - Pasar `active={activeSection}` al `<MainContent>`
    - _Requirements: 1.1, 1.3_

  - [ ]* 8.2 Escribir tests de integración para la navegación del Sidebar
    - Verificar que hacer clic en un enlace actualiza el estado `activeSection` en `App`
    - Verificar que el chart correspondiente es visible tras la navegación
    - _Requirements: 1.3_

- [x] 9. Crear steering file `.kiro/steering/chart-config.md`
  - [x] 9.1 Crear `.kiro/steering/chart-config.md`
    - Sección 1: Paleta de colores — 6 valores hex nombrados (`indigo`, `cyan`, `amber`, `emerald`, `rose`, `violet`) con sus valores `#rrggbb`
    - Sección 2: Tipografía — familia `Inter, system-ui, sans-serif`; tamaños: título 16 px, etiquetas de eje 12 px, tooltip 13 px
    - Sección 3: Comportamiento — tooltip con cursor, `animation.duration: 400 ms`, leyenda en `bottom`
    - Sección 4: Cómo agregar un nuevo chart — pasos detallados: crear tipo en `src/types/index.ts`, añadir datos en `src/data/`, crear componente en `src/components/charts/`, importar en `MainContent.tsx`, registrar sección en `Sidebar.tsx`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 10. Checkpoint final — Verificar aplicación completa
  - Asegurarse de que `npm run build` completa sin errores de TypeScript ni de Vite, y que todos los tests pasan. Consultar al usuario si surgen dudas.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- El stack está fijo: React 18 + TypeScript + Vite + Recharts + Tailwind CSS 3
- Los datos son exclusivamente estáticos; no hay llamadas a red ni estado persistente
- El diseño incluye 8 propiedades de correctness — los property tests las cubren por grupos temáticos
- Los checkpoints en las tareas 4, 7 y 10 permiten detectar errores de compilación o integración de forma incremental
- Cada tarea referencia los requisitos específicos que satisface para trazabilidad completa

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1"] },
    { "id": 3, "tasks": ["2.3", "2.4", "2.5"] },
    { "id": 4, "tasks": ["2.2", "3.1"] },
    { "id": 5, "tasks": ["5.1", "5.3", "6.1", "6.3", "6.5"] },
    { "id": 6, "tasks": ["5.2", "6.2", "6.4", "6.6"] },
    { "id": 7, "tasks": ["8.1"] },
    { "id": 8, "tasks": ["8.2", "9.1"] }
  ]
}
```
