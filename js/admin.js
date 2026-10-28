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

    <dialog class="admin-product-dialog" id="adminProductDialog" aria-labelledby="adminFormTitle">
      <form class="admin-product-form" id="adminProductForm">
        <header class="admin-form-header">
          <div><p class="admin-eyebrow">Detalle del producto</p><h3 id="adminFormTitle">Agregar producto</h3></div>
          <button class="admin-close admin-form-close" type="button" id="adminFormClose" aria-label="Cerrar formulario">×</button>
        </header>
        <div class="admin-form-grid">
          <div class="admin-form-section-label admin-field-wide"><h4>Información del producto</h4><p>Estos datos identifican el artículo en la tarjeta y en su ficha de detalle.</p></div>
          <label class="admin-field admin-field-wide">Nombre del producto<input class="admin-input" name="name" required maxlength="160" placeholder="Ej. Sauvage Extrait" /></label>
          <label class="admin-field">Marca<input class="admin-input" name="brand" required maxlength="100" /></label>
          <label class="admin-field">Categor?a<select class="admin-input" name="category" required><option value="">Elige una categor?a</option><option>Perfumes</option><option>Ropa</option><option>Calzado</option><option>Accesorios</option></select></label>
          <div class="admin-form-section-label admin-field-wide"><h4>Precio y disponibilidad</h4><p>El precio de venta se muestra en la tienda; al activar “En oferta” también aparece el precio regular.</p></div>
          <label class="admin-field">Precio regular (MXN)<input class="admin-input" name="regularPrice" type="number" min="1" step="0.01" required /></label>
          <label class="admin-field">Precio de venta (MXN)<input class="admin-input" name="offerPrice" type="number" min="1" step="0.01" required /></label>
          <label class="admin-field">Público o género<input class="admin-input" name="gender" maxlength="40" placeholder="Unisex, Mujer, Hombre…" /></label>
          <label class="admin-field">Disponibilidad<input class="admin-input" name="stockStatus" list="adminStockOptions" maxlength="80" placeholder="En stock" /><datalist id="adminStockOptions"><option value="En stock"><option value="Últimas unidades"><option value="Agotado"></datalist><span class="admin-field-help">Se muestra en los detalles. Escribe “Agotado” o “Sin stock” para indicar que no está disponible.</span></label>
          <div class="admin-form-section-label admin-field-wide"><h4>Fotografías y variantes</h4><p>La primera foto será la portada y la imagen desde la que se abre el detalle.</p></div>
          <div class="admin-field admin-field-wide admin-upload-field"><span class="admin-field-label">Fotograf&#237;as del producto</span><label class="admin-upload-control" for="adminImageFiles"><span class="admin-upload-action">Seleccionar fotograf&#237;as</span><span>o arr&#225;stralas aqu&#237;</span><input id="adminImageFiles" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple /></label><span class="admin-field-help" id="adminImageHelp">Hasta 12 im&#225;genes JPG, PNG, WebP o GIF, m&#225;ximo 8 MB cada una. Se guardan en <code>product-images</code> dentro de <code>DATA_DIR</code> (por defecto, <code>data/product-images</code>).</span><p class="admin-image-status" id="adminImageStatus" role="status" aria-live="polite"></p><div class="admin-image-preview" id="adminImagePreview" aria-live="polite"></div></div>
          <div class="admin-field admin-field-wide" id="adminCategoryFields" hidden></div>
          <input type="hidden" name="categoryDetails" value="{}" />
          <label class="admin-field">Tallas o presentaciones (una por línea)<textarea class="admin-input admin-textarea" name="sizes" rows="3" placeholder="100 ml&#10;150 ml"></textarea><span class="admin-field-help">Se convierten en opciones seleccionables dentro de la ficha.</span></label>
          <label class="admin-field">Colores (Nombre | #HEX, uno por línea)<textarea class="admin-input admin-textarea" name="colors" rows="3" placeholder="Negro | #111827"></textarea></label>
          <div class="admin-form-section-label admin-field-wide"><h4>Información de detalle</h4><p>Describe lo que el cliente necesita saber antes de pedir o agregar a su bolsa.</p></div>
          <label class="admin-field admin-field-wide">Descripción<textarea class="admin-input admin-textarea" name="description" rows="3" maxlength="2000" placeholder="Describe el producto con información útil y concreta."></textarea></label>
          <label class="admin-field admin-field-wide">Características (una por línea)<textarea class="admin-input admin-textarea" name="features" rows="3" maxlength="3000" placeholder="Contenido: 100 ml&#10;Acabado: mate"></textarea></label>
        </div>
        <fieldset class="admin-flags"><legend>Mostrar en el catálogo</legend>
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
const productForm = $("#adminProductForm");
const adminNav = $(".admin-nav");
const imagePreview = $("#adminImagePreview");
const imageFiles = $("#adminImageFiles");
const imageStatus = $("#adminImageStatus");
const categoryFields = $("#adminCategoryFields");
let productCache = [];
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
  renderProducts($("#adminSearch").value);
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
  productList.innerHTML = visibleProducts.map((product) => `
    <article class="admin-product-row" data-product-id="${escapeHtml(product.id)}">
      <div class="admin-product-image">${productImagePath(product) ? `<img src="${escapeHtml(productImagePath(product))}" alt="${escapeHtml(product.name)}" loading="lazy" />` : `<span aria-hidden="true">DM</span>`}</div>
      <div class="admin-product-info"><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.brand)} · ${escapeHtml(product.category)}</p><strong>${money(product.offerPrice)}</strong>${product.onSale ? `<span class="admin-sale-price"> Antes ${money(product.regularPrice)}</span>` : ""}</div>
      <div class="admin-row-actions"><button class="admin-button admin-button-quiet" type="button" data-action="edit" data-id="${escapeHtml(product.id)}">Editar</button><button class="admin-button admin-button-danger" type="button" data-action="delete" data-id="${escapeHtml(product.id)}">Eliminar</button></div>
    </article>`).join("");
};

const openProductForm = (product = null) => {
  editingId = product?.id ?? null;
  productForm.reset();
  $("#adminFormTitle").textContent = editingId ? "Editar producto" : "Agregar producto";
  $("#adminSaveProduct").textContent = editingId ? "Guardar cambios" : "Guardar producto";
  const fields = productForm.elements;
  activeCategory = product?.category ?? "";
  categoryDrafts = activeCategory ? { [activeCategory]: { ...(product?.details ?? {}) } } : {};
  imageEntries.forEach((entry) => { if (entry.objectUrl) URL.revokeObjectURL(entry.objectUrl); });
  imageEntries = (product?.images ?? []).map((src) => ({ src: productImagePath(product, src), existing: true }));
  imageFiles.value = "";
  imageStatus.textContent = "";
  fields.name.value = product?.name ?? "";
  fields.brand.value = product?.brand ?? "";
  fields.category.value = product?.category ?? "";
  fields.regularPrice.value = product?.regularPrice ?? "";
  fields.offerPrice.value = product?.offerPrice ?? "";
  fields.gender.value = product?.gender ?? "";
  fields.stockStatus.value = product?.stockStatus ?? "En stock";
  fields.categoryDetails.value = JSON.stringify(product?.details ?? {});
  fields.sizes.value = product?.sizes?.join("\n") ?? "";
  fields.colors.value = product?.colors?.map((color) => `${color.name} | ${color.hex}`).join("\n") ?? "";
  fields.description.value = product?.description ?? "";
  fields.features.value = product?.features?.join("\n") ?? "";
  fields.onSale.checked = product?.onSale ?? false;
  fields.isNew.checked = product?.isNew ?? false;
  fields.featured.checked = product?.featured ?? false;
  renderCategoryFields(product?.details ?? {});
  renderImagePreviews();
  productDialog.showModal();
  fields.name.focus();
};

const renderImagePreviews = (animate = false) => {
  imagePreview.innerHTML = imageEntries.map((entry, index) => `<article class="admin-image-item"><img src="${escapeHtml(entry.objectUrl || entry.src)}" alt="Fotografía ${index + 1}" /><span>Foto ${index + 1}${index === 0 ? " · Principal" : ""}</span><div><button class="admin-image-action" type="button" data-image-action="up" data-index="${index}" aria-label="Mover foto ${index + 1} antes" ${index === 0 ? "disabled" : ""}>↑</button><button class="admin-image-action" type="button" data-image-action="down" data-index="${index}" aria-label="Mover foto ${index + 1} después" ${index === imageEntries.length - 1 ? "disabled" : ""}>↓</button><button class="admin-image-action admin-image-remove" type="button" data-image-action="remove" data-index="${index}" aria-label="Quitar foto ${index + 1}">Quitar</button></div></article>`).join("");
  imagePreview.hidden = imageEntries.length === 0;
  if (animate && imageEntries.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) imagePreview.lastElementChild?.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 180, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
};

const lines = (value) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

const categoryOptions = {
  Perfumes: { types: ["Perfume", "Eau de parfum", "Eau de toilette", "Body mist"] },
  Ropa: { types: ["Camisa", "Playera", "Pantalón", "Vestido", "Sudadera", "Chamarra", "Otra prenda"] },
  Calzado: { types: ["Tenis", "Zapatos", "Botas", "Sandalias", "Otro calzado"] },
  Accesorios: { types: ["Bolsa", "Lentes", "Cartera", "Reloj", "Cinturón", "Otro accesorio"] }
};

const renderCategoryFields = (details = {}, animate = false) => {
  const category = productForm.elements.category.value;
  const config = categoryOptions[category];
  if (!config) {
    categoryFields.hidden = true;
    categoryFields.innerHTML = "";
    return;
  }
  const typeOptions = config.types.map((type) => `<option${details.type === type ? " selected" : ""}>${escapeHtml(type.trim())}</option>`).join("");
  const perfumeFields = category === "Perfumes" ? `
    <label class="admin-field">Familia olfativa<input class="admin-input" name="fragranceFamily" maxlength="80" value="${escapeHtml(details.fragranceFamily || "")}" placeholder="Floral, amaderada, cítrica…" /></label>
    <label class="admin-field">Concentración<select class="admin-input" name="concentration"><option value="">Selecciona una opción</option>${["Parfum", "Eau de parfum", "Eau de toilette", "Eau de cologne", "Body mist"].map((value) => `<option${details.concentration === value ? " selected" : ""}>${value}</option>`).join("")}</select></label>` : "";
  const sharedFields = category === "Perfumes" ? "" : `<label class="admin-field">Material<input class="admin-input" name="material" maxlength="100" value="${escapeHtml(details.material || "")}" placeholder="Algodón, piel, metal…" /></label>`;
  categoryFields.innerHTML = `<div class="admin-category-heading"><strong>Detalles de ${category.toLocaleLowerCase("es-MX")}</strong></div><div class="admin-category-grid"><label class="admin-field">${category === "Perfumes" ? "Tipo de fragancia" : category === "Ropa" ? "Tipo de prenda" : category === "Calzado" ? "Tipo de calzado" : "Tipo de accesorio"}<select class="admin-input" name="productType"><option value="">Selecciona una opción</option>${typeOptions}</select></label>${perfumeFields}${sharedFields}</div>`;
  categoryFields.hidden = false;
  if (animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) categoryFields.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 180, easing: "cubic-bezier(0.23, 1, 0.32, 1)" });
  categoryFields.dataset.initialized = "true";
  productForm.elements.categoryDetails.value = JSON.stringify(details);
  const updateCategoryDraft = () => {
    const next = Object.fromEntries([...categoryFields.querySelectorAll("input,select")].map((field) => [field.name, field.value]));
    const savedDetails = { type: next.productType || "", material: next.material || "", fragranceFamily: next.fragranceFamily || "", concentration: next.concentration || "" };
    productForm.elements.categoryDetails.value = JSON.stringify(savedDetails);
    categoryDrafts[category] = savedDetails;
  };
  categoryFields.querySelectorAll("input,select").forEach((control) => {
    control.addEventListener("input", updateCategoryDraft);
    control.addEventListener("change", updateCategoryDraft);
  });
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

$("#adminAddProduct").addEventListener("click", () => openProductForm());
$("#adminNavAdd").addEventListener("click", () => openProductForm());
$("#adminProductsLink").addEventListener("click", () => { $("#adminWorkspace").scrollIntoView({ behavior: "smooth" }); });
productForm.elements.category.addEventListener("change", () => {
  if (activeCategory) categoryDrafts[activeCategory] = JSON.parse(productForm.elements.categoryDetails.value || "{}");
  activeCategory = productForm.elements.category.value;
  renderCategoryFields(categoryDrafts[activeCategory] || {}, true);
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
$("#adminSearch").addEventListener("input", (event) => renderProducts(event.target.value));
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
  if (button.dataset.action === "delete" && window.confirm(`¿Eliminar “${product.name}” del catálogo?`)) {
    button.disabled = true;
    try {
      await adminFetch(`/api/admin/products/${encodeURIComponent(product.id)}`, { method: "DELETE" });
      await refreshProducts();
      window.dispatchEvent(new CustomEvent("catalog:updated"));
      showMessage("Producto eliminado.");
    } catch (error) {
      showMessage(error.message, true);
      button.disabled = false;
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

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey === ADMIN_COMMAND.ctrlKey && event.altKey === ADMIN_COMMAND.altKey &&
      event.shiftKey === ADMIN_COMMAND.shiftKey && event.key.toLowerCase() === ADMIN_COMMAND.key) {
    event.preventDefault();
    openAdmin();
    return;
  }
  if (!adminOverlay.hidden && event.key === "Escape" && !productDialog.open) closeAdmin();
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

