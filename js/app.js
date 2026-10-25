// ===================================================================
// DIVERSAS MARCAS — LÓGICA DE APLICACIÓN CON TAILWIND & ANIME.JS
// Tepic, Nayarit, México
// ===================================================================

import { animate, stagger } from "animejs";
import { CONFIG } from "./config.js";
import { PRODUCTS as INITIAL_PRODUCTS } from "./products.js";

document.addEventListener("DOMContentLoaded", () => {
  // Preferencias de accesibilidad de movimiento
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = reducedMotionQuery.matches;
  const storeHeader = document.getElementById("storeHeader");
  const compactSearchToggles = document.querySelectorAll(".compact-search-toggle");
  const desktopSearchInput = document.getElementById("searchInput");
  const mobileSearchInput = document.getElementById("searchInputMobile");
  let headerSpacer = null;
  let headerCompact = false;
  const headerAnimations = new Set();
  let headerAnimationFrame = 0;
  let headerTransitionVersion = 0;

  const animateHeaderReflow = (before) => {
    const version = ++headerTransitionVersion;
    if (headerAnimationFrame) cancelAnimationFrame(headerAnimationFrame);
    for (const animation of headerAnimations) animation.cancel();
    headerAnimations.clear();
    if (reducedMotionQuery.matches) return;
    headerAnimationFrame = requestAnimationFrame(() => {
      headerAnimationFrame = 0;
      if (version !== headerTransitionVersion || reducedMotionQuery.matches) return;
      for (const [element, rect] of before) {
        if (!element.isConnected) continue;
        const next = element.getBoundingClientRect();
        if (!next.width || !next.height) continue;
        const dx = rect.left - next.left;
        const dy = rect.top - next.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
        const animation = element.animate(
          [
            { transform: `translate(${dx}px, ${dy}px)` },
            { transform: "translate(0, 0)" }
          ],
          { duration: 380, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
        );
        headerAnimations.add(animation);
        animation.onfinish = () => headerAnimations.delete(animation);
        animation.oncancel = () => headerAnimations.delete(animation);
      }
    });
  };

  const setHeaderCompact = (compact, animateReflow = true) => {
    if (!storeHeader || compact === headerCompact) return;
    const movingParts = [
      storeHeader.querySelector("#brandHomeLink"),
      storeHeader.querySelector('nav[aria-label="Categorías"]'),
      storeHeader.querySelector("#desktopSearchWrap"),
      storeHeader.querySelector("#headerActions"),
      storeHeader.querySelector("#categorySelectMobile")
    ].filter(Boolean);
    const before = movingParts.map((element) => [element, element.getBoundingClientRect()]);

    const expandedFlowHeight = storeHeader.getBoundingClientRect().height;
    headerCompact = compact;
    storeHeader.classList.toggle("is-compact", compact);
    if (compact && !headerSpacer) {
      headerSpacer = document.createElement("div");
      headerSpacer.setAttribute("aria-hidden", "true");
      headerSpacer.className = "header-flow-spacer";
      headerSpacer.style.height = `${expandedFlowHeight}px`;
      storeHeader.after(headerSpacer);
    } else if (!compact && headerSpacer) {
      headerSpacer.remove();
      headerSpacer = null;
    }

    if (!compact && storeHeader.classList.contains("is-search-open")) {
      storeHeader.classList.remove("is-search-open");
      compactSearchToggles.forEach((button) => button.setAttribute("aria-expanded", "false"));
    }
    if (animateReflow) animateHeaderReflow(before);
  };

  let scrollFrame = 0;
  const updateHeaderOnScroll = () => {
    scrollFrame = 0;
    const y = window.scrollY;
    if (!headerCompact && y > 64) setHeaderCompact(true);
    else if (headerCompact && y < 28) setHeaderCompact(false);
  };
  window.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(updateHeaderOnScroll);
  }, { passive: true });
  if (window.scrollY > 64) setHeaderCompact(true, false);

  compactSearchToggles.forEach((button) => {
    button.addEventListener("click", () => {
      if (!storeHeader) return;
      const open = !storeHeader.classList.contains("is-search-open");
      storeHeader.classList.toggle("is-search-open", open);
      compactSearchToggles.forEach((toggle) => toggle.setAttribute("aria-expanded", String(open)));
      if (open) requestAnimationFrame(() => {
        const input = window.matchMedia("(max-width: 767px)").matches ? mobileSearchInput : desktopSearchInput;
        input?.focus();
      });
    });
  });
  storeHeader?.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !storeHeader.classList.contains("is-search-open")) return;
    storeHeader.classList.remove("is-search-open");
    compactSearchToggles.forEach((button) => button.setAttribute("aria-expanded", "false"));
  });
  reducedMotionQuery.addEventListener("change", (event) => {
    if (!event.matches) return;
    headerTransitionVersion += 1;
    if (headerAnimationFrame) cancelAnimationFrame(headerAnimationFrame);
    headerAnimationFrame = 0;
    headerAnimations.forEach((animation) => animation.cancel());
    headerAnimations.clear();
  });

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
  let animateFirstCatalogRender = true;
  let animateNextCategoryRender = false;
  let animateNextCatalogRender = false;

  const loadSavedCart = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("dm_cart") || "[]");
      if (!Array.isArray(savedCart)) return [];
      return savedCart.filter((item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        Number.isFinite(item.price) &&
        Number.isFinite(item.qty) &&
        item.qty > 0
      );
    } catch {
      return [];
    }
  };

  // Estado global de la aplicación
  const state = {
    products: [...INITIAL_PRODUCTS],
    filteredProducts: [...INITIAL_PRODUCTS],
    selectedCategory: "all",
    selectedBrand: "all",
    searchQuery: "",
    sortBy: "featured",
    onlySale: false,
    
    // Modal de producto activo
    activeProduct: null,
    selectedSize: null,
    selectedColor: null,
    quantity: 1,
    lastModalPrice: null,

    // Bolsa de cotización
    cart: loadSavedCart(),
    lastCartTotal: 0
  };

  // Elementos DOM
  const productsGrid = document.getElementById("productsGrid");
  const productsCountEl = document.getElementById("productsCount");
  const searchInput = document.getElementById("searchInput");
  const searchInputMobile = document.getElementById("searchInputMobile");
  const categoryTabs = document.querySelectorAll(".category-tab-btn");
  const categorySelectMobile = document.getElementById("categorySelectMobile");
  const brandSelect = document.getElementById("brandSelect");
  const sortSelect = document.getElementById("sortSelect");
  const saleOnlyCheckbox = document.getElementById("saleOnlyCheckbox");
  const brandChips = document.querySelectorAll(".brand-chip-btn");

  // Elementos Modal
  const productModal = document.getElementById("productModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalMainImg = document.getElementById("modalMainImg");
  const modalThumbs = document.getElementById("modalThumbs");
  const modalCategoryBadge = document.getElementById("modalCategoryBadge");
  const modalBrand = document.getElementById("modalBrand");
  const modalSku = document.getElementById("modalSku");
  const modalTitle = document.getElementById("modalTitle");
  const modalPriceCurrent = document.getElementById("modalPriceCurrent");
  const modalPriceRegular = document.getElementById("modalPriceRegular");
  const modalDesc = document.getElementById("modalDesc");
  const modalSizesContainer = document.getElementById("modalSizesContainer");
  const modalColorsContainer = document.getElementById("modalColorsContainer");
  const modalFeaturesList = document.getElementById("modalFeaturesList");
  const qtyMinusBtn = document.getElementById("qtyMinusBtn");
  const qtyPlusBtn = document.getElementById("qtyPlusBtn");
  const qtyDisplay = document.getElementById("qtyDisplay");
  const modalTotalDisplay = document.getElementById("modalTotalDisplay");
  const btnModalWhatsapp = document.getElementById("btnModalWhatsapp");
  const btnModalAddToCart = document.getElementById("btnModalAddToCart");

  // Elementos Carrito / Bolsa
  const cartDrawerOverlay = document.getElementById("cartDrawerOverlay");
  const cartDrawerCloseBtn = document.getElementById("cartDrawerCloseBtn");
  const openCartBtn = document.getElementById("openCartBtn");
  const cartBadge = document.getElementById("cartBadge");
  const cartItemsList = document.getElementById("cartItemsList");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const btnSendCartWhatsapp = document.getElementById("btnSendCartWhatsapp");
  let previouslyFocusedElement = null;

  // Formato de moneda en Pesos Mexicanos
  const formatPrice = (price) => {
    return `${CONFIG.currencySymbol}${Number(price).toLocaleString("es-MX", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })} ${CONFIG.currencyCode}`;
  };

  // 1. Inicializar lista de marcas en el select
  const initBrandFilter = () => {
    const brands = [...new Set(state.products.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, "es"));
    brandSelect.innerHTML = [
      `<option value="all">Todas las marcas</option>`,
      ...brands.map((brand) => {
        const count = state.products.filter((p) => p.brand === brand).length;
        return `<option value="${escapeHtml(brand)}">${escapeHtml(brand)} (${count})</option>`;
      })
    ].join("");
    brandSelect.value = state.selectedBrand;
  };

  // 2. Filtrado y ordenamiento de productos
  const applyFilters = () => {
    let result = [...state.products];

    // Filtro por categoría
    if (state.selectedCategory !== "all") {
      if (state.selectedCategory === "ofertas") {
        result = result.filter((p) => p.onSale);
      } else {
        result = result.filter(
          (p) => p.category.toLowerCase() === state.selectedCategory.toLowerCase()
        );
      }
    }

    // Filtro por marca
    if (state.selectedBrand !== "all") {
      result = result.filter(
        (p) => p.brand.toLowerCase() === state.selectedBrand.toLowerCase()
      );
    }

    // Solo ofertas
    if (state.onlySale) {
      result = result.filter((p) => p.onSale);
    }

    // Buscador por texto
    if (state.searchQuery.trim() !== "") {
      const q = state.searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Ordenamiento
    switch (state.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.offerPrice - b.offerPrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.offerPrice - a.offerPrice);
        break;
      case "discount":
        result.sort((a, b) => {
          const discA = (a.regularPrice - a.offerPrice) / a.regularPrice;
          const discB = (b.regularPrice - b.offerPrice) / b.regularPrice;
          return discB - discA;
        });
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    state.filteredProducts = result;
    renderProducts();
  };

  // 3. Renderizar productos con cascada de Anime.js y tipografía Imagen 2
  const renderProducts = () => {
    productsCountEl.textContent = `${state.filteredProducts.length} DISPONIBLES`;

    if (state.filteredProducts.length === 0) {
      animateNextCategoryRender = false;
      animateNextCatalogRender = false;
      productsGrid.innerHTML = `
        <div class="catalog-empty-state col-span-full text-center py-16 px-4 bg-white rounded border border-dashed border-neutral-300">
          <i class="fa-solid fa-magnifying-glass text-3xl text-neutral-300 mb-3"></i>
          <h3 class="font-display font-black text-lg uppercase tracking-wider text-neutral-900 mb-1">No encontramos coincidencias</h3>
          <p class="text-xs text-neutral-500 max-w-sm mx-auto mb-5">Prueba con otra palabra clave, marca o categoría para ver opciones disponibles.</p>
          <button id="btnResetFilters" class="min-h-[44px] px-5 py-2 rounded bg-neutral-950 text-white font-display font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950">
            Ver todo el catálogo
          </button>
        </div>
      `;
      document.getElementById("btnResetFilters")?.addEventListener("click", () => {
        resetAllFilters();
      });
      return;
    }

    productsGrid.innerHTML = state.filteredProducts
      .map((product) => {
        const discountPercent = Math.round(
          ((product.regularPrice - product.offerPrice) / product.regularPrice) * 100
        );
        const imagePath = product.images?.[0] || "assets/logo.png";
        const productImage = product.id === "sauvage-extrain-ef27ec" && imagePath.startsWith("https://www.bing.com/images/search")
          ? "/assets/products/sauvage-extrain.jpg"
          : imagePath;

        return `
        <article class="product-card-anim bg-white rounded border border-neutral-200/90 overflow-hidden flex flex-col group transition-colors duration-200" data-id="${escapeHtml(product.id)}">
          
          <!-- Imagen de Producto -->
          <div class="relative aspect-square bg-neutral-100 overflow-hidden">
            <img src="${escapeHtml(productImage)}" alt="${escapeHtml(product.name)}" loading="lazy" class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
            
            <!-- Badges de oferta y novedad -->
            <div class="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
              ${
                product.onSale
                  ? `<span class="bg-red-700 text-white font-display font-black text-[11px] tracking-wide px-2 py-1 rounded-md">-${discountPercent}% desc.</span>`
                  : ""
              }
              ${
                product.isNew
                  ? `<span class="bg-blue-800 text-white font-display font-bold text-[11px] tracking-wide px-2 py-1 rounded-md">Nuevo</span>`
                  : ""
              }
            </div>

            <div class="absolute top-2.5 right-2.5 z-10">
              <span class="bg-neutral-950/90 text-white text-[11px] font-display font-bold px-2 py-1 rounded-md">
                Selección DM
              </span>
            </div>
          </div>

          <!-- Contenido: Jerarquía tipográfica exacta de Imagen 2 -->
          <div class="p-3 sm:p-4 flex flex-col flex-1">
            
            <!-- Badge de categoría estilo Imagen 2: [FRAGRANCE] -->
            <div class="flex flex-wrap items-center justify-between gap-y-1 mb-2">
              <span class="inline-block border border-neutral-300 px-2 py-0.5 rounded-md text-xs font-display font-bold text-neutral-800 bg-neutral-50">
                ${escapeHtml(product.category)}
              </span>
              <span class="text-xs font-display font-bold text-neutral-700 whitespace-nowrap">
                ${escapeHtml(product.brand)}
              </span>
            </div>

            <!-- Título del producto en Negrita Mayúscula estilo ODYSSEY MANDARIN SKY -->
            <h3 class="font-display font-bold text-sm sm:text-base tracking-tight text-neutral-950 leading-snug line-clamp-2 min-h-[2.6rem]" title="${escapeHtml(product.name)}">
              ${escapeHtml(product.name)}
            </h3>

            <!-- Línea divisoria elegante -->
            <div class="border-b border-neutral-200/90 my-2.5"></div>

            <!-- Fila de Precio -->
            <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-4 mt-auto">
              <span class="font-display font-black text-base sm:text-lg text-neutral-950 whitespace-nowrap">
                ${formatPrice(product.offerPrice)}
              </span>
              ${
                product.onSale
                  ? `<span class="text-xs font-semibold text-neutral-600 line-through whitespace-nowrap">${formatPrice(product.regularPrice)}</span>`
                  : ""
              }
            </div>

            <!-- Botones de Acción -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button class="btn-open-detail min-h-[44px] w-full py-2.5 px-3 rounded border border-neutral-300 hover:border-neutral-950 bg-white text-neutral-900 text-[13px] font-display font-bold transition-colors flex items-center justify-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950" data-id="${escapeHtml(product.id)}">
                <i class="fa-solid fa-eye text-xs"></i>
                <span>Ver detalles</span>
              </button>

              <button class="btn-quick-wa min-h-[44px] w-full px-3 py-2.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center text-[13px] font-display font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800" data-id="${escapeHtml(product.id)}" aria-label="Pedir ${escapeHtml(product.name)} por WhatsApp">
                <span>Pedir</span>
              </button>
            </div>

          </div>
        </article>
      `;
      })
      .join("");

    // Animación de entrada en cascada con Anime.js (Staggering)
    if (animateFirstCatalogRender && !prefersReducedMotion) {
      animate(".product-card-anim", {
        y: [16, 0],
        opacity: [0, 1],
        delay: stagger(36, { start: 12 }),
        duration: 280,
        ease: "outCubic"
      });
    } else if ((animateNextCategoryRender || animateNextCatalogRender) && !prefersReducedMotion) {
      productsGrid.querySelectorAll(".product-card-anim").forEach((card, index) => {
        const entrance = card.animate([
          { opacity: 0.45, transform: "translate3d(0, 3px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" }
        ], {
          duration: 220,
          delay: index * 12,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)"
        });
        entrance.onfinish = () => entrance.cancel();
      });
    }
    animateFirstCatalogRender = false;
    animateNextCategoryRender = false;
    animateNextCatalogRender = false;

    // Eventos en tarjetas
    document.querySelectorAll(".btn-open-detail").forEach((btn) => {
      btn.addEventListener("click", () => {
        const prodId = btn.getAttribute("data-id");
        openProductModal(prodId);
      });
    });

    document.querySelectorAll(".btn-quick-wa").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const prodId = btn.getAttribute("data-id");
        const prod = state.products.find((p) => p.id === prodId);
        if (prod) {
          sendDirectWhatsApp(prod, prod.sizes[0], prod.colors[0]?.name || "Estándar", 1);
        }
      });
    });
  };

  // 4. Modal de Detalle Interactivo con animación suave Anime.js
  const openProductModal = (productId) => {
    const prod = state.products.find((p) => p.id === productId);
    if (!prod) return;

    state.activeProduct = prod;
    state.selectedSize = prod.sizes[0];
    state.selectedColor = prod.colors[0]?.name || "Estándar";
    state.quantity = 1;
    state.lastModalPrice = prod.offerPrice;

    // Llenar contenido
    modalCategoryBadge.textContent = prod.category.toUpperCase();
    modalBrand.textContent = prod.brand;
    modalSku.textContent = `CÓD: ${prod.id}`;
    modalTitle.textContent = prod.name;
    modalPriceCurrent.textContent = formatPrice(prod.offerPrice);
    modalPriceRegular.textContent = prod.onSale ? formatPrice(prod.regularPrice) : "";
    modalDesc.textContent = prod.description;
    qtyDisplay.textContent = state.quantity;
    modalTotalDisplay.textContent = formatPrice(prod.offerPrice);

    // Galería
    modalMainImg.removeAttribute("src");
    if (prod.images?.[0]) modalMainImg.src = prod.images[0];
    modalThumbs.innerHTML = prod.images
      .map(
        (img, idx) => `
        <button type="button" class="modal-thumb ${idx === 0 ? "active" : ""}" data-img="${escapeHtml(img)}" aria-label="Ver imagen ${idx + 1} de ${escapeHtml(prod.name)}" aria-pressed="${idx === 0}">
          <img src="${escapeHtml(img)}" alt="" />
        </button>
      `
      )
      .join("");

    document.querySelectorAll(".modal-thumb").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        document.querySelectorAll(".modal-thumb").forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-pressed", "false");
        });
        thumb.classList.add("active");
        thumb.setAttribute("aria-pressed", "true");
        modalMainImg.src = thumb.getAttribute("data-img");
      });
    });

    // Selector de tallas / mililitros
    const sizeLabelText = prod.category === "Perfumes" ? "Presentación / Tamaño:" : "Talla / Medida:";
    modalSizesContainer.innerHTML = `
      <div class="flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-neutral-700 mb-2">
        <span>${sizeLabelText}</span>
        <span class="text-neutral-950 font-black" id="selectedSizeLabel">${escapeHtml(state.selectedSize)}</span>
      </div>
      <div class="flex flex-wrap gap-2">
        ${prod.sizes
          .map(
            (size, idx) => `
          <button type="button" class="size-pill ${idx === 0 ? "active" : ""}" data-size="${escapeHtml(size)}" aria-pressed="${idx === 0}">
            ${escapeHtml(size)}
          </button>
        `
          )
          .join("")}
      </div>
    `;

    document.querySelectorAll(".size-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".size-pill").forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        state.selectedSize = btn.getAttribute("data-size");
        document.getElementById("selectedSizeLabel").textContent = state.selectedSize;
      });
    });

    // Selector de colores / versiones
    if (prod.colors && prod.colors.length > 0) {
      modalColorsContainer.style.display = "block";
      modalColorsContainer.innerHTML = `
        <div class="flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-neutral-700 mb-2">
          <span>Versión / Color:</span>
          <span class="text-neutral-950 font-black" id="selectedColorLabel">${escapeHtml(state.selectedColor)}</span>
        </div>
        <div class="flex flex-wrap gap-2">
          ${prod.colors
            .map(
              (c, idx) => `
            <button type="button" class="color-dot-btn ${idx === 0 ? "active" : ""}" data-color="${escapeHtml(c.name)}" aria-pressed="${idx === 0}">
              <span class="color-circle" style="background-color: ${escapeHtml(c.hex)}"></span>
              <span>${escapeHtml(c.name)}</span>
            </button>
          `
            )
            .join("")}
        </div>
      `;

      document.querySelectorAll(".color-dot-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".color-dot-btn").forEach((b) => {
            b.classList.remove("active");
            b.setAttribute("aria-pressed", "false");
          });
          btn.classList.add("active");
          btn.setAttribute("aria-pressed", "true");
          state.selectedColor = btn.getAttribute("data-color");
          document.getElementById("selectedColorLabel").textContent = state.selectedColor;
        });
      });
    } else {
      modalColorsContainer.style.display = "none";
    }

    // Lista de características
    const detailLabels = { type: "Tipo", material: "Material", fragranceFamily: "Familia olfativa", concentration: "Concentración" };
    const productDetails = Object.entries(prod.details || {})
      .filter(([key, value]) => detailLabels[key] && value)
      .map(([key, value]) => `${detailLabels[key]}: ${value}`);
    modalFeaturesList.innerHTML = [...productDetails, ...prod.features]
      .map(
        (f) => `
      <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600 text-xs"></i> <span>${escapeHtml(f)}</span></li>
    `
      )
      .join("");

    previouslyFocusedElement = document.activeElement;
    productModal.inert = false;
    productModal.removeAttribute("aria-hidden");
    productModal.classList.add("active");
    document.body.style.overflow = "hidden";
    modalCloseBtn.focus();

    // Animación de apertura suave del modal con Anime.js
    if (!prefersReducedMotion) {
      animate(".modal-content-box", {
        scale: [0.94, 1],
        opacity: [0, 1],
        y: [20, 0],
        duration: 320,
        ease: "outCubic"
      });
    }
  };

  const closeProductModal = () => {
    productModal.classList.remove("active");
    productModal.setAttribute("aria-hidden", "true");
    productModal.inert = true;
    document.body.style.overflow = "";
    state.activeProduct = null;
    if (previouslyFocusedElement instanceof HTMLElement) previouslyFocusedElement.focus();
    previouslyFocusedElement = null;
  };

  // Contador numérico suave con Anime.js al cambiar cantidad
  const updateModalTotal = () => {
    if (!state.activeProduct) return;
    const targetTotal = state.activeProduct.offerPrice * state.quantity;

    if (
      !prefersReducedMotion &&
      state.lastModalPrice !== null &&
      state.lastModalPrice !== targetTotal
    ) {
      const priceCounter = { val: state.lastModalPrice };
      animate(priceCounter, {
        val: targetTotal,
        round: 1,
        duration: 320,
        ease: "outExpo",
        onUpdate: () => {
          modalTotalDisplay.textContent = formatPrice(priceCounter.val);
        }
      });
    } else {
      modalTotalDisplay.textContent = formatPrice(targetTotal);
    }

    state.lastModalPrice = targetTotal;
  };

  // Controles de cantidad
  qtyMinusBtn.addEventListener("click", () => {
    if (state.quantity > 1) {
      state.quantity--;
      qtyDisplay.textContent = state.quantity;
      updateModalTotal();
    }
  });

  qtyPlusBtn.addEventListener("click", () => {
    if (state.quantity < 10) {
      state.quantity++;
      qtyDisplay.textContent = state.quantity;
      updateModalTotal();
    }
  });

  // 5. Envío de pedido directo por WhatsApp
  const sendDirectWhatsApp = (prod, size, color, qty) => {
    const total = prod.offerPrice * qty;
    const message = `¡Hola Diversas Marcas! 🛍️ Me interesa pedir este artículo de su catálogo web en Tepic:

📦 *Producto:* ${prod.name}
🏷️ *Marca:* ${prod.brand} (Cód: ${prod.id})
📏 *Presentación/Talla:* ${size}
🎨 *Color/Versión:* ${color}
🔢 *Cantidad:* ${qty}
💰 *Total:* ${formatPrice(total)}

📍 Estoy en Tepic / Requiero envío. ¿Me confirman existencias para entrega o envío? ¡Gracias!`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
    window.open(url, "_blank");
  };

  btnModalWhatsapp.addEventListener("click", () => {
    if (state.activeProduct) {
      sendDirectWhatsApp(
        state.activeProduct,
        state.selectedSize,
        state.selectedColor,
        state.quantity
      );
    }
  });

  // 6. Carrito / Bolsa de compras
  const updateCartBadge = () => {
    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalItems;
    cartBadge.setAttribute("aria-label", `${totalItems} ${totalItems === 1 ? "artículo" : "artículos"} en la bolsa`);
    try {
      localStorage.setItem("dm_cart", JSON.stringify(state.cart));
    } catch {
      // La bolsa sigue disponible durante esta visita aunque el navegador bloquee el almacenamiento.
    }
  };

  const renderCartDrawer = () => {
    updateCartBadge();
    if (state.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="text-center py-12 px-4 text-neutral-400">
          <i class="fa-solid fa-bag-shopping text-4xl mb-3 text-neutral-300"></i>
          <p class="font-display font-bold text-sm text-neutral-800 uppercase tracking-wider">Tu bolsa está vacía</p>
          <p class="text-xs text-neutral-500 mt-1">Agrega perfumes o prendas para solicitar tu cotización completa.</p>
        </div>
      `;
      cartSubtotalEl.textContent = formatPrice(0);
      state.lastCartTotal = 0;
      btnSendCartWhatsapp.style.display = "none";
      return;
    }

    btnSendCartWhatsapp.style.display = "flex";
    let subtotal = 0;

    cartItemsList.innerHTML = state.cart
      .map((item, index) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        return `
        <div class="flex items-center gap-3 pb-3 border-b border-neutral-200">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="w-14 h-14 rounded object-cover border border-neutral-200 shrink-0" />
          <div class="flex-1 min-w-0">
            <h4 class="font-display font-bold text-sm text-neutral-950 truncate">${escapeHtml(item.name)}</h4>
            <div class="text-[11px] text-neutral-500 mt-0.5">
              <span>${escapeHtml(item.size)}</span> • <span>${escapeHtml(item.color)}</span> • <span>Cant: ${item.qty}</span>
            </div>
            <div class="font-display font-black text-xs text-neutral-950 mt-1">${formatPrice(itemTotal)}</div>
          </div>
          <button class="cart-item-remove min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-700 hover:text-red-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950" data-index="${index}" aria-label="Quitar ${escapeHtml(item.name)} de la bolsa">
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </div>
      `;
      })
      .join("");

    // Contador suave del subtotal en la bolsa con Anime.js
    if (
      !prefersReducedMotion &&
      state.lastCartTotal !== undefined &&
      state.lastCartTotal !== subtotal
    ) {
      const subtotalCounter = { val: state.lastCartTotal };
      animate(subtotalCounter, {
        val: subtotal,
        round: 1,
        duration: 350,
        ease: "outExpo",
        onUpdate: () => {
          cartSubtotalEl.textContent = formatPrice(subtotalCounter.val);
        }
      });
    } else {
      cartSubtotalEl.textContent = formatPrice(subtotal);
    }
    state.lastCartTotal = subtotal;

    document.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        state.cart.splice(idx, 1);
        renderCartDrawer();
      });
    });
  };

  // Recompensa visual con Anime.js al agregar a la bolsa (Elastic Bounce)
  btnModalAddToCart.addEventListener("click", () => {
    if (!state.activeProduct) return;

    const existingIndex = state.cart.findIndex(
      (item) =>
        item.id === state.activeProduct.id &&
        item.size === state.selectedSize &&
        item.color === state.selectedColor
    );

    if (existingIndex > -1) {
      state.cart[existingIndex].qty += state.quantity;
    } else {
      state.cart.push({
        id: state.activeProduct.id,
        name: state.activeProduct.name,
        brand: state.activeProduct.brand,
        price: state.activeProduct.offerPrice,
        size: state.selectedSize,
        color: state.selectedColor,
        qty: state.quantity,
        image: state.activeProduct.images[0]
      });
    }

    renderCartDrawer();
    closeProductModal();

    // Feedback táctil en el botón de la bolsa
    if (!prefersReducedMotion) {
      animate("#openCartBtn", {
        scale: [1, 1.15, 0.95, 1.05, 1],
        duration: 450,
        ease: "outElastic(1, .5)"
      });
      animate("#cartBadge", {
        scale: [1, 1.5, 1],
        duration: 350,
        ease: "outBack"
      });
    }

    openCartDrawer();
  });

  const openCartDrawer = () => {
    renderCartDrawer();
    previouslyFocusedElement = document.activeElement;
    cartDrawerOverlay.inert = false;
    cartDrawerOverlay.removeAttribute("aria-hidden");
    cartDrawerOverlay.classList.add("active");
    openCartBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    cartDrawerCloseBtn.focus();
  };

  const closeCartDrawer = () => {
    cartDrawerOverlay.classList.remove("active");
    cartDrawerOverlay.setAttribute("aria-hidden", "true");
    cartDrawerOverlay.inert = true;
    openCartBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (previouslyFocusedElement instanceof HTMLElement) previouslyFocusedElement.focus();
    previouslyFocusedElement = null;
  };

  openCartBtn.addEventListener("click", openCartDrawer);
  cartDrawerCloseBtn.addEventListener("click", closeCartDrawer);
  cartDrawerOverlay.addEventListener("click", (e) => {
    if (e.target === cartDrawerOverlay) closeCartDrawer();
  });

  modalCloseBtn.addEventListener("click", closeProductModal);
  productModal.addEventListener("click", (e) => {
    if (e.target === productModal) closeProductModal();
  });

  document.addEventListener("keydown", (event) => {
    const activeDialog = productModal.classList.contains("active")
      ? productModal
      : cartDrawerOverlay.classList.contains("active")
        ? cartDrawerOverlay.querySelector('[role="dialog"]')
        : null;
    if (!activeDialog) return;

    if (event.key === "Escape") {
      event.preventDefault();
      if (activeDialog === productModal) closeProductModal();
      else closeCartDrawer();
      return;
    }

    if (event.key !== "Tab") return;
    const focusableElements = [...activeDialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((element) => element.getClientRects().length > 0);
    if (focusableElements.length === 0) {
      event.preventDefault();
      activeDialog.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && (document.activeElement === firstElement || !activeDialog.contains(document.activeElement))) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && (document.activeElement === lastElement || !activeDialog.contains(document.activeElement))) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  // Enviar pedido completo de la bolsa por WhatsApp
  btnSendCartWhatsapp.addEventListener("click", () => {
    if (state.cart.length === 0) return;

    let subtotal = 0;
    const itemsText = state.cart
      .map((item, idx) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        return `${idx + 1}. *${item.name}* (${item.brand})
   • Talla/Medida: ${item.size}
   • Versión: ${item.color}
   • Cantidad: ${item.qty} | Subtotal: ${formatPrice(itemTotal)}`;
      })
      .join("\n\n");

    const message = `¡Hola Diversas Marcas Tepic! 🛍️✨ Quiero solicitar el apartado y cotización de este pedido de su catálogo web:

${itemsText}

💰 *TOTAL GENERAL:* ${formatPrice(subtotal)}

📍 Estoy en Tepic / Requiero envío a mi dirección. ¿Me confirman disponibilidad para concretar? ¡Gracias!`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;
    window.open(url, "_blank");
  });

  // Una sola fuente de verdad para las pestañas de escritorio y el selector móvil.
  const updateCategoryControls = (category) => {
    categoryTabs.forEach((tab) => {
      const selected = tab.getAttribute("data-category") === category;
      tab.classList.toggle("active", selected);
      tab.classList.toggle("font-black", selected);
      tab.classList.toggle("text-neutral-950", selected);
      tab.classList.toggle("border-neutral-950", selected);
      tab.classList.toggle("text-neutral-500", !selected && category !== "ofertas");
      tab.classList.toggle("border-transparent", !selected);
      tab.setAttribute("aria-pressed", String(selected));
    });
    if (categorySelectMobile) categorySelectMobile.value = category;
  };

  const setCategory = (category) => {
    animateNextCategoryRender = state.selectedCategory !== category;
    state.selectedCategory = category;
    updateCategoryControls(category);
    applyFilters();
  };

  const scrollToCatalog = (behavior = "smooth") => {
    const catalog = document.getElementById("catalogoSection");
    if (!catalog) return;
    const stickyHeader = document.querySelector("header");
    const headerHeight = stickyHeader?.getBoundingClientRect().height || 0;
    const top = window.scrollY + catalog.getBoundingClientRect().top - headerHeight - 12;
    window.scrollTo({ top: Math.max(0, top), behavior });
  };

  const changeCategory = (category, scrollBehavior) => {
    updateCategoryControls(category);
    scrollToCatalog(scrollBehavior);
    setCategory(category);
  };

  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      const behavior = event.detail > 0 && !prefersReducedMotion ? "smooth" : "instant";
      changeCategory(tab.getAttribute("data-category"), behavior);
    });
  });
  let mobileCategoryPointerActivation = false;
  categorySelectMobile?.addEventListener("pointerdown", () => { mobileCategoryPointerActivation = true; }, { passive: true });
  categorySelectMobile?.addEventListener("keydown", () => { mobileCategoryPointerActivation = false; });
  categorySelectMobile?.addEventListener("change", (event) => {
    const behavior = mobileCategoryPointerActivation && !prefersReducedMotion ? "smooth" : "instant";
    changeCategory(event.target.value, behavior);
    mobileCategoryPointerActivation = false;
  });

  brandSelect.addEventListener("change", (e) => {
    state.selectedBrand = e.target.value;
    animateNextCatalogRender = true;
    applyFilters();
  });

  sortSelect.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    animateNextCatalogRender = true;
    applyFilters();
  });

  saleOnlyCheckbox.addEventListener("change", (e) => {
    state.onlySale = e.target.checked;
    animateNextCatalogRender = true;
    applyFilters();
  });

  const handleSearch = (val) => {
    state.searchQuery = val;
    if (searchInput) searchInput.value = val;
    if (searchInputMobile) searchInputMobile.value = val;
    applyFilters();
  };

  if (searchInput) {
    searchInput.addEventListener("input", (e) => handleSearch(e.target.value));
  }
  if (searchInputMobile) {
    searchInputMobile.addEventListener("input", (e) => handleSearch(e.target.value));
  }

  brandChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const brand = chip.getAttribute("data-brand");
      state.selectedBrand = brand;
      brandSelect.value = brand;
      applyFilters();
      document.getElementById("catalogoSection").scrollIntoView({ behavior: "smooth" });
    });
  });

  // Función para reiniciar todos los filtros e ir al inicio
  const resetAllFilters = () => {
    state.selectedCategory = "all";
    if (categorySelectMobile) categorySelectMobile.value = "all";
    state.selectedBrand = "all";
    state.searchQuery = "";
    state.sortBy = "featured";
    state.onlySale = false;

    if (searchInput) searchInput.value = "";
    if (searchInputMobile) searchInputMobile.value = "";
    brandSelect.value = "all";
    sortSelect.value = "featured";
    saleOnlyCheckbox.checked = false;

    categoryTabs.forEach((t) => {
      t.classList.remove("active", "text-neutral-950", "font-black", "border-neutral-950");
      t.classList.add("text-neutral-500", "border-transparent");
      t.setAttribute("aria-pressed", "false");
    });
    if (categoryTabs.length > 0) {
      categoryTabs[0].classList.add("active", "text-neutral-950", "font-black", "border-neutral-950");
      categoryTabs[0].classList.remove("text-neutral-500", "border-transparent");
      categoryTabs[0].setAttribute("aria-pressed", "true");
    }

    applyFilters();
  };

  // Función para ir siempre al inicio al hacer clic en el logo
  const goToHome = (e) => {
    if (e) e.preventDefault();
    resetAllFilters();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.location.hash) {
      history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  };

  // Asignar clic en el logo principal y en el footer
  const brandHomeLink = document.getElementById("brandHomeLink");
  if (brandHomeLink) {
    brandHomeLink.addEventListener("click", goToHome);
  }

  const footerHomeLink = document.getElementById("footerHomeLink");
  if (footerHomeLink) {
    footerHomeLink.addEventListener("click", goToHome);
  }

  // Entrada única y discreta del logotipo principal.
  if (!prefersReducedMotion) {
    const heroLogo = document.querySelector(".hero-logo-frame");
    if (heroLogo) {
      animate(heroLogo, {
        opacity: [0, 1],
        duration: 360,
        ease: "outCubic"
      });

      const heroSection = heroLogo.closest(".hero-section");
      const supportsPointerTracking = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (heroSection && supportsPointerTracking) {
        let pendingPointer = null;
        let animationFrame = 0;
        const updateLogoTilt = () => {
          animationFrame = 0;
          if (!pendingPointer) return;
          const bounds = heroSection.getBoundingClientRect();
          const x = Math.max(-1, Math.min(1, ((pendingPointer.clientX - bounds.left) / bounds.width) * 2 - 1));
          const y = Math.max(-1, Math.min(1, ((pendingPointer.clientY - bounds.top) / bounds.height) * 2 - 1));
          heroLogo.style.setProperty("--logo-tilt-x", `${-y * 6}deg`);
          heroLogo.style.setProperty("--logo-tilt-y", `${x * 8}deg`);
        };
        heroSection.addEventListener("pointermove", (event) => {
          if (event.pointerType !== "mouse") return;
          heroLogo.classList.remove("is-returning");
          pendingPointer = event;
          if (!animationFrame) animationFrame = requestAnimationFrame(updateLogoTilt);
        }, { passive: true });
        heroSection.addEventListener("pointerleave", () => {
          pendingPointer = null;
          heroLogo.classList.add("is-returning");
          heroLogo.style.setProperty("--logo-tilt-x", "0deg");
          heroLogo.style.setProperty("--logo-tilt-y", "0deg");
        }, { passive: true });
      }
    }
  }

  const loadCatalog = async () => {
    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      if (response.ok) {
        const catalog = await response.json();
        if (Array.isArray(catalog)) state.products = catalog;
      }
    } catch {
      // El catálogo local de respaldo permite abrir la versión estática.
    }
    initBrandFilter();
    applyFilters();
    updateCartBadge();
  };

  window.addEventListener("catalog:updated", () => {
    const previousBrand = state.selectedBrand;
    loadCatalog().then(() => {
      if ([...brandSelect.options].some((option) => option.value === previousBrand)) {
        state.selectedBrand = previousBrand;
        brandSelect.value = previousBrand;
      } else {
        state.selectedBrand = "all";
      }
      applyFilters();
    });
  });

  loadCatalog();
});
