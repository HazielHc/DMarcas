# Reglas de Desarrollo y Diseño UI/UX para Diversas Marcas

## Skills disponibles para los agentes
Las skills del proyecto están instaladas en `.agents/skills/`. Antes de una tarea que implique diseño, UI/UX, sistema visual o creación/iteración de skills, el agente debe consultar el `SKILL.md` correspondiente y sus referencias o herramientas locales cuando sean pertinentes. Skills disponibles: `brainstorming`, `frontend-design`, `skill-creator`, `tailwind-design-system` y `ui-ux-pro-max`. Estas skills son guías y recursos de trabajo para los agentes; no son agentes autónomos separados.

Estas directivas son de aplicación **OBLIGATORIA** cada vez que se diseñe, modifique o genere código (HTML, CSS, JS o frameworks) en este proyecto:

## 1. Aplicación de Skills Instaladas
* **`ui-ux-pro-max`**:
  - **Accesibilidad crítica**: Contraste mínimo 4.5:1 (WCAG AA/AAA) en todos los textos de productos, precios y etiquetas.
  - **Touch targets**: Todos los botones y elementos clicables deben medir al menos 44×44px en móviles con separación mínima de 8px.
  - **Sin scroll horizontal accidental**: Todos los contenedores deben respetar el ancho de pantalla de smartphones.
  - **Feedback táctil y de estado**: Brindar respuesta visual inmediata (<100ms) a las interacciones del usuario (clics en filtros, botones de WhatsApp, apertura de modal, añadir a la bolsa).

* **`frontend-design`**:
  - **Evitar patrones cliché o clichés de IA**: No usar textos en mayúsculas sostenidas innecesarias, sombras genéricas idénticas o decoraciones vacías.
  - **Identidad específica y propia**: Respetar la personalidad de **Diversas Marcas (Tepic, Nayarit)** con su paleta de negro carbón, marfil suave, detalles dorados y acento verde de WhatsApp.
  - **Copywriting claro y empático**: Llamados a la acción directos ("Pedir por WhatsApp", "Ver detalles", "Agregar a la bolsa") en lugar de términos abstractos.

* **`tailwind-design-system`**:
  - Mantener coherencia en los tokens de diseño (colores semánticos, espaciados en escala múltiplos de 4/8px, radios consistentes).
  - Componentes modulares, limpios y legibles.

* **`skill-creator`**:
  - Utilizar para registrar, probar o iterar nuevas habilidades y workflows en el proyecto.

* **`brainstorming`**:
  - Utilizar antes de cualquier trabajo creativo o de diseño de nuevas funcionalidades para clarificar la intención real del usuario y evitar suposiciones no validadas.
  - Mostrar prototipos visuales y opciones claras (A/B) cuando sea más fácil ver que explicar.

---

## 2. Pautas Técnicas del Código
* **Mobile-First**: El 90% de los clientes accederá desde su celular a través de Instagram (`@dm.diversas.marcas`). La experiencia móvil debe ser impecable.
* **Rendimiento**: Carga diferida (`loading="lazy"`) en imágenes de catálogo y optimización de recursos.
* **Persistencia e Integridad**: No alterar la funcionalidad de los enlaces de WhatsApp, buscador o filtros sin verificación previa.
