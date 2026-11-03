# Rediseño del catálogo administrativo

## Intención

Convertir el inventario del panel administrador en una réplica funcional y visual del catálogo público. La persona administradora debe reconocer inmediatamente la misma estructura que ve el cliente, pero las acciones comerciales se sustituyen por controles de gestión.

## Por qué

El panel actual ofrece las operaciones necesarias, pero utiliza una lista y una jerarquía visual diferentes al catálogo público. Esto dificulta saber cómo quedará organizado un producto en la tienda. La nueva vista debe permitir administrar el catálogo en el mismo contexto en que el cliente lo navega.

## Objetivos

- Reutilizar la misma identidad visual del catálogo: fondo gris suave, tarjetas blancas, proporciones de imagen, tipografía, espaciado y precios discretos.
- Replicar la navegación pública por tarjetas y filtros.
- Organizar la entrada por categorías: Perfumes, Ropa, Calzado, Lentes, Accesorios, Ofertas y cualquier categoría personalizada existente.
- Dentro de Perfumes, separar Hombre y Mujer y conservar los filtros Diseñador y Árabes.
- Sustituir Bolsa, WhatsApp y Ver detalles por Editar, Ocultar/Mostrar y Eliminar.
- Mantener Agregar producto, buscador, gestión de portadas y cierre de sesión.
- Mostrar con claridad qué productos están ocultos sin sacarlos del inventario administrativo.
- Conservar todas las API, validaciones, formularios y confirmaciones existentes.

## Experiencia propuesta

### 1. Encabezado administrativo

- Marca Diversas Marcas y una etiqueta discreta “Administración”.
- Navegación por Todos, Perfumes, Calzado, Ropa, Lentes, Accesorios y Ofertas, utilizando los mismos patrones visuales del encabezado público.
- Buscador central con búsqueda por nombre, marca o categoría.
- Acciones persistentes: Agregar producto, Portadas y Cerrar sesión.
- En móvil, las acciones secundarias se agrupan sin reducir ningún objetivo táctil por debajo de 44×44 px.

### 2. Inicio por categorías

- La primera vista muestra tarjetas de categoría equivalentes a las públicas.
- “Todos” siempre regresa a esta portada de categorías; no muestra una cuadrícula mezclada de todos los productos.
- Solo se muestran categorías que tengan productos, además de categorías personalizadas guardadas.
- Cada tarjeta muestra su portada configurada y la cantidad de productos administrados.
- Entrar a una categoría reemplaza la cuadrícula sin recargar la página y conserva un botón Volver predecible.

### 3. Flujo de perfumes

- Perfumes abre las tarjetas Hombre y Mujer.
- Cada público abre su cuadrícula de productos.
- En la parte superior aparecen los filtros Diseñador y Árabes con el mismo comportamiento reversible del catálogo público.
- Los productos Unisex aparecerán en ambos públicos, igual que en el catálogo público actual.

### 4. Tarjetas administrativas

- Misma fotografía, proporción, nombre, marca y precio que la tarjeta pública.
- No aparecen Ver detalles, WhatsApp ni Agregar a la bolsa.
- Franja de acciones administrativas debajo del contenido:
  - Editar: acción principal neutra.
  - Ocultar o Mostrar: cambia según el estado actual y ofrece respuesta inmediata.
  - Eliminar: acción destructiva visualmente secundaria, con confirmación dentro de la tarjeta antes de ejecutar.
- Un producto oculto conserva fotografía y legibilidad, pero incluye una etiqueta “Oculto” y una diferencia visual tenue; nunca dependerá solo del color.
- Estados de guardado, ocultación y eliminación muestran progreso y mensajes accesibles.

### 5. Filtros administrativos

- Filtros de categoría, público y segmento iguales a la navegación pública.
- Filtro adicional de estado: Todos, Visibles y Ocultos.
- La búsqueda respeta la categoría y filtros activos.
- Pulsar nuevamente un filtro activo vuelve a mostrar todos los elementos de ese nivel cuando corresponda.

### 6. Formularios y portadas

- El formulario actual de alta y edición se conserva, incluidos carga y orden de fotografías, atributos por categoría, precio, género, disponibilidad y banderas.
- La gestión de Portadas permanece disponible desde el encabezado administrativo.
- Después de guardar, la persona vuelve al mismo contexto de categoría y filtros donde estaba.

## Sistema visual

- Se reutilizan los tokens del catálogo público para fondo, tarjeta, tinta, texto secundario, radios y sombras.
- Negro carbón para acciones principales, marfil/gris suave para el lienzo, dorado solo como acento de marca y rojo reservado para eliminación.
- Texto con contraste mínimo 4.5:1.
- Imágenes como elemento dominante; los controles se mantienen compactos pero táctiles.
- Transiciones solo de opacidad y transformación, breves y compatibles con `prefers-reduced-motion`.

## Responsive y accesibilidad

- Mobile-first y sin desplazamiento horizontal accidental.
- Objetivos táctiles mínimos de 44×44 px y separación mínima de 8 px.
- Navegación completa por teclado, foco visible y nombres accesibles en controles con iconos.
- Los estados Visible/Oculto y las confirmaciones se anuncian mediante regiones `aria-live` existentes.
- Imágenes con `loading="lazy"` y espacio reservado para evitar saltos de diseño.

## No objetivos

- No cambiar autenticación, endpoints ni estructura de datos.
- No modificar el catálogo público ni sus acciones de compra.
- No eliminar el flujo actual de portadas o creación de categorías.
- No introducir una nueva librería visual.

## Restricciones de implementación

- HTML, CSS y JavaScript existentes con Tailwind CSS v4 y estilos del proyecto.
- Reutilizar normalización de categorías, portadas, datos y funciones de API actuales.
- Evitar duplicar lógica de filtrado cuando pueda compartirse o extraerse.
- Verificar escritorio y móvil, búsquedas, navegación hacia atrás, filtros reversibles y las cuatro operaciones administrativas.

## Criterios de aceptación

1. El panel autenticado abre con las mismas tarjetas de categoría que el catálogo público.
2. Perfumes navega a Hombre/Mujer y después a Diseñador/Árabes.
3. Todas las categorías existentes y personalizadas se pueden recorrer.
4. Las tarjetas replican proporción visual pública y reemplazan acciones comerciales por administración.
5. Editar, Ocultar/Mostrar y Eliminar siguen funcionando con confirmación y feedback.
6. Los productos ocultos permanecen visibles en administración y no aparecen públicamente.
7. Buscar y filtrar funciona en combinación.
8. No se rompen Portadas, Agregar producto, sesión ni formularios.
9. No existe scroll horizontal en 390, 760 y 1280 px.
10. El build de producción termina sin errores.
