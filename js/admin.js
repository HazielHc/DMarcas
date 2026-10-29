const ADMIN_COMMAND = { ctrlKey: true, altKey: true, shiftKey: true, key: "m" };
const adminOverlay = document.createElement("div");
adminOverlay.className = "admin-overlay";
adminOverlay.id = "adminOverlay";
adminOverlay.hidden = true;
adminOverlay.setAttribute("aria-hidden", "true");
adminOverlay.innerHTML = `
  <section class="admin-panel" role="dialog" aria-modal="true" aria-labelledby="adminTitle" tabindex="-1">
    <header class="admin-header">
      <a class="admin-brand" href="#" aria-label="Diversas Marcas, administración"><img src="/assets/logo.png" alt="" /><span>Diversas Marcas</span></a>
      <nav class="admin-nav" aria-label="Navegación de administración"><a href="#adminWorkspace" id="adminProductsLink">Productos</a><button class="admin-nav-add" type="button" id="adminNavAdd">Agregar producto</button></nav>
      <div class="admin-header-actions">
        <button class="admin-button admin-button-quiet" type="button" id="adminLogout" hidden>Cerrar sesión</button>
        <button class="admin-close" type="button" id="adminClose" aria-label="Cerrar administración">×</button>
      </div>
    </header>

    <div class="admin-message" id="adminMessage" role="status" aria-live="polite" hidden></div>

    <main class="admin-main">
    <form class="admin-login" id="adminLoginForm" autocomplete="on" data-reveal="rise">
      <div class="admin-login-copy">
        <p class="admin-eyebrow">Administración · Tepic, Nayarit</p>
        <h2 id="adminTitle">Administra<br />tu catálogo</h2>
        <p>Inicia sesión para agregar, editar o eliminar productos.</p>
      </div>
      <div class="admin-login-card"><span class="admin-lock-mark" aria-hidden="true"><i class="fa-solid fa-lock"></i></span><h2>Acceso privado</h2><p>Ingresa tu contraseña para continuar.</p>
        <label for="adminPassword">Contraseña de administrador</label>
        <input id="adminPassword" name="password" type="password" autocomplete="current-password" required minlength="12" class="admin-input" />
        <button class="admin-button admin-button-primary" type="submit">Iniciar sesión</button>
      </div>
    </form>

    <div class="admin-workspace" id="adminWorkspace" hidden>
      <section class="admin-products-section" aria-labelledby="adminProductsTitle">
        <div class="admin-section-heading">
          <div><p class="admin-eyebrow">Inventario</p><h2 id="adminProductsTitle">Productos<br />del catálogo</h2><p class="admin-summary" id="adminProductCount"></p></div>
          <button class="admin-button admin-button-primary" type="button" id="adminAddProduct"><span aria-hidden="true">+</span> Agregar producto</button>
        </div>
        <p class="admin-list-intro">Busca por nombre, marca o categoría.</p>
        <label class="sr-only" for="adminSearch">Buscar productos para administrar</label>
        <input id="adminSearch" class="admin-input admin-search" type="search" placeholder="Buscar productos" />
        <div class="admin-product-list" id="adminProductList" data-reveal="media"></div>
      </section>
      <section class="admin-image-guide" id="adminImageGuide" aria-labelledby="adminImageTitle" data-reveal="slide">
        <div class="admin-guide-heading"><p class="admin-eyebrow">Imágenes del producto</p><h2 id="adminImageTitle">Fotografías<br />en cuatro pasos</h2><p>Las rutas de imagen se guardan junto con los datos del producto.</p></div>
        <ol class="admin-image-steps"><li><span>01</span><h3>Selecciona</h3><p>Elige hasta 12 im&#225;genes desde tu dispositivo en el formulario.</p></li><li><span>02</span><h3>Revisa</h3><p>Comprueba las vistas previas y que el producto se reconozca con claridad.</p></li><li><span>03</span><h3>Ordena</h3><p>Coloca primero la imagen que quieres mostrar en el cat&#225;logo.</p></li><li><span>04</span><h3>Guarda</h3><p>El servidor guarda las im&#225;genes y vincula sus rutas al producto.</p></li></ol>
        <p class="admin-upload-note">Se admiten im&#225;genes JPG, PNG, WebP o GIF de hasta 8 MB cada una. Tras confirmar la subida, se guardan en <code>product-images</code> dentro de <code>DATA_DIR</code> (por defecto, <code>data/product-images</code>).</p>
      </section>
      <section class="admin-confirmations" aria-labelledby="adminConfirmTitle" data-reveal="rise"><div><p class="admin-eyebrow">Ayuda</p><h2 id="adminConfirmTitle">Guardar con claridad</h2></div><div class="admin-disclosures"><details open><summary>¿Cuándo se confirma un cambio?</summary><p>Después de que el servidor guarda el producto y responde correctamente.</p></details><details><summary>¿Qué pasa si un dato no es válido?</summary><p>El servidor muestra el motivo para que puedas corregir el campo y volver a guardar.</p></details><details><summary>¿Dónde queda la información?</summary><p>Los datos del catálogo se guardan en <code>data/products.json</code> o en la carpeta configurada en <code>DATA_DIR</code>.</p></details><details><summary>¿Cómo se elimina un producto?</summary><p>Elige Eliminar en el producto y confirma la acción antes de que se actualice el catálogo.</p></details><details><summary>¿Qué ocurre al vencer la sesión?</summary><p>Vuelve a iniciar sesión para continuar administrando productos.</p></details></div></section>
    </div>
    </main>

    <dialog class="admin-category-dialog" id="adminCategoryDialog" aria-labelledby="adminCategoryTitle">
      <section class="admin-category-picker" aria-live="polite">
        <header class="admin-form-header">
          <div><p class="admin-eyebrow">Nuevo producto · Paso 1 de 2</p><h3 id="adminCategoryTitle">Elige una sección</h3></div>
          <button class="admin-close admin-form-close" type="button" id="adminCategoryClose" aria-label="Cerrar selección">×</button>
        </header>
        <p class="admin-category-intro">Organiza el producto en el catálogo.</p>
        <div class="admin-category-choices" id="adminCategoryChoices"></div>
        <form class="admin-new-category-form" id="adminNewCategoryForm" hidden>
          <label class="admin-field" for="adminNewCategoryName">Nombre de la nueva sección<input class="admin-input" id="adminNewCategoryName" name="name" maxlength="50" required placeholder="Ej. Relojes" /></label>
          <div class="admin-category-create-actions"><button class="admin-button admin-button-quiet" type="button" id="adminCancelNewCategory">Cancelar</button><button class="admin-button admin-button-primary" type="submit" id="adminSaveNewCategory">Crear sección</button></div>
        </form>
        <button class="admin-category-add" type="button" id="adminShowNewCategory"><span aria-hidden="true">+</span> Crear nueva sección</button>
      </section>
    </dialog>

    <dialog class="admin-product-dialog" id="adminProductDialog" aria-labelledby="adminFormTitle">
      <form class="admin-product-form" id="adminProductForm">
        <header class="admin-form-header">
          <div><p class="admin-eyebrow" id="adminFormEyebrow">Nuevo producto</p><h3 id="adminFormTitle">Agregar producto</h3><p class="admin-form-subtitle">Completa los datos principales y revisa los detalles antes de guardar.</p></div>
          <button class="admin-close admin-form-close" type="button" id="adminFormClose" aria-label="Cerrar formulario">×</button>
        </header>
        <div class="admin-form-sections">
          <section class="admin-form-section" aria-labelledby="adminIdentityTitle">
            <header class="admin-form-section-heading"><span>01</span><div><h4 id="adminIdentityTitle">Identidad e imágenes</h4><p>Lo que el cliente verá primero en el catálogo.</p></div></header>
            <div class="admin-form-grid">
              <label class="admin-field admin-field-wide">Nombre del producto<input class="admin-input" name="name" required maxlength="160" placeholder="Ej. Sauvage Eau de Parfum" /></label>
              <label class="admin-field">Marca<input class="admin-input" name="brand" required maxlength="100" placeholder="Ej. Dior" /></label>
              <label class="admin-field admin-category-edit-field">Sección<select class="admin-input" name="category" required><option value="">Elige una sección</option><option>Perfumes</option><option>Ropa</option><option>Calzado</option><option>Accesorios</option></select></label>
              <div class="admin-field admin-category-static" hidden><span>Sección</span><span class="admin-category-static-value" id="adminCategoryStaticValue"></span></div>
              <div class="admin-field admin-field-wide admin-upload-field"><span class="admin-field-label">Fotografías del producto</span><label class="admin-upload-control" for="adminImageFiles"><span class="admin-upload-action">Seleccionar fotos</span><span>o arrástralas aquí</span><input id="adminImageFiles" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple /></label><span class="admin-field-help" id="adminImageHelp">Hasta 12 imágenes JPG, PNG, WebP o GIF; máximo 8 MB cada una. La primera será la portada.</span><p class="admin-image-status" id="adminImageStatus" role="status" aria-live="polite"></p><div class="admin-image-preview" id="adminImagePreview" aria-live="polite"></div></div>
            </div>
          </section>
          <section class="admin-form-section" aria-labelledby="adminAttributesTitle">
            <header class="admin-form-section-heading"><span>02</span><div><h4 id="adminAttributesTitle">Aroma y presentación</h4><p id="adminAttributesDescription">Define la fragancia y los tamaños disponibles.</p></div></header>
            <div class="admin-form-grid">
              <div class="admin-field admin-field-wide" id="adminCategoryFields" hidden></div>
              <input type="hidden" name="categoryDetails" value="{}" />
              <div class="admin-field" id="adminPresentationChoices"><span>Presentaciones</span><input type="hidden" name="sizes" /><div class="admin-choice-grid" data-choice-group="presentation" aria-label="Presentaciones disponibles"></div><span class="admin-field-help">Selecciona una o varias opciones.</span></div>
              <div class="admin-field" id="adminColorChoices"><span>Colores principales</span><input type="hidden" name="colors" /><div class="admin-color-grid" data-choice-group="color" aria-label="Colores del producto"></div><div class="admin-custom-color-controls"><div class="admin-custom-color-slots" id="adminCustomColorSlots"></div><button type="button" class="admin-custom-color-add" id="adminAddCustomColor"><span aria-hidden="true">+</span> Agregar otro color</button></div><span class="admin-field-help">Selecciona colores de la paleta o agrega los tuyos.</span></div>
            </div>
          </section>
          <section class="admin-form-section" aria-labelledby="adminPriceTitle">
            <header class="admin-form-section-heading"><span>03</span><div><h4 id="adminPriceTitle">Precio y disponibilidad</h4><p>El precio de venta no puede superar el precio regular.</p></div></header>
            <div class="admin-form-grid">
              <label class="admin-field">Precio regular (MXN)<input class="admin-input" name="regularPrice" type="number" min="1" step="0.01" required placeholder="$0.00" /></label>
              <label class="admin-field">Precio de venta (MXN)<input class="admin-input" name="offerPrice" type="number" min="1" step="0.01" required placeholder="$0.00" /></label>
              <label class="admin-field">Público o género<select class="admin-input" name="gender"><option value="">Sin especificar</option><option>Unisex</option><option>Mujer</option><option>Hombre</option></select></label>
              <label class="admin-field">Disponibilidad<select class="admin-input" name="stockStatus"><option>En stock</option><option>Últimas unidades</option><option>Agotado</option></select><span class="admin-field-help">Se muestra en los detalles del producto.</span></label>
            </div>
          </section>
          <section class="admin-form-section" aria-labelledby="adminDetailTitle">
            <header class="admin-form-section-heading"><span>04</span><div><h4 id="adminDetailTitle">Información para el cliente</h4><p>Responde dudas frecuentes antes de que te contacten.</p></div></header>
            <div class="admin-form-grid">
              <label class="admin-field admin-field-wide">Descripción<textarea class="admin-input admin-textarea" name="description" rows="3" maxlength="2000" placeholder="Describe el aroma, duración o presentación con información útil."></textarea></label>
              <label class="admin-field admin-field-wide">Características adicionales<textarea class="admin-input admin-textarea" name="features" rows="2" maxlength="3000" placeholder="Agrega solo datos útiles que no estén indicados arriba."></textarea><span class="admin-field-help">No repitas familia olfativa, presentación ni color.</span></label>
            </div>
          </section>
        </div>
        <fieldset class="admin-flags"><legend>Visibilidad en el catálogo</legend>
          <label><input type="checkbox" name="onSale" /> En oferta</label>
          <label><input type="checkbox" name="isNew" /> Nuevo ingreso</label>
          <label><input type="checkbox" name="featured" /> Destacado <span class="admin-flag-help">Muestra “Selección DM” en la foto.</span></label>
        </fieldset>
        <div class="admin-form-footer">
          <button class="admin-button admin-button-quiet" type="button" id="adminCancelForm">Cancelar</button>
          <button class="admin-button admin-button-primary" type="submit" id="adminSaveProduct">Guardar producto</button>
        </div>
      </form>
    </dialog>
  </section>`;
document.body.append(adminOverlay);

const $ = (selector) => adminOverlay.querySelector(selector);
const adminPanel = $(".admin-panel");
const loginForm = $("#adminLoginForm");
const adminWorkspace = $("#adminWorkspace");
const adminMessage = $("#adminMessage");
const productList = $("#adminProductList");
const productDialog = $("#adminProductDialog");
const categoryDialog = $("#adminCategoryDialog");
const categoryChoices = $("#adminCategoryChoices");
const productForm = $("#adminProductForm");
const adminNav = $(".admin-nav");
const imagePreview = $("#adminImagePreview");
const imageFiles = $("#adminImageFiles");
const imageStatus = $("#adminImageStatus");
const categoryFields = $("#adminCategoryFields");
let productCache = [];
let categoryCache = ["Perfumes", "Calzado", "Lentes", "Ropa", "Accesorios", "Otros"];
let pendingDeleteId = null;
let imageEntries = [];
let editingId = null;
let categoryDrafts = {};
let activeCategory = "";
let previousFocus = null;
let previousInert = new Map();
let cleanupReferenceReveals;

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[character]));

const money = (value) => `$${Number(value).toLocaleString("es-MX", { maximumFractionDigits: 2 })} MXN`;

const productImagePath = (product, imagePath = product.images?.[0]) => {
  if (!imagePath) return "";
  if (product.id === "sauvage-extrain-ef27ec" && imagePath.startsWith("https://www.bing.com/images/search")) {
    return "/assets/products/sauvage-extrain.jpg";
  }
  return imagePath;
};

const showMessage = (message, isError = false) => {
  adminMessage.textContent = message;
  adminMessage.classList.toggle("is-error", isError);
  adminMessage.hidden = !message;
};

const adminFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers }
  });
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "No se pudo completar la operación.");
  return payload;
};

const setPageInert = (inert) => {
  if (inert) {
    previousInert = new Map();
    for (const child of document.body.children) {
      if (child === adminOverlay || child.tagName === "SCRIPT") continue;
      previousInert.set(child, child.inert);
      child.inert = true;
    }
    document.body.style.overflow = "hidden";
    return;
  }
  for (const [element, oldValue] of previousInert) element.inert = oldValue;
  previousInert.clear();
  document.body.style.overflow = "";
};

const openAdmin = async () => {
  if (!adminOverlay.hidden) return;
  previousFocus = document.activeElement;
  adminOverlay.hidden = false;
  adminOverlay.setAttribute("aria-hidden", "false");
  cleanupReferenceReveals?.();
  cleanupReferenceReveals = installReferenceReveals(adminOverlay);
  setPageInert(true);
  showMessage("");
  loginForm.hidden = false;
  adminWorkspace.hidden = true;
  adminNav.hidden = true;
  $("#adminLogout").hidden = true;

  try {
    const session = await adminFetch("/api/admin/session");
    if (session.authenticated) await showWorkspace();
    else $("#adminPassword").focus();
  } catch {
    showMessage("No se pudo conectar con el servicio de administración. Inicia el servidor local completo.", true);
    $("#adminPassword").focus();
  }
};

const closeAdmin = () => {
  if (categoryDialog.open) categoryDialog.close();
  if (productDialog.open) productDialog.close();
  adminOverlay.hidden = true;
  adminOverlay.setAttribute("aria-hidden", "true");
  setPageInert(false);
  if (previousFocus instanceof HTMLElement) previousFocus.focus();
};

const showWorkspace = async () => {
  loginForm.hidden = true;
  adminWorkspace.hidden = false;
  adminNav.hidden = false;
  $("#adminLogout").hidden = false;
  await refreshProducts();
  $("#adminSearch").focus();
  cleanupReferenceReveals?.();
  cleanupReferenceReveals = installReferenceReveals(adminOverlay);
};

const refreshProducts = async () => {
  productCache = await adminFetch("/api/products");
  try { categoryCache = await adminFetch("/api/admin/categories"); } catch { /* La sesión expirada se informa al guardar. */ }
  syncProductCategoryOptions();
  renderProducts($("#adminSearch").value);
};

const normalizeCategoryText = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-MX").trim();

const productAdminSection = (product) => {
  const category = normalizeCategoryText(product.category);
  const lensTerms = normalizeCategoryText(`${product.details?.type ?? ""} ${product.name}`);
  if (category === "perfumes") return "perfumes";
  if (category === "calzado") return "calzado";
  if (category === "ropa") return "ropa";
  if (category === "lentes" || (category === "accesorios" && /\blentes?\b/.test(lensTerms))) return "lentes";
  if (category === "accesorios") return "accesorios";
  if (category === "otros" || category === "otros productos") return "otros";
  return `custom:${category}`;
};

const renderProducts = (query = "") => {
  const normalizedQuery = query.trim().toLocaleLowerCase("es-MX");
  const visibleProducts = productCache.filter((product) =>
    [product.name, product.brand, product.category].some((value) => String(value).toLocaleLowerCase("es-MX").includes(normalizedQuery))
  );
  $("#adminProductCount").textContent = `${productCache.length} productos · ${visibleProducts.length} visibles`;
  if (visibleProducts.length === 0) {
    productList.innerHTML = `<p class="admin-empty">No hay productos que coincidan con esa búsqueda.</p>`;
    return;
  }
  const sectionOrder = [
    ["perfumes", "Perfumes"],
    ["calzado", "Calzado"],
    ["lentes", "Lentes"],
    ["ropa", "Ropa"],
    ["accesorios", "Accesorios"],
    ["otros", "Otros productos"]
  ];
  const customSections = [...new Map(visibleProducts
    .filter((product) => productAdminSection(product).startsWith("custom:"))
    .map((product) => [normalizeCategoryText(product.category), product.category])).entries()]
    .map(([key, title]) => [`custom:${key}`, title]);
  sectionOrder.push(...customSections);
  const sections = sectionOrder.map(([key, title]) => ({
    key,
    title,
    products: visibleProducts.filter((product) => productAdminSection(product) === key)
  })).filter((section) => section.products.length > 0);

  const renderProductCard = (product) => `
    <article class="admin-product-row" data-product-id="${escapeHtml(product.id)}">
      <div class="admin-product-image">${productImagePath(product) ? `<img src="${escapeHtml(productImagePath(product))}" alt="${escapeHtml(product.name)}" loading="lazy" />` : `<span aria-hidden="true">DM</span>`}</div>
      <div class="admin-product-info"><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.brand)} · ${escapeHtml(product.category)}</p><strong>${money(product.offerPrice)}</strong>${product.onSale ? `<span class="admin-sale-price"> Antes ${money(product.regularPrice)}</span>` : ""}</div>
      ${pendingDeleteId === product.id ? `
        <div class="admin-delete-confirm" role="group" aria-label="Confirmar eliminación de ${escapeHtml(product.name)}">
          <p>¿Eliminar este producto del catálogo?</p>
          <button class="admin-button admin-button-danger" type="button" data-action="confirm-delete" data-id="${escapeHtml(product.id)}">Confirmar eliminación</button>
          <button class="admin-button admin-button-quiet" type="button" data-action="cancel-delete" data-id="${escapeHtml(product.id)}">Cancelar</button>
        </div>` : `
        <div class="admin-row-actions"><button class="admin-button admin-button-quiet" type="button" data-action="edit" data-id="${escapeHtml(product.id)}">Editar</button><button class="admin-button admin-button-danger" type="button" data-action="delete" data-id="${escapeHtml(product.id)}">Eliminar</button></div>`}
    </article>`;

  productList.innerHTML = sections.map((section, index) => `
    <section class="admin-product-group" aria-labelledby="admin-product-group-${index}">
      <header class="admin-product-group-heading">
        <h3 id="admin-product-group-${index}">${escapeHtml(section.title)}</h3>
        <span>${section.products.length} ${section.products.length === 1 ? "producto" : "productos"}</span>
      </header>
      <div class="admin-product-group-grid">${section.products.map(renderProductCard).join("")}</div>
    </section>`).join("");
};

const openProductForm = (product = null, selectedCategory = "") => {
  editingId = product?.id ?? null;
  productForm.reset();
  $("#adminFormTitle").textContent = editingId ? "Editar producto" : "Agregar producto";
  $("#adminFormEyebrow").textContent = editingId ? `Editar · ${product.category}` : `Nuevo producto · ${product?.category || selectedCategory || "Catálogo"}`;
  $("#adminSaveProduct").textContent = editingId ? "Guardar cambios" : "Guardar producto";
  const fields = productForm.elements;
  activeCategory = product?.category ?? selectedCategory;
  categoryDrafts = activeCategory ? { [activeCategory]: { ...(product?.details ?? {}) } } : {};
  imageEntries.forEach((entry) => { if (entry.objectUrl) URL.revokeObjectURL(entry.objectUrl); });
  imageEntries = (product?.images ?? []).map((src) => ({ src: productImagePath(product, src), existing: true }));
  imageFiles.value = "";
  imageStatus.textContent = "";
  fields.name.value = product?.name ?? "";
  fields.brand.value = product?.brand ?? "";
  fields.category.value = product?.category ?? selectedCategory;
  $(".admin-category-edit-field").hidden = !editingId;
  $(".admin-category-static").hidden = Boolean(editingId);
  $("#adminCategoryStaticValue").textContent = fields.category.value;
  fields.regularPrice.value = product?.regularPrice ?? "";
  fields.offerPrice.value = product?.offerPrice ?? "";
  setSelectValue(fields.gender, product?.gender ?? "");
  setSelectValue(fields.stockStatus, product?.stockStatus ?? "En stock");
  fields.categoryDetails.value = JSON.stringify(product?.details ?? {});
  fields.sizes.value = product?.sizes?.join("\n") ?? "";
  fields.colors.value = product?.colors?.map((color) => `${color.name} | ${color.hex}`).join("\n") ?? "";
  renderPresentationChoices(product?.sizes ?? []);
  renderColorChoices(product?.colors ?? []);
  fields.description.value = product?.description ?? "";
  fields.features.value = product?.features?.join("\n") ?? "";
  fields.onSale.checked = product?.onSale ?? false;
  fields.isNew.checked = product?.isNew ?? false;
  fields.featured.checked = product?.featured ?? false;
  updateCategorySectionLabel(fields.category.value);
  renderCategoryFields(product?.details ?? {});
  renderImagePreviews();
  productDialog.showModal();
  fields.name.focus();
};

const updateCategorySectionLabel = (category) => {
  const labels = {
    Perfumes: ["Aroma y presentación", "Define la fragancia y los tamaños disponibles."],
    Calzado: ["Tallas y materiales", "Indica el tipo de calzado y sus variantes."],
    Lentes: ["Detalles de los lentes", "Especifica el estilo y los materiales."],
    Accesorios: ["Detalles del accesorio", "Indica el tipo y las variantes disponibles."],
    Ropa: ["Tallas y materiales", "Indica el tipo de prenda y sus variantes."],
    Otros: ["Detalles del producto", "Agrega el tipo y las variantes disponibles."]
  };
  const [title, description] = labels[category] || ["Detalles del producto", `Especifica los atributos de ${category.toLocaleLowerCase("es-MX") || "este producto"}.`];
  $("#adminAttributesTitle").textContent = title;
  $("#adminAttributesDescription").textContent = description;
  if (!editingId) $("#adminFormEyebrow").textContent = `Nuevo producto · ${category || "Catálogo"}`;
  else $("#adminFormEyebrow").textContent = `Editar · ${category}`;
};

const categoryIcon = (category) => {
  const key = normalizeCategoryText(category);
  if (key.includes("perfume") || key.includes("fragancia")) return "fa-spray-can-sparkles";
  if (key.includes("calzado") || key.includes("tenis") || key.includes("zapato")) return "fa-shoe-prints";
  if (key.includes("lente")) return "fa-glasses";
  if (key.includes("ropa") || key.includes("prenda")) return "fa-shirt";
  if (key.includes("accesorio")) return "fa-bag-shopping";
  return "fa-box-open";
};

const syncProductCategoryOptions = () => {
  const select = productForm.elements.category;
  const selected = select.value;
  select.innerHTML = `<option value="">Elige una sección</option>${categoryCache.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("")}`;
  select.value = selected;
};

const renderCategoryChoices = () => {
  categoryChoices.innerHTML = categoryCache.map((category) => `<button class="admin-category-choice" type="button" data-category-choice="${escapeHtml(category)}"><span class="admin-category-choice-icon"><i class="fa-solid ${categoryIcon(category)}" aria-hidden="true"></i></span><span>${escapeHtml(category)}</span><i class="fa-solid fa-arrow-right admin-category-choice-arrow" aria-hidden="true"></i></button>`).join("");
};

const openCategoryPicker = async () => {
  try {
    categoryCache = await adminFetch("/api/admin/categories");
    renderCategoryChoices();
    syncProductCategoryOptions();
    $("#adminNewCategoryForm").hidden = true;
    $("#adminShowNewCategory").hidden = false;
    categoryDialog.showModal();
    categoryDialog.querySelector("[data-category-choice]")?.focus();
  } catch (error) {
    showMessage(error.message, true);
  }
};

const transitionToProductForm = async (category) => {
  const picker = categoryDialog.querySelector(".admin-category-picker");
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && picker.animate) {
    await picker.animate([{ opacity: 1, transform: "translateY(0) scale(1)" }, { opacity: 0, transform: "translateY(8px) scale(.985)" }], { duration: 160, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }).finished.catch(() => {});
  }
  categoryDialog.close();
  openProductForm(null, category);
  renderCategoryFields({}, true);
  productForm.elements.name.focus();
};

const renderImagePreviews = (animate = false) => {
  imagePreview.innerHTML = imageEntries.map((entry, index) => `<article class="admin-image-item"><img src="${escapeHtml(entry.objectUrl || entry.src)}" alt="Fotografía ${index + 1}" /><span>Foto ${index + 1}${index === 0 ? " · Principal" : ""}</span><div><button class="admin-image-action" type="button" data-image-action="up" data-index="${index}" aria-label="Mover foto ${index + 1} antes" ${index === 0 ? "disabled" : ""}>↑</button><button class="admin-image-action" type="button" data-image-action="down" data-index="${index}" aria-label="Mover foto ${index + 1} después" ${index === imageEntries.length - 1 ? "disabled" : ""}>↓</button><button class="admin-image-action admin-image-remove" type="button" data-image-action="remove" data-index="${index}" aria-label="Quitar foto ${index + 1}">Quitar</button></div></article>`).join("");
  imagePreview.hidden = imageEntries.length === 0;
  if (animate && imageEntries.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) imagePreview.lastElementChild?.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 180, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
};

const lines = (value) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

const setSelectValue = (select, value) => {
  if (!value) { select.value = ""; return; }
  if (![...select.options].some((option) => option.value === value)) select.add(new Option(value, value));
  select.value = value;
};

const presentationOptionsByCategory = {
  Perfumes: ["30 ml", "50 ml", "75 ml", "100 ml", "125 ml", "150 ml", "200 ml", "250 ml"],
  Calzado: ["22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
  Ropa: ["XS", "S", "M", "L", "XL", "XXL"],
  Lentes: ["Unitalla"],
  Accesorios: ["Unitalla"],
  Otros: ["Unitalla"]
};
const colorOptions = [
  ["Negro", "#111827"], ["Blanco", "#FFFFFF"], ["Gris", "#6B7280"], ["Beige", "#D6C1A1"],
  ["Café", "#7C4A2D"], ["Rojo", "#C9342D"], ["Azul", "#2563EB"], ["Verde", "#347857"],
  ["Dorado", "#C5A059"], ["Plateado", "#BFC3C8"], ["Rosa", "#E76F90"], ["Morado", "#8054A6"]
];

const renderPresentationChoices = (selected = []) => {
  const group = $("#adminPresentationChoices [data-choice-group]");
  const category = productForm.elements.category.value;
  const values = [...new Set([...(presentationOptionsByCategory[category] || ["Unitalla"]), ...selected])];
  $("#adminPresentationChoices > span").textContent = category === "Perfumes" ? "Presentaciones" : category === "Calzado" || category === "Ropa" ? "Tallas" : "Variantes";
  $("#adminPresentationChoices .admin-field-help").textContent = category === "Perfumes" ? "Selecciona los tamaños disponibles." : "Selecciona una o varias opciones disponibles.";
  group.innerHTML = values.map((value) => `<button type="button" class="admin-choice-chip" data-presentation="${escapeHtml(value)}" aria-pressed="${selected.includes(value)}">${escapeHtml(value)}</button>`).join("");
  group.querySelectorAll("[data-presentation]").forEach((button) => button.addEventListener("click", () => {
    button.setAttribute("aria-pressed", String(button.getAttribute("aria-pressed") !== "true"));
    productForm.elements.sizes.value = [...group.querySelectorAll('[aria-pressed="true"]')].map((item) => item.dataset.presentation).join("\n");
  }));
  productForm.elements.sizes.value = selected.join("\n");
};

const renderColorChoices = (selected = []) => {
  const group = $("#adminColorChoices [data-choice-group]");
  const customSlots = $("#adminCustomColorSlots");
  const isBuiltIn = (color) => colorOptions.some(([, hex]) => hex.toLowerCase() === String(color?.hex).toLowerCase());
  const numberedCustomColors = selected.filter((color) => color?.hex && /^Personalizado\s+\d+$/i.test(color.name || ""));
  const legacyCustomColors = selected.filter((color) => color?.hex && color.name === "Personalizado");
  const otherCustomColors = selected.filter((color) => color?.hex && !isBuiltIn(color) && !/^Personalizado(?:\s+\d+)?$/i.test(color.name || ""));
  // Collapse accidental legacy swatches into their most recent value. Numbered entries are explicit + clicks.
  const customColors = [...otherCustomColors, ...numberedCustomColors, ...(!numberedCustomColors.length && !otherCustomColors.length ? legacyCustomColors.slice(-1) : [])];
  const uniqueCustomColors = [...new Map(customColors.map((color) => [String(color.hex).toLowerCase(), color])).values()];
  const customHexes = new Set(uniqueCustomColors.map((color) => String(color.hex).toLowerCase()));
  const builtInColors = selected.filter((color) => color?.hex && isBuiltIn(color) && !customHexes.has(String(color.hex).toLowerCase()) && !/^Personalizado(?:\s+\d+)?$/i.test(color.name || ""));
  const selectedBuiltInHexes = new Set(builtInColors.map((color) => String(color.hex).toLowerCase()));
  group.innerHTML = colorOptions.map(([name, hex]) => {
    const active = selectedBuiltInHexes.has(hex.toLowerCase());
    return `<button type="button" class="admin-color-swatch${active ? " is-selected" : ""}" data-color-name="${escapeHtml(name)}" data-color-hex="${escapeHtml(hex)}" aria-label="${escapeHtml(name)}" aria-pressed="${active}"><span style="--swatch-color:${escapeHtml(hex)}"></span><small>${escapeHtml(name)}</small></button>`;
  }).join("");
  customSlots.innerHTML = "";
  let nextCustomId = uniqueCustomColors.reduce((highest, color) => Math.max(highest, Number(color.name.match(/\d+/)?.[0] || 0)), 0) + 1;
  let slotsToRender = uniqueCustomColors.map((color) => ({ name: color.name === "Personalizado" ? "Personalizado 1" : color.name, hex: color.hex, selected: true }));
  if (!slotsToRender.length) slotsToRender = [{ name: "Personalizado 1", hex: "#6b7280", selected: false }];
  const sync = () => {
    const selectedColors = [...group.querySelectorAll('[aria-pressed="true"]')];
    const customSelections = [...customSlots.querySelectorAll('[aria-pressed="true"]')];
    const colors = [...new Map([...selectedColors, ...customSelections].map((button) => [button.dataset.colorHex.toLowerCase(), `${button.dataset.colorName} | ${button.dataset.colorHex}`])).values()];
    productForm.elements.colors.value = colors.join("\n");
  };
  const bindColorToggle = (button, allSwatches = group) => button.addEventListener("click", () => {
    button.classList.toggle("is-selected");
    button.setAttribute("aria-pressed", String(button.classList.contains("is-selected")));
    if (button.classList.contains("is-selected")) allSwatches.querySelectorAll(`[data-color-hex="${button.dataset.colorHex}"]`).forEach((other) => {
      if (other !== button) { other.classList.remove("is-selected"); other.setAttribute("aria-pressed", "false"); }
    });
    sync();
  });
  group.querySelectorAll("[data-color-hex]").forEach(bindColorToggle);
  const addCustomSlot = ({ name, hex, selected: isSelected } = {}) => {
    const slotName = name || `Personalizado ${nextCustomId++}`;
    nextCustomId = Math.max(nextCustomId, Number(slotName.match(/\d+/)?.[0] || 0) + 1);
    const slotHex = /^#[\da-f]{6}$/i.test(hex || "") ? hex : "#6b7280";
    const slot = document.createElement("div");
    slot.className = "admin-custom-color-slot";
    slot.innerHTML = `<button type="button" class="admin-color-swatch${isSelected ? " is-selected" : ""}" data-custom-color="true" data-color-name="${escapeHtml(slotName)}" data-color-hex="${slotHex}" aria-label="Color ${escapeHtml(slotName)}: ${slotHex}" aria-pressed="${Boolean(isSelected)}"><span style="--swatch-color:${slotHex}"></span></button><input type="color" value="${slotHex}" aria-label="Elegir tono del color ${escapeHtml(slotName)}" /><button type="button" class="admin-custom-color-remove" aria-label="Quitar color ${escapeHtml(slotName)}">×</button>`;
    const swatch = slot.querySelector(".admin-color-swatch");
    const picker = slot.querySelector('input[type="color"]');
    bindColorToggle(swatch, customSlots);
    picker.addEventListener("input", () => {
      const color = picker.value;
      swatch.dataset.colorHex = color;
      swatch.setAttribute("aria-label", `${slotName} ${color}`);
      swatch.querySelector("span").style.setProperty("--swatch-color", color);
      swatch.classList.add("is-selected");
      swatch.setAttribute("aria-pressed", "true");
      group.querySelectorAll(`[data-color-hex="${color}"]`).forEach((other) => { other.classList.remove("is-selected"); other.setAttribute("aria-pressed", "false"); });
      customSlots.querySelectorAll(`[data-color-hex="${color}"]`).forEach((other) => { if (other !== swatch) { other.classList.remove("is-selected"); other.setAttribute("aria-pressed", "false"); } });
      sync();
    });
    slot.querySelector(".admin-custom-color-remove").addEventListener("click", () => { slot.remove(); sync(); });
    customSlots.append(slot);
  };
  slotsToRender.forEach(addCustomSlot);
  $("#adminAddCustomColor").onclick = () => {
    const name = `Personalizado ${nextCustomId++}`;
    addCustomSlot({ name, hex: "#6b7280", selected: false });
    customSlots.lastElementChild?.querySelector('input[type="color"]')?.focus();
  };
  sync();
};

const perfumeFamilies = ["Cítrica", "Floral", "Amaderada", "Aromática", "Acuática", "Oriental / ambarada", "Gourmand", "Chipre"];
const recommendPerfumeFamily = (name) => {
  const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const rules = [
    ["Cítrica", /citr|citrus|bergamot|bergamota|limon|lemon|mandarin|mandarina|orange|naranja|grapefruit|toronja|light blue/],
    ["Floral", /floral|rose|rosa|jasmine|jazmin|peony|peonia|tuberose|gardenia/],
    ["Amaderada", /wood|woods|oud|madera|sandalwood|santalo|cedar|cedro|vetiver|patchouli|pachuli/],
    ["Acuática", /aqua|acqua|marine|ocean|oceano|aquatic|water|gio/],
    ["Gourmand", /vanilla|vainilla|caramel|caramelo|chocolate|coffee|cafe|coco|tonka|la vie est belle/],
    ["Aromática", /sauvage|bleu|eros|aromatic|aromatique|lavender|lavanda|fougere|y eau/],
    ["Chipre", /chypre|chipre|moss|musgo/],
    ["Oriental / ambarada", /amber|ambar|oriental|spice|especia|incense|incienso|212 vip|one million|good girl/]
  ];
  return rules.find(([, pattern]) => pattern.test(normalized))?.[0] || "";
};

const categoryOptions = {
  Perfumes: { types: ["Parfum", "Eau de parfum", "Eau de toilette", "Eau de cologne", "Body mist"] },
  Ropa: { types: ["Camisa", "Playera", "Pantalón", "Vestido", "Sudadera", "Chamarra", "Otra prenda"] },
  Calzado: { types: ["Tenis", "Zapatos", "Botas", "Sandalias", "Otro calzado"] },
  Accesorios: { types: ["Bolsa", "Lentes", "Cartera", "Reloj", "Cinturón", "Otro accesorio"] }
};

const renderCategoryFields = (details = {}, animate = false) => {
  const category = productForm.elements.category.value;
  const config = categoryOptions[category] || { types: [category === "Lentes" ? "Lentes" : category === "Otros" ? "Otro" : category] };
  const familyOptions = [...new Set([...perfumeFamilies, details.fragranceFamily].filter(Boolean))];
  const typeOptions = config.types.map((type) => `<option${(details.type === type || details.concentration === type) ? " selected" : ""}>${escapeHtml(type.trim())}</option>`).join("");
  const perfumeFields = category === "Perfumes" ? `
    <label class="admin-field">Concentración<select class="admin-input" name="concentration"><option value="">Selecciona una opción</option>${config.types.map((value) => `<option${(details.concentration === value || details.type === value) ? " selected" : ""}>${value}</option>`).join("")}</select><span class="admin-field-help">Parfum, Eau de parfum, Eau de toilette o Body mist.</span></label>
    <div class="admin-field admin-field-wide"><span>Familia olfativa</span><div class="admin-family-choices" role="group" aria-label="Familia olfativa">${familyOptions.map((family) => `<button type="button" class="admin-choice-chip" data-family="${escapeHtml(family)}" aria-pressed="${details.fragranceFamily === family}">${escapeHtml(family)}${details.fragranceFamily === family ? ' <span class="admin-family-selected">Elegida</span>' : ""}</button>`).join("")}</div><p class="admin-family-recommendation" id="adminFamilyRecommendation" aria-live="polite"></p><input type="hidden" name="fragranceFamily" value="${escapeHtml(details.fragranceFamily || "")}" /></div>` : "";
  const sharedFields = category === "Perfumes" ? "" : `<label class="admin-field">Material<input class="admin-input" name="material" maxlength="100" value="${escapeHtml(details.material || "")}" placeholder="Algodón, piel, metal…" /></label>`;
  const typeLabel = category === "Ropa" ? "Tipo de prenda" : category === "Calzado" ? "Tipo de calzado" : category === "Accesorios" ? "Tipo de accesorio" : "Tipo de producto";
  const typeField = category === "Perfumes" ? "" : `<label class="admin-field">${typeLabel}<select class="admin-input" name="productType"><option value="">Selecciona una opción</option>${typeOptions}</select></label>`;
  categoryFields.innerHTML = `<div class="admin-category-heading"><strong>Detalles de ${category.toLocaleLowerCase("es-MX")}</strong></div><div class="admin-category-grid">${typeField}${perfumeFields}${sharedFields}</div>`;
  categoryFields.hidden = false;
  if (animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) categoryFields.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 180, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
  categoryFields.dataset.initialized = "true";
  productForm.elements.categoryDetails.value = JSON.stringify(details);
  const updateCategoryDraft = () => {
    const next = Object.fromEntries([...categoryFields.querySelectorAll("input,select")].map((field) => [field.name, field.value]));
    const selectedConcentration = next.concentration || "";
    const savedDetails = { type: category === "Perfumes" ? selectedConcentration : (next.productType || ""), material: next.material || "", fragranceFamily: next.fragranceFamily || "", concentration: selectedConcentration };
    productForm.elements.categoryDetails.value = JSON.stringify(savedDetails);
    categoryDrafts[category] = savedDetails;
  };
  categoryFields.querySelectorAll("input,select").forEach((control) => {
    control.addEventListener("input", updateCategoryDraft);
    control.addEventListener("change", updateCategoryDraft);
  });
  productForm.elements.name.oninput = null;
  const familyInput = categoryFields.querySelector('[name="fragranceFamily"]');
  if (familyInput) {
    const recommendation = $("#adminFamilyRecommendation");
    const paintRecommendation = () => {
      const suggested = recommendPerfumeFamily(productForm.elements.name.value);
      recommendation.textContent = suggested ? `Sugerencia por el nombre: ${suggested}. Confirma o elige otra familia.` : "Escribe el nombre para recibir una sugerencia; puedes elegir cualquier familia.";
      categoryFields.querySelectorAll("[data-family]").forEach((button) => {
        button.classList.toggle("is-recommended", button.dataset.family === suggested);
        const selected = button.dataset.family === familyInput.value;
        button.setAttribute("aria-pressed", String(selected));
        button.querySelector(".admin-family-selected")?.remove();
        if (selected) button.insertAdjacentHTML("beforeend", ' <span class="admin-family-selected">Elegida</span>');
      });
    };
    paintRecommendation();
    categoryFields.querySelectorAll("[data-family]").forEach((button) => button.addEventListener("click", () => {
      familyInput.value = button.dataset.family;
      updateCategoryDraft();
      paintRecommendation();
    }));
    productForm.elements.name.oninput = paintRecommendation;
  }
};

const uploadImage = async (file) => adminFetch("/api/admin/uploads/product-image", {
  method: "POST",
  body: file,
  headers: { "Content-Type": file.type }
});

const formProduct = () => {
  const fields = productForm.elements;
  const categoryDetails = JSON.parse(fields.categoryDetails.value || "{}");
  return {
    name: fields.name.value,
    brand: fields.brand.value,
    category: fields.category.value,
    regularPrice: Number(fields.regularPrice.value),
    offerPrice: Number(fields.offerPrice.value),
    gender: fields.gender.value,
    stockStatus: fields.stockStatus.value,
    images: imageEntries.filter((entry) => entry.src).map((entry) => entry.src),
    sizes: lines(fields.sizes.value),
    colors: lines(fields.colors.value).map((line) => { const [name, hex] = line.split("|").map((part) => part.trim()); return { name, hex }; }),
    details: categoryDetails,
    description: fields.description.value,
    features: lines(fields.features.value),
    onSale: fields.onSale.checked,
    isNew: fields.isNew.checked,
    featured: fields.featured.checked
  };
};

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = loginForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  showMessage("Verificando acceso…");
  try {
    await adminFetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password: $("#adminPassword").value })
    });
    $("#adminPassword").value = "";
    showMessage("");
    await showWorkspace();
  } catch (error) {
    showMessage(error.message, true);
    $("#adminPassword").select();
  } finally {
    submitButton.disabled = false;
  }
});

$("#adminAddProduct").addEventListener("click", openCategoryPicker);
$("#adminNavAdd").addEventListener("click", openCategoryPicker);
$("#adminShowNewCategory").addEventListener("click", () => {
  $("#adminNewCategoryForm").hidden = false;
  $("#adminShowNewCategory").hidden = true;
  $("#adminNewCategoryName").focus();
});
$("#adminCancelNewCategory").addEventListener("click", () => {
  $("#adminNewCategoryForm").reset();
  $("#adminNewCategoryForm").hidden = true;
  $("#adminShowNewCategory").hidden = false;
  $("#adminShowNewCategory").focus();
});
categoryChoices.addEventListener("click", (event) => {
  const choice = event.target.closest("[data-category-choice]");
  if (choice) transitionToProductForm(choice.dataset.categoryChoice);
});
$("#adminNewCategoryForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = $("#adminSaveNewCategory");
  button.disabled = true;
  try {
    const result = await adminFetch("/api/admin/categories", { method: "POST", body: JSON.stringify({ name: $("#adminNewCategoryName").value }) });
    categoryCache = result.categories;
    syncProductCategoryOptions();
    await transitionToProductForm(result.category);
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    button.disabled = false;
  }
});
$("#adminProductsLink").addEventListener("click", () => { $("#adminWorkspace").scrollIntoView({ behavior: "smooth" }); });
productForm.elements.category.addEventListener("change", () => {
  if (activeCategory) categoryDrafts[activeCategory] = JSON.parse(productForm.elements.categoryDetails.value || "{}");
  activeCategory = productForm.elements.category.value;
  updateCategorySectionLabel(activeCategory);
  renderCategoryFields(categoryDrafts[activeCategory] || {}, true);
  renderPresentationChoices(lines(productForm.elements.sizes.value));
});
imageFiles.addEventListener("change", () => {
  const selected = [...imageFiles.files];
  const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
  const issue = selected.find((file) => !allowed.has(file.type) || file.size > 8 * 1024 * 1024);
  if (issue) {
    imageStatus.textContent = issue.size > 8 * 1024 * 1024 ? "Cada imagen debe pesar menos de 8 MB." : "Usa imágenes JPG, PNG, WebP o GIF.";
    imageStatus.classList.add("is-error");
    imageFiles.value = "";
    return;
  }
  if (imageEntries.length + selected.length > 12) {
    imageStatus.textContent = "Puedes agregar hasta 12 fotografías por producto.";
    imageStatus.classList.add("is-error");
    imageFiles.value = "";
    return;
  }
  imageStatus.classList.remove("is-error");
  imageStatus.textContent = selected.length ? `${selected.length} ${selected.length === 1 ? "imagen seleccionada" : "imágenes seleccionadas"}. Se subirán al guardar.` : "";
  imageEntries.push(...selected.map((file) => ({ file, objectUrl: URL.createObjectURL(file) })));
  imageFiles.value = "";
  renderImagePreviews(true);
});
imagePreview.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-image-action]");
  if (!button) return;
  const index = Number(button.dataset.index);
  const action = button.dataset.imageAction;
  if (action === "remove") {
    const [removed] = imageEntries.splice(index, 1);
    if (removed.objectUrl) URL.revokeObjectURL(removed.objectUrl);
  } else {
    const nextIndex = action === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= imageEntries.length) return;
    [imageEntries[index], imageEntries[nextIndex]] = [imageEntries[nextIndex], imageEntries[index]];
  }
  imageStatus.textContent = `${imageEntries.length} ${imageEntries.length === 1 ? "fotografía" : "fotografías"} en el producto.`;
  renderImagePreviews();
});
const uploadControl = $(".admin-upload-control");
uploadControl.addEventListener("dragover", (event) => { event.preventDefault(); uploadControl.classList.add("is-dragging"); });
uploadControl.addEventListener("dragleave", () => uploadControl.classList.remove("is-dragging"));
uploadControl.addEventListener("drop", (event) => {
  event.preventDefault();
  uploadControl.classList.remove("is-dragging");
  const transfer = new DataTransfer();
  [...event.dataTransfer.files].forEach((file) => transfer.items.add(file));
  imageFiles.files = transfer.files;
  imageFiles.dispatchEvent(new Event("change", { bubbles: true }));
});
$("#adminSearch").addEventListener("input", (event) => { pendingDeleteId = null; renderProducts(event.target.value); });
$("#adminClose").addEventListener("click", closeAdmin);
$("#adminFormClose").addEventListener("click", () => productDialog.close());
$("#adminCancelForm").addEventListener("click", () => productDialog.close());
productDialog.addEventListener("close", () => {
  imageEntries.forEach((entry) => { if (entry.objectUrl) URL.revokeObjectURL(entry.objectUrl); });
  imageEntries = [];
  renderImagePreviews();
  imageStatus.textContent = "";
});

productList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const product = productCache.find((item) => item.id === button.dataset.id);
  if (!product) return;
  if (button.dataset.action === "edit") {
    openProductForm(product);
    return;
  }
  if (button.dataset.action === "delete") {
    pendingDeleteId = product.id;
    showMessage("");
    renderProducts($("#adminSearch").value);
    productList.querySelector(`[data-product-id="${CSS.escape(product.id)}"] [data-action="confirm-delete"]`)?.focus();
    return;
  }
  if (button.dataset.action === "cancel-delete") {
    pendingDeleteId = null;
    renderProducts($("#adminSearch").value);
    productList.querySelector(`[data-product-id="${CSS.escape(product.id)}"] [data-action="delete"]`)?.focus();
    return;
  }
  if (button.dataset.action === "confirm-delete" && pendingDeleteId === product.id) {
    button.disabled = true;
    const cancelButton = productList.querySelector(`[data-product-id="${CSS.escape(product.id)}"] [data-action="cancel-delete"]`);
    if (cancelButton) cancelButton.disabled = true;
    try {
      await adminFetch(`/api/admin/products/${encodeURIComponent(product.id)}`, { method: "DELETE" });
      pendingDeleteId = null;
      await refreshProducts();
      window.dispatchEvent(new CustomEvent("catalog:updated"));
      showMessage("Producto eliminado.");
    } catch (error) {
      showMessage(error.message, true);
      button.disabled = false;
      if (cancelButton) cancelButton.disabled = false;
    }
  }
});

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!productForm.reportValidity()) return;
  const submitButton = $("#adminSaveProduct");
  submitButton.disabled = true;
  showMessage("");
  const uploadedPaths = [];
  let productSaved = false;
  try {
    const localImages = imageEntries.filter((entry) => entry.file);
    for (let index = 0; index < localImages.length; index += 1) {
      imageStatus.textContent = `Subiendo fotografía ${index + 1} de ${localImages.length}…`;
      const uploaded = await uploadImage(localImages[index].file);
      localImages[index].src = uploaded.path;
      uploadedPaths.push(uploaded.path);
    }
    const endpoint = editingId ? `/api/admin/products/${encodeURIComponent(editingId)}` : "/api/admin/products";
    await adminFetch(endpoint, { method: editingId ? "PUT" : "POST", body: JSON.stringify(formProduct()) });
    productSaved = true;
    imageEntries.forEach((entry) => { if (entry.objectUrl) URL.revokeObjectURL(entry.objectUrl); delete entry.objectUrl; entry.file = null; });
    productDialog.close();
    await refreshProducts();
    window.dispatchEvent(new CustomEvent("catalog:updated"));
    showMessage(editingId ? "Cambios guardados." : "Producto agregado al catálogo.");
  } catch (error) {
    if (!productSaved) {
      await Promise.allSettled(uploadedPaths.map((imagePath) => adminFetch(`/api/admin/uploads/product-image?path=${encodeURIComponent(imagePath)}`, { method: "DELETE" })));
      imageEntries.forEach((entry) => { if (uploadedPaths.includes(entry.src)) entry.src = ""; });
      renderImagePreviews();
      showMessage(error.message, true);
    } else {
      showMessage("El producto se guardó, pero no se pudo actualizar la lista. Recarga el panel.", true);
    }
  } finally {
    submitButton.disabled = false;
  }
});

$("#adminLogout").addEventListener("click", async () => {
  try {
    await adminFetch("/api/admin/logout", { method: "POST", body: "{}" });
    loginForm.hidden = false;
    adminWorkspace.hidden = true;
    adminNav.hidden = true;
    $("#adminLogout").hidden = true;
    showMessage("Sesión cerrada.");
    $("#adminPassword").focus();
  } catch (error) {
    showMessage(error.message, true);
  }
});

$("#adminProductDialog").addEventListener("click", (event) => {
  if (event.target === productDialog) productDialog.close();
});
categoryDialog.addEventListener("click", (event) => {
  if (event.target === categoryDialog) categoryDialog.close();
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey === ADMIN_COMMAND.ctrlKey && event.altKey === ADMIN_COMMAND.altKey &&
      event.shiftKey === ADMIN_COMMAND.shiftKey && event.key.toLowerCase() === ADMIN_COMMAND.key) {
    event.preventDefault();
    openAdmin();
    return;
  }
  if (!adminOverlay.hidden && event.key === "Escape" && !productDialog.open && !categoryDialog.open) closeAdmin();
});

adminOverlay.addEventListener("click", (event) => {
  if (event.target === adminOverlay) closeAdmin();
});

if (window.location.pathname.replace(/\/+$/, "") === "/admin") openAdmin();

function installReferenceReveals(root = document) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const animations = new Map();
  const elements = [...root.querySelectorAll('[data-reveal]')];
  const finish = (element) => {
    element.dataset.revealPlayed = "true";
    animations.get(element)?.cancel();
    animations.delete(element);
  };
  const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      observer.unobserve(element);
      element.dataset.revealPlayed = "true";
      if (reduced.matches || document.visibilityState === "hidden" || entry.boundingClientRect.bottom <= 0) finish(element);
      else animations.get(element)?.play();
    }
  }, { threshold: 0, rootMargin: "0px 0px 96px 0px" }) : undefined;
  const stop = () => { observer?.disconnect(); elements.forEach(finish); };
  const onPreference = () => { if (reduced.matches) stop(); };
  reduced.addEventListener("change", onPreference);
  for (const element of elements) {
    if (element.dataset.revealPlayed === "true") continue;
    if (element.closest("[hidden]")) continue;
    const rect = element.getBoundingClientRect();
    if (reduced.matches || !observer || !element.animate || rect.top < innerHeight || document.visibilityState === "hidden") { finish(element); continue; }
    const transform = element.dataset.reveal === "media" ? "scale(1.025)" : element.dataset.reveal === "slide" ? "translateX(-12px)" : "translateY(12px)";
    const animation = element.animate([{ opacity: 0, transform }, { opacity: 1, transform: "none" }], { duration: 600, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" });
    animation.pause();
    animation.onfinish = () => finish(element);
    animations.set(element, animation);
    observer.observe(element);
  }
  return () => { stop(); reduced.removeEventListener("change", onPreference); };
}

