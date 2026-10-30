# Diversas Marcas — guía de desarrollo y publicación

Catálogo de la boutique Diversas Marcas en Tepic, construido con HTML, Tailwind CSS 4, JavaScript modular, Anime.js y una API Express. El proyecto no usa React.

## Desarrollo local

Requiere Node.js 22 o posterior. Instala dependencias y genera la contraseña privada del panel una sola vez:

```bash
npm install
npm run setup:admin
npm run dev
```

Abre la dirección local que muestra Vite (normalmente `http://127.0.0.1:5173`). El catálogo carga el inventario inicial desde `js/products.js`; el servidor crea `data/products.json` para guardar cambios administrativos.

## Abrir el panel privado

En el catálogo presiona **Ctrl + Alt + Shift + M** y escribe la contraseña de administrador. El atajo solo abre el formulario de acceso; la API comprueba la sesión antes de permitir consultar o cambiar productos. Las contraseñas se limitan a cinco intentos por ventana de 15 minutos.

La contraseña se crea en `.env`, que está excluido de Git. Para verla en tu propio equipo ejecuta `npm run admin:credentials`; no compartas esa salida ni publiques `.env`. Para reemplazarla, cambia `ADMIN_PASSWORD` en `.env` por una contraseña larga y única y reinicia los servidores. Mantén `SESSION_SECRET` privado.

Desde el panel se pueden agregar, editar y eliminar productos, con nombre, marca, categoría, precios, imágenes, público, stock, tallas o presentaciones, colores, descripción, características y distintivos de oferta/novedad/destacado. Las imágenes externas deben usar HTTPS; las del proyecto pueden referenciarse con rutas como `/assets/foto.jpg`.

### Sugerencias de producto con Gemini

En el formulario de producto, selecciona una o más fotos y pulsa **Analizar primera foto** para recibir sugerencias de marca, modelo y datos descriptivos. Gemini solo propone texto: revisa y aplica los campos que coincidan con el producto. El precio, las presentaciones, los colores, la disponibilidad y los distintivos siguen siendo manuales. La foto seleccionada se envía a Google Gemini para analizarla; en el nivel gratuito, Google puede usar los datos enviados para mejorar sus productos.

Para activarlo localmente, crea una clave en [Google AI Studio](https://aistudio.google.com/app/apikey) y añádela a tu `.env` como `GEMINI_API_KEY`. En Render, agrega `GEMINI_API_KEY` en la configuración Environment del servicio web y vuelve a desplegar. La clave se usa únicamente en el servidor y nunca se entrega al navegador. `GEMINI_MODEL` es opcional y por defecto usa `gemini-3.8-flash`; disponibilidad, cuotas y condiciones del nivel gratuito dependen del proyecto de Google.

## Producción

El panel requiere el servidor Node: un hosting estático que solo publica `dist/` no guarda cambios ni ofrece administración. Configura `ADMIN_PASSWORD`, `SESSION_SECRET`, `NODE_ENV=production` y un `DATA_DIR` persistente en el proveedor de hosting. Usa HTTPS y un disco persistente para `DATA_DIR`, ya que `data/products.json` contiene el catálogo administrado.

```bash
npm install
npm run build
npm start
```

El servidor Express entrega la web compilada y la API en el mismo origen. No subas `.env` al repositorio. Haz copia de seguridad de `data/products.json` antes de cambiar o restablecer el almacenamiento del hosting.

## Mantenimiento del catálogo

El inventario inicial y sus valores de respaldo viven en `js/products.js`. Después de que la API cree `data/products.json`, el catálogo de ese servidor usa el archivo persistente. Las búsquedas, categorías, marcas, ordenamiento, bolsa y enlaces de WhatsApp se mantienen en la web pública.

`iniciar_servidor.bat` inicia el servidor de desarrollo local. `npm run build` compila Tailwind y agrupa JavaScript y Anime.js para producción.
