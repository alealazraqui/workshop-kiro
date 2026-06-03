# Documento de Requisitos

## Introducción

Este documento define los requisitos para el **Ecommerce Dashboard**, una aplicación React de visualización de datos de comercio electrónico construida con TypeScript, Vite, Recharts y Tailwind CSS. El dashboard presenta métricas clave de ventas mediante tres gráficos interactivos, datos mockeados y un layout con sidebar de navegación. El propósito principal es servir como proyecto de demostración para un workshop sobre el flujo spec → design → tasks de Kiro.

## Glosario

- **Dashboard**: Interfaz principal que muestra el conjunto de gráficos y métricas de e-commerce.
- **Sidebar**: Panel de navegación lateral que permite al usuario moverse entre secciones del Dashboard.
- **Chart**: Componente visual de gráfico (line, bar, pie/donut) renderizado con Recharts.
- **Line Chart**: Gráfico de líneas que muestra la evolución de ventas por período de tiempo.
- **Bar Chart**: Gráfico de barras que muestra los top productos más vendidos.
- **Pie Chart**: Gráfico de tipo donut/pie que muestra la distribución de ventas por categoría.
- **Mock Data**: Datos estáticos generados en el frontend que simulan respuestas de un backend real.
- **Steering File**: Archivo de configuración en `.kiro/steering/` que guía al agente en decisiones de estilo y comportamiento.
- **Chart Config**: Configuración centralizada de estilos visuales (colores, fuentes, comportamiento) compartida entre todos los Charts.

---

## Requisitos

### Requisito 1: Layout principal con Sidebar

**Historia de usuario:** Como participante del workshop, quiero un dashboard con navegación lateral y un área de contenido principal, para poder navegar entre secciones y ver los gráficos claramente organizados.

#### Criterios de aceptación

1. EL Dashboard DEBERÁ renderizar una navegación lateral en el lado izquierdo y un área de contenido principal en el lado derecho.
2. EL Sidebar DEBERÁ mostrar enlaces de navegación para cada sección principal del Dashboard.
3. CUANDO se seleccione un enlace de navegación, EL Dashboard DEBERÁ resaltar la sección activa en el Sidebar.
4. EL Dashboard DEBERÁ ser responsivo y mantener la estructura de layout para anchos de viewport de 1024 px o más.
5. SI el ancho del viewport es inferior a 1024 px, ENTONCES EL Sidebar DEBERÁ colapsar u ocultarse para preservar el espacio utilizable en pantalla.

---

### Requisito 2: Visualización de ventas por período (Line Chart)

**Historia de usuario:** Como participante del workshop, quiero ver un gráfico de líneas que muestre las ventas a lo largo del tiempo, para poder entender las tendencias de ventas en diferentes períodos.

#### Criterios de aceptación

1. EL Dashboard DEBERÁ renderizar un Line Chart que muestre los valores de ventas agrupados por período de tiempo (por ejemplo, días, semanas o meses).
2. EL Line Chart DEBERÁ usar Mock Data que incluya al menos 12 puntos de datos representando períodos de tiempo consecutivos.
3. CUANDO el usuario pase el cursor sobre un punto de datos en el Line Chart, EL Line Chart DEBERÁ mostrar un tooltip con la etiqueta del período y el valor de ventas correspondiente.
4. EL Line Chart DEBERÁ incluir ejes X e Y etiquetados con valores de escala legibles.
5. EL Line Chart DEBERÁ aplicar los estilos visuales definidos en el Chart Config (colores, fuentes, grosor de línea).

---

### Requisito 3: Visualización de top productos (Bar Chart)

**Historia de usuario:** Como participante del workshop, quiero ver un gráfico de barras con los productos más vendidos, para poder identificar cuáles generan más ingresos.

#### Criterios de aceptación

1. EL Dashboard DEBERÁ renderizar un Bar Chart mostrando los nombres de productos en el eje X y el total de unidades vendidas o ingresos en el eje Y.
2. EL Bar Chart DEBERÁ usar Mock Data que incluya entre 5 y 10 productos ordenados por volumen de ventas.
3. CUANDO el usuario pase el cursor sobre una barra del Bar Chart, EL Bar Chart DEBERÁ mostrar un tooltip con el nombre del producto y el valor de ventas correspondiente.
4. EL Bar Chart DEBERÁ renderizar las barras ordenadas de mayor a menor valor de ventas.
5. EL Bar Chart DEBERÁ aplicar los estilos visuales definidos en el Chart Config (colores, fuentes, dimensiones de barra).

---

### Requisito 4: Distribución de ventas por categoría (Pie/Donut Chart)

**Historia de usuario:** Como participante del workshop, quiero ver un gráfico donut con la distribución de ventas por categoría, para poder entender qué categorías de productos contribuyen más a los ingresos totales.

#### Criterios de aceptación

1. EL Dashboard DEBERÁ renderizar un Pie Chart en estilo donut que muestre cada categoría de producto como un segmento separado.
2. EL Pie Chart DEBERÁ usar Mock Data que incluya entre 4 y 8 categorías de productos con sus respectivos porcentajes o valores absolutos de ventas.
3. CUANDO el usuario pase el cursor sobre un segmento del Pie Chart, EL Pie Chart DEBERÁ mostrar un tooltip con el nombre de la categoría y su porcentaje del total de ventas.
4. EL Pie Chart DEBERÁ renderizar una leyenda que identifique cada categoría por color y etiqueta.
5. EL Pie Chart DEBERÁ aplicar los estilos visuales definidos en el Chart Config (paleta de colores, tamaño de fuente, espaciado de segmentos).

---

### Requisito 5: Datos mockeados

**Historia de usuario:** Como participante del workshop, quiero que el dashboard funcione sin un backend, para poder ejecutarlo localmente sin infraestructura adicional.

#### Criterios de aceptación

1. EL Dashboard DEBERÁ obtener todos los datos mostrados en los Charts exclusivamente de Mock Data definidos como módulos TypeScript estáticos.
2. EL Mock Data DEBERÁ incluir interfaces tipadas que coincidan con la forma de datos esperada por cada componente Chart.
3. EL Mock Data DEBERÁ estar organizado en un directorio dedicado (por ejemplo, `src/data/`) para separar las responsabilidades de datos de los componentes de UI.
4. SI un Chart recibe Mock Data indefinido o vacío, ENTONCES EL Chart DEBERÁ renderizar un mensaje de placeholder indicando que no hay datos disponibles.

---

### Requisito 6: Steering file de configuración de gráficos

**Historia de usuario:** Como facilitador del workshop, quiero un steering file con directrices de configuración de gráficos, para que Kiro pueda aplicar estilos visuales consistentes cuando los participantes agreguen un cuarto gráfico durante el workshop.

#### Criterios de aceptación

1. EL proyecto Dashboard DEBERÁ incluir un Steering File ubicado en `.kiro/steering/chart-config.md`.
2. EL Steering File DEBERÁ definir la paleta de colores a usar en todos los Charts, especificando al menos 6 valores de color nombrados en formato hexadecimal.
3. EL Steering File DEBERÁ definir directrices tipográficas incluyendo familia de fuente y tamaños de fuente para títulos de gráficos, etiquetas de ejes y texto de tooltips.
4. EL Steering File DEBERÁ definir directrices de comportamiento incluyendo el comportamiento del tooltip, la duración de las animaciones en milisegundos y la posición de la leyenda.
5. EL Steering File DEBERÁ incluir una sección que describa cómo agregar un nuevo Chart siguiendo las convenciones establecidas, para guiar a los participantes del workshop al implementar el cuarto gráfico.
6. CUANDO Kiro genere o modifique un componente Chart, EL Steering File DEBERÁ ser referenciado para garantizar la consistencia visual en todos los Charts.
