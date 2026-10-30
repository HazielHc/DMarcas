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
  const categoryNav = document.querySelector('nav[aria-label="Categorías"]');
  let categoryIndicator = categoryNav?.querySelector(".category-active-indicator");
  let categoryIndicatorAnimation = null;

  const moveCategoryIndicator = (shouldAnimate = true) => {
    const selectedTab = categoryNav?.querySelector(".category-tab-btn.active");
    if (!selectedTab || !categoryIndicator) return;
    const navBounds = categoryNav.getBoundingClientRect();
    const targetBounds = selectedTab.getBoundingClientRect();
    if (!navBounds.width || !targetBounds.width) return;

    const currentBounds = categoryIndicator.getBoundingClientRect();
    const wasPositioned = categoryIndicator.dataset.positioned === "true";
    const targetX = targetBounds.left - navBounds.left;
    categoryIndicatorAnimation?.cancel();
    categoryIndicatorAnimation = null;
    categoryIndicator.style.width = `${targetBounds.width}px`;
    const targetTransform = `translate3d(${targetX}px, 0, 0)`;

    if (!shouldAnimate || !wasPositioned || reducedMotionQuery.matches || !currentBounds.width) {
      categoryIndicator.style.transform = targetTransform;
      categoryIndicator.dataset.positioned = "true";
      return;
    }

    const startX = currentBounds.left - navBounds.left;
    const startScale = currentBounds.width / targetBounds.width;
    const animation = categoryIndicator.animate(
      [
        { transform: `translate3d(${startX}px, 0, 0) scaleX(${startScale})` },
        { transform: targetTransform }
      ],
      { duration: 220, easing: "cubic-bezier(0.77, 0, 0.175, 1)" }
    );
    categoryIndicatorAnimation = animation;
    categoryIndicator.dataset.positioned = "true";
    animation.onfinish = () => {
      if (categoryIndicatorAnimation !== animation) return;
      categoryIndicator.style.transform = targetTransform;
      categoryIndicatorAnimation = null;
      animation.cancel();
    };
  };

  window.addEventListener("resize", () => moveCategoryIndicator(false), { passive: true });
  reducedMotionQuery.addEventListener("change", (event) => {
    if (!event.matches) return;
    categoryIndicatorAnimation?.cancel();
    categoryIndicatorAnimation = null;
    moveCategoryIndicator(false);
  });

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
        const isLogo = element.matches(".brand-logo-frame");
        const scaleX = isLogo && next.width ? rect.width / next.width : 1;
        const scaleY = isLogo && next.height ? rect.height / next.height : 1;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(scaleX - 1) < 0.01 && Math.abs(scaleY - 1) < 0.01) continue;
        const animation = element.animate(
          [
            { transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scaleX}, ${scaleY})` },
            { transform: "translate(0, 0)" }
          ],
          { duration: 280, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
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
      storeHeader.querySelector("#brandHomeLink .brand-logo-frame"),
      storeHeader.querySelector('nav[aria-label="Categorías"]'),
      storeHeader.querySelector("#desktopSearchWrap"),
      storeHeader.querySelector("#headerActions"),
      storeHeader.querySelector("#categorySelectMobile")
    ].filter(Boolean);
    const before = movingParts.map((element) => [element, element.getBoundingClientRect()]);

    const expandedFlowHeight = storeHeader.getBoundingClientRect().height;
    headerCompact = compact;
    storeHeader.classList.toggle("is-compact", compact);
    moveCategoryIndicator(false);
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
  moveCategoryIndicator(false);

  compactSearchToggles.forEach((button) => {
    button.addEventListener("click", () => {
      if (!storeHeader) return;
      if (button.classList.contains("mobile-search-toggle") && window.matchMedia("(max-width: 767px)").matches) {
        openMobileSearch();
        return;
      }
      const open = !storeHeader.classList.contains("is-search-open");
      storeHeader.classList.toggle("is-search-open", open);
      compactSearchToggles.forEach((toggle) => toggle.setAttribute("aria-expanded", String(open)));
      if (open) requestAnimationFrame(() => {
        const input = window.matchMedia("(max-width: 767px)").matches ? mobileSearchInput : desktopSearchInput;
        input?.focus();
      });
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (mobileSearchOverlay?.classList.contains("is-open") && !productModal?.classList.contains("active")) {
      closeMobileSearch({ restoreFocus: true });
      return;
    }
    if (!storeHeader.classList.contains("is-search-open")) return;
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
    mobileCategoryGroupId: null,
    selectedBrand: "all",
    searchQuery: "",
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
  const categorySelectMobile = document.getElementById("categorySelectMobile");
  const mobileFilterToggle = document.getElementById("mobileFilterToggle");
  const catalogControls = document.querySelector(".catalog-controls");
  const catalogSection = document.getElementById("catalogoSection");
  const mobileCategoryHome = document.getElementById("mobileCategoryHome");
  const mobileSearchOverlay = document.getElementById("mobileSearchOverlay");
  const mobileSearchClose = document.getElementById("mobileSearchClose");
  const mobileSearchClear = document.getElementById("mobileSearchClear");
  const mobileSearchSuggestions = document.getElementById("mobileSearchSuggestions");
  const mobileSearchResults = document.getElementById("mobileSearchResults");
  const mobileCategoryGrid = document.getElementById("mobileCategoryGrid");
  const mobileCategoryResultsHeader = document.getElementById("mobileCategoryResultsHeader");
  const mobileCategoryBack = document.getElementById("mobileCategoryBack");
  const mobileCategoryTitle = document.getElementById("mobileCategoryTitle");
  const mobileCategoryCount = document.getElementById("mobileCategoryCount");
  const mobileCategoryGroups = new Map();
  const brandSelect = document.getElementById("brandSelect");
  const saleOnlyCheckbox = document.getElementById("saleOnlyCheckbox");
  const brandChips = document.querySelectorAll(".brand-chip-btn");

  const renderDesktopCategoryTabs = () => {
    if (!categoryNav) return;
    const pinnedCategories = ["Perfumes", "Calzado", "Ropa", "Accesorios", "Lentes", "Otros"];
    const seen = new Set();
    const categories = [...pinnedCategories, ...state.products.map((product) => String(product.category || "Otros").trim())]
      .filter((category) => {
        const key = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-MX");
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    const iconFor = (category) => {
      const key = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-MX");
      if (/perfume|fragancia/.test(key)) return "fa-spray-can-sparkles";
      if (/calzado|tenis|zapato/.test(key)) return "fa-shoe-prints";
      if (/lente/.test(key)) return "fa-glasses";
      if (/ropa|prenda/.test(key)) return "fa-shirt";
      if (/accesorio/.test(key)) return "fa-bag-shopping";
      return "fa-box-open";
    };
    categoryNav.innerHTML = `<button aria-pressed="${state.selectedCategory === "all"}" class="category-tab-btn${state.selectedCategory === "all" ? " active font-black text-neutral-950" : " text-neutral-500"} min-h-[44px] px-3.5 py-2 transition-colors" data-category="all">TODOS</button>${categories.map((category) => `<button aria-pressed="${state.selectedCategory === category}" class="category-tab-btn${state.selectedCategory === category ? " active font-black text-neutral-950" : " text-neutral-500"} min-h-[44px] px-3.5 py-2 transition-colors" data-category="${escapeHtml(category)}"><i class="fa-solid ${iconFor(category)} mr-1" aria-hidden="true"></i> ${escapeHtml(category.toLocaleUpperCase("es-MX"))}</button>`).join("")}<button aria-pressed="${state.selectedCategory === "ofertas"}" class="category-tab-btn${state.selectedCategory === "ofertas" ? " active font-black text-neutral-950" : " text-red-700"} min-h-[44px] px-3.5 py-2 transition-colors" data-category="ofertas"><i class="fa-solid fa-fire mr-1" aria-hidden="true"></i> OFERTAS</button><span class="category-active-indicator" aria-hidden="true"></span>`;
    categoryIndicator = categoryNav.querySelector(".category-active-indicator");
    moveCategoryIndicator(false);
  };

  const mobileScrollRevealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" })
    : null;
  document.body.classList.add("mobile-scroll-reveal-ready");
  const observeMobileScrollReveals = (scope = document) => {
    const elements = scope.querySelectorAll?.(".mobile-scroll-reveal:not([data-reveal-observed])") || [];
    elements.forEach((element, index) => {
      element.dataset.revealObserved = "true";
      element.style.setProperty("--reveal-delay", `${Math.min(index * 48, 96)}ms`);
      if (!mobileScrollRevealObserver || reducedMotionQuery.matches) {
        element.classList.add("is-visible");
      } else {
        mobileScrollRevealObserver.observe(element);
      }
    });
  };
  observeMobileScrollReveals();

  // Elementos Modal
  const productModal = document.getElementById("productModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalMainImg = document.getElementById("modalMainImg");
  const modalThumbs = document.getElementById("modalThumbs");
  const modalCategoryBadge = document.getElementById("modalCategoryBadge");
  const modalBrand = document.getElementById("modalBrand");
  const modalSku = document.getElementById("modalSku");
  const modalGender = document.getElementById("modalGender");
  const modalStockStatus = document.getElementById("modalStockStatus");
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
  const btnModalWhatsappLabel = document.getElementById("btnModalWhatsappLabel");
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
  let modalOriginImage = null;
  let modalImageFlight = null;

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

  const normalizeCategoryKey = (value) => String(value ?? "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-MX");

  const getMobileCategoryGroup = (product) => {
    const category = String(product.category || "Otros").trim();
    const categoryKey = normalizeCategoryKey(category);
    const productType = String(product.details?.type || "").trim();
    const typeKey = normalizeCategoryKey(productType);

    if (categoryKey === "accesorios" && /lentes?/.test(typeKey)) {
      return { id: "accesorios-lentes", label: "Lentes", category, type: productType };
    }
    if (categoryKey === "accesorios" && /pulseras?/.test(typeKey)) {
      return { id: "accesorios-pulseras", label: "Pulseras", category, type: productType };
    }

    const labels = {
      perfumes: "Perfumes",
      calzado: "Calzado",
      ropa: "Ropa",
      accesorios: "Accesorios"
    };
    return {
      id: `categoria-${categoryKey.replace(/[^a-z0-9]+/g, "-")}`,
      label: labels[categoryKey] || category,
      category,
      type: ""
    };
  };

  const renderMobileCategoryCards = () => {
    if (!mobileCategoryGrid) return;
    mobileCategoryGroups.clear();

    for (const product of state.products) {
      const group = getMobileCategoryGroup(product);
      if (!mobileCategoryGroups.has(group.id)) mobileCategoryGroups.set(group.id, { ...group, products: [] });
      mobileCategoryGroups.get(group.id).products.push(product);
    }

    const priority = { perfumes: 0, calzado: 1, lentes: 2, pulseras: 3, ropa: 4, accesorios: 5 };
    const groups = [...mobileCategoryGroups.values()].sort((a, b) => {
      const aPriority = priority[normalizeCategoryKey(a.label)] ?? 10;
      const bPriority = priority[normalizeCategoryKey(b.label)] ?? 10;
      return aPriority - bPriority || a.label.localeCompare(b.label, "es-MX");
    });

    if (!groups.length) {
      mobileCategoryGrid.innerHTML = `<p class="mobile-category-empty">El catálogo se está preparando.</p>`;
      return;
    }
    if (state.mobileCategoryGroupId && !mobileCategoryGroups.has(state.mobileCategoryGroupId)) {
      state.mobileCategoryGroupId = null;
      state.selectedCategory = "all";
      showMobileCategoryHome();
    }

    mobileCategoryGrid.innerHTML = groups.map((group) => {
      const representative = group.products.find((product) => product.featured && product.images?.length)
        || group.products.find((product) => product.images?.length)
        || group.products[0];
      const rawImage = representative.images?.[0] || "/assets/logo.png";
      const image = representative.id === "sauvage-extrain-ef27ec" && rawImage.startsWith("https://www.bing.com/images/search")
        ? "/assets/products/sauvage-extrain.jpg"
        : rawImage;

      return `
        <button type="button" class="mobile-category-card mobile-scroll-reveal" data-mobile-category="${escapeHtml(group.id)}" aria-label="Abrir categoría ${escapeHtml(group.label)}">
          <span class="mobile-category-image"><img src="${escapeHtml(image)}" alt="" loading="lazy" /></span>
          <span class="mobile-category-card-label"><span>${escapeHtml(group.label)}</span><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></span>
        </button>
      `;
    }).join("");
    observeMobileScrollReveals(mobileCategoryGrid);
  };

  // 2. Filtrado y ordenamiento de productos
  const applyFilters = () => {
    let result = [...state.products];

    // La vista móvil agrupa por categoría y, en accesorios, separa lentes/pulseras.
    if (state.mobileCategoryGroupId && window.matchMedia("(max-width: 767px)").matches) {
      result = result.filter((product) => getMobileCategoryGroup(product).id === state.mobileCategoryGroupId);
    // Filtro por categoría
    } else if (state.selectedCategory !== "all") {
      if (state.selectedCategory === "ofertas") {
        result = result.filter((p) => p.onSale);
      } else {
        const selectedKey = state.selectedCategory.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-MX");
        result = result.filter((product) => {
          const categoryKey = String(product.category || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-MX");
          if (categoryKey === selectedKey) return true;
          return selectedKey === "lentes" && categoryKey === "accesorios" && /lentes?/.test(`${product.details?.type || ""} ${product.name}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-MX"));
        });
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

    // Ordena por marca y después por nombre para mantener juntas las marcas.
    const compareAlphabetically = (left, right) => String(left ?? "").localeCompare(String(right ?? ""), "es-MX", {
      sensitivity: "base",
      numeric: true
    });
    result.sort((a, b) => compareAlphabetically(a.brand, b.brand)
      || compareAlphabetically(a.name, b.name)
      || compareAlphabetically(a.id, b.id));

    const productsByBrand = new Map();
    result.forEach((product, index) => {
      const normalizedBrand = normalizeCategoryKey(product.brand);
      const groupKey = normalizedBrand ? `brand:${normalizedBrand}` : `without-brand:${index}`;
      if (!productsByBrand.has(groupKey)) productsByBrand.set(groupKey, []);
      productsByBrand.get(groupKey).push(product);
    });
    result = [...productsByBrand.values()].flat();

    state.filteredProducts = result;
    renderProducts();
  };

  // 3. Renderizar productos con cascada de Anime.js y tipografía Imagen 2
  const syncMobileSearchResults = () => {
    if (!mobileSearchResults || !productsGrid) return;
    const searchCards = Array.from(productsGrid.children, (card) => card.cloneNode(true));
    searchCards.forEach((card) => {
      const resetButton = card.querySelector("#btnResetFilters");
      if (resetButton) resetButton.id = "mobileSearchResetFilters";
    });
    mobileSearchResults.replaceChildren(...searchCards);

    const query = searchInputMobile?.value.trim() || "";
    if (mobileSearchClear) mobileSearchClear.hidden = !query;
    if (!mobileSearchSuggestions) return;
    const suggestions = new Set();
    const normalizedQuery = normalizeCategoryKey(query);
    if (normalizedQuery) {
      for (const product of state.filteredProducts) {
        const gender = String(product.gender || "").trim();
        const phrase = gender ? `${product.category} para ${gender}` : product.category;
        if (normalizeCategoryKey(phrase).includes(normalizedQuery)) suggestions.add(phrase);
        if (normalizeCategoryKey(product.brand).includes(normalizedQuery)) suggestions.add(product.brand);
        if (suggestions.size >= 4) break;
      }
    }
    mobileSearchSuggestions.hidden = suggestions.size === 0;
    mobileSearchSuggestions.innerHTML = [...suggestions].map((suggestion) =>
      `<button type="button" class="mobile-search-suggestion" data-search-suggestion="${escapeHtml(suggestion)}">${escapeHtml(suggestion)}</button>`
    ).join("");
  };

  const renderProducts = () => {
    productsCountEl.textContent = `${state.filteredProducts.length} DISPONIBLES`;
    if (mobileCategoryCount) {
      const count = state.filteredProducts.length;
      mobileCategoryCount.textContent = `${count} ${count === 1 ? "producto" : "productos"}`;
    }

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
      syncMobileSearchResults();
      return;
    }

    productsGrid.innerHTML = state.filteredProducts
      .map((product) => {
        const hasDiscount = Number(product.regularPrice) > Number(product.offerPrice);
        const discountPercent = hasDiscount
          ? Math.round(((Number(product.regularPrice) - Number(product.offerPrice)) / Number(product.regularPrice)) * 100)
          : 0;
        const imagePath = product.images?.[0] || "assets/logo.png";
        const productImage = product.id === "sauvage-extrain-ef27ec" && imagePath.startsWith("https://www.bing.com/images/search")
          ? "/assets/products/sauvage-extrain.jpg"
          : imagePath;

        const unavailable = /agotado|sin stock|no disponible/i.test(product.stockStatus || "");

        return `
        <article class="product-card-anim product-card group" data-id="${escapeHtml(product.id)}">
          <div class="product-card-media">
            <button type="button" class="product-image-trigger" data-id="${escapeHtml(product.id)}" aria-label="Ver detalles de ${escapeHtml(product.name)}">
              <img src="${escapeHtml(productImage)}" alt="" loading="lazy" />
            </button>
            <div class="product-card-badges" aria-label="Etiquetas del producto">
              ${product.onSale ? `<span class="product-badge product-badge-sale">${hasDiscount ? `-${discountPercent}%` : "Oferta"}</span>` : ""}
              ${product.isNew ? `<span class="product-badge product-badge-new">Nuevo</span>` : ""}
            </div>
            ${product.featured ? `<span class="product-badge product-badge-featured">Selección DM</span>` : ""}
            <span class="product-image-prompt" aria-hidden="true">Ver producto <i class="fa-solid fa-arrow-up-right-from-square"></i></span>
          </div>

          <div class="product-card-copy">
            <div class="product-card-heading">
              <p class="product-card-brand">${escapeHtml(product.brand)}</p>
              <span class="product-card-category">${escapeHtml(product.category)}</span>
            </div>
            <h3 class="product-card-title" title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</h3>
            <div class="product-card-price">
              <span>${formatPrice(product.offerPrice)}</span>
              ${product.onSale && hasDiscount ? `<span class="product-card-regular-price">${formatPrice(product.regularPrice)}</span>` : ""}
            </div>
            <div class="product-card-actions">
              <button type="button" class="btn-open-detail" data-id="${escapeHtml(product.id)}">Ver detalles</button>
              <button type="button" class="btn-quick-wa" data-id="${escapeHtml(product.id)}" aria-label="${unavailable ? "Consultar disponibilidad de" : "Pedir"} ${escapeHtml(product.name)} por WhatsApp">${unavailable ? "Consultar" : "Pedir"}</button>
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
    document.querySelectorAll(".product-image-trigger").forEach((button) => {
      button.addEventListener("click", () => {
        openProductModal(button.getAttribute("data-id"), button.querySelector("img"));
      });
    });

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
    syncMobileSearchResults();
  };

  const showMobileCategoryHome = () => {
    catalogSection?.classList.remove("mobile-category-open");
    if (mobileCategoryHome) mobileCategoryHome.hidden = false;
    if (mobileCategoryResultsHeader) mobileCategoryResultsHeader.hidden = true;
    if (mobileFilterToggle) mobileFilterToggle.setAttribute("aria-expanded", "false");
    catalogControls?.classList.remove("filters-open");
  };

  const showMobileProductList = (title) => {
    catalogSection?.classList.add("mobile-category-open");
    if (mobileCategoryHome) mobileCategoryHome.hidden = true;
    if (mobileCategoryResultsHeader) mobileCategoryResultsHeader.hidden = false;
    if (mobileCategoryTitle) mobileCategoryTitle.textContent = title;
  };

  const closeMobileSearch = ({ restoreFocus = false } = {}) => {
    const wasOpen = mobileSearchOverlay?.classList.contains("is-open");
    mobileSearchOverlay?.classList.remove("is-open");
    mobileSearchOverlay?.setAttribute("aria-hidden", "true");
    if (mobileSearchOverlay) mobileSearchOverlay.inert = true;
    document.body.classList.remove("mobile-search-active");
    storeHeader?.classList.remove("is-search-open");
    compactSearchToggles.forEach((button) => button.setAttribute("aria-expanded", "false"));
    if (wasOpen) {
      state.searchQuery = "";
      if (searchInputMobile) searchInputMobile.value = "";
      if (state.mobileCategoryGroupId) showMobileProductList(mobileCategoryGroups.get(state.mobileCategoryGroupId)?.label || "Productos");
      else showMobileCategoryHome();
      applyFilters();
      if (restoreFocus) document.querySelector(".mobile-search-toggle")?.focus({ preventScroll: true });
    }
  };

  const openMobileSearch = () => {
    if (!mobileSearchOverlay) return;
    state.mobileCategoryGroupId = null;
    state.selectedCategory = "all";
    state.selectedBrand = "all";
    state.searchQuery = "";
    state.onlySale = false;
    if (searchInputMobile) searchInputMobile.value = "";
    if (brandSelect) brandSelect.value = "all";
    if (saleOnlyCheckbox) saleOnlyCheckbox.checked = false;
    updateCategoryControls("all");
    showMobileCategoryHome();
    mobileSearchOverlay.inert = false;
    mobileSearchOverlay.setAttribute("aria-hidden", "false");
    mobileSearchOverlay.classList.add("is-open");
    document.body.classList.add("mobile-search-active");
    compactSearchToggles.forEach((button) => button.setAttribute("aria-expanded", String(button.classList.contains("mobile-search-toggle"))));
    applyFilters();
    searchInputMobile?.focus({ preventScroll: true });
  };

  mobileSearchClose?.addEventListener("click", () => closeMobileSearch({ restoreFocus: true }));
  mobileSearchClear?.addEventListener("click", () => {
    if (!searchInputMobile) return;
    searchInputMobile.value = "";
    handleSearch("");
    searchInputMobile.focus({ preventScroll: true });
  });

  const openMobileCategory = (groupId) => {
    const group = mobileCategoryGroups.get(groupId);
    if (!group) return;

    state.mobileCategoryGroupId = group.id;
    state.selectedCategory = group.category;
    state.selectedBrand = "all";
    state.searchQuery = "";
    state.onlySale = false;
    if (searchInput) searchInput.value = "";
    if (searchInputMobile) searchInputMobile.value = "";
    brandSelect.value = "all";
    saleOnlyCheckbox.checked = false;
    updateCategoryControls(group.category);
    closeMobileSearch();
    showMobileProductList(group.label);
    animateNextCategoryRender = true;
    applyFilters();
  };

  mobileCategoryGrid?.addEventListener("click", (event) => {
    const card = event.target.closest("[data-mobile-category]");
    if (card) openMobileCategory(card.getAttribute("data-mobile-category"));
  });

  mobileCategoryBack?.addEventListener("click", () => {
    state.mobileCategoryGroupId = null;
    state.selectedCategory = "all";
    state.selectedBrand = "all";
    state.searchQuery = "";
    state.onlySale = false;
    if (searchInput) searchInput.value = "";
    if (searchInputMobile) searchInputMobile.value = "";
    brandSelect.value = "all";
    saleOnlyCheckbox.checked = false;
    updateCategoryControls("all");
    showMobileCategoryHome();
    closeMobileSearch();
    applyFilters();
    mobileCategoryHome?.scrollIntoView({ behavior: prefersReducedMotion ? "instant" : "smooth", block: "start" });
  });

  // 4. Modal de Detalle Interactivo con animación suave Anime.js
  const flyProductImage = (fromElement, toElement) => {
    if (prefersReducedMotion || !fromElement?.isConnected || !toElement?.isConnected) return;
    const flightElement = modalImageFlight?.clone || fromElement;
    const fromBounds = flightElement.getBoundingClientRect();
    const toBounds = toElement.getBoundingClientRect();
    if (!fromBounds.width || !toBounds.width) return;

    let clone = modalImageFlight?.clone;
    if (modalImageFlight) {
      modalImageFlight.animation.cancel();
      clone.style.left = `${fromBounds.left}px`;
      clone.style.top = `${fromBounds.top}px`;
      clone.style.width = `${fromBounds.width}px`;
      clone.style.height = `${fromBounds.height}px`;
      clone.style.transform = "none";
    } else {
      clone = flightElement.cloneNode(false);
      clone.removeAttribute("id");
      clone.alt = "";
      clone.setAttribute("aria-hidden", "true");
      clone.src = flightElement.currentSrc || flightElement.src;
      Object.assign(clone.style, {
        position: "fixed",
        zIndex: "80",
        left: `${fromBounds.left}px`,
        top: `${fromBounds.top}px`,
        width: `${fromBounds.width}px`,
        height: `${fromBounds.height}px`,
        margin: "0",
        objectFit: "cover",
        borderRadius: "16px",
        pointerEvents: "none",
        transformOrigin: "top left",
        willChange: "transform"
      });
      document.body.append(clone);
    }

    modalMainImg.style.opacity = "0";
    const dx = toBounds.left - fromBounds.left;
    const dy = toBounds.top - fromBounds.top;
    const scale = toBounds.width / fromBounds.width;
    const animation = clone.animate(
      [
        { transform: "translate3d(0, 0, 0) scale(1)" },
        { transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})` }
      ],
      { duration: 300, easing: "cubic-bezier(0.32, 0.72, 0, 1)" }
    );
    modalImageFlight = { clone, animation };
    animation.onfinish = () => {
      if (modalImageFlight?.animation !== animation) return;
      clone.remove();
      modalImageFlight = null;
      modalMainImg.style.opacity = "";
    };
    animation.oncancel = () => {
      if (modalImageFlight?.animation === animation) modalImageFlight = null;
    };
  };

  const openProductModal = (productId, originImage = null) => {
    const prod = state.products.find((p) => p.id === productId);
    if (!prod) return;

    if (modalImageFlight) {
      modalImageFlight.animation.cancel();
      modalImageFlight.clone.remove();
      modalImageFlight = null;
    }
    modalMainImg.style.opacity = "";
    modalOriginImage = originImage;

    state.activeProduct = prod;
    state.selectedSize = prod.sizes[0];
    state.selectedColor = prod.colors[0]?.name || "Estándar";
    state.quantity = 1;
    state.lastModalPrice = prod.offerPrice;

    // Llenar contenido
    modalCategoryBadge.textContent = prod.category.toUpperCase();
    modalBrand.textContent = prod.brand;
    modalSku.textContent = `CÓD: ${prod.id}`;
    modalGender.textContent = prod.gender || "";
    modalGender.hidden = !prod.gender;
    modalStockStatus.textContent = prod.stockStatus || "Consultar disponibilidad";
    modalStockStatus.classList.toggle("is-low-stock", /últimas|pocas/i.test(prod.stockStatus || ""));
    const unavailable = /agotado|sin stock|no disponible/i.test(prod.stockStatus || "");
    modalStockStatus.classList.toggle("is-unavailable", unavailable);
    const isMobileView = window.matchMedia("(max-width: 767px)").matches;
    btnModalWhatsappLabel.textContent = unavailable
      ? "Consultar disponibilidad"
      : isMobileView ? "Cotizar por WhatsApp" : "Pedir por WhatsApp";
    modalTitle.textContent = prod.name;
    modalPriceCurrent.textContent = formatPrice(prod.offerPrice);
    modalPriceRegular.textContent = prod.onSale && Number(prod.regularPrice) > Number(prod.offerPrice) ? formatPrice(prod.regularPrice) : "";
    modalDesc.textContent = prod.description;
    qtyDisplay.textContent = state.quantity;
    modalTotalDisplay.textContent = formatPrice(prod.offerPrice);

    // Galería
    const primaryImage = prod.id === "sauvage-extrain-ef27ec" && prod.images?.[0]?.startsWith("https://www.bing.com/images/search")
      ? "/assets/products/sauvage-extrain.jpg"
      : prod.images?.[0] || "assets/logo.png";
    modalMainImg.src = primaryImage;
    modalMainImg.alt = prod.name;
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

    if (originImage) flyProductImage(originImage, modalMainImg);
  };

  const closeProductModal = () => {
    const imageOrigin = modalOriginImage;
    if (imageOrigin?.isConnected && !prefersReducedMotion) {
      flyProductImage(modalImageFlight?.clone || modalMainImg, imageOrigin);
    } else if (modalImageFlight) {
      modalImageFlight.animation.cancel();
      modalImageFlight.clone.remove();
      modalImageFlight = null;
      modalMainImg.style.opacity = "";
    }
    productModal.classList.remove("active");
    productModal.setAttribute("aria-hidden", "true");
    productModal.inert = true;
    document.body.style.overflow = "";
    state.activeProduct = null;
    modalOriginImage = null;
    if (previouslyFocusedElement instanceof HTMLElement) previouslyFocusedElement.focus();
    previouslyFocusedElement = null;
  };

  mobileSearchSuggestions?.addEventListener("click", (event) => {
    const suggestion = event.target.closest("[data-search-suggestion]");
    if (!suggestion || !searchInputMobile) return;
    searchInputMobile.value = suggestion.getAttribute("data-search-suggestion");
    handleSearch(searchInputMobile.value);
    searchInputMobile.focus({ preventScroll: true });
  });
  mobileSearchResults?.addEventListener("click", (event) => {
    const imageButton = event.target.closest(".product-image-trigger");
    if (imageButton) {
      openProductModal(imageButton.getAttribute("data-id"), imageButton.querySelector("img"));
      return;
    }
    const detailButton = event.target.closest(".btn-open-detail");
    if (detailButton) {
      openProductModal(detailButton.getAttribute("data-id"));
      return;
    }
    const whatsappButton = event.target.closest(".btn-quick-wa");
    if (whatsappButton) {
      const product = state.products.find((item) => item.id === whatsappButton.getAttribute("data-id"));
      if (product) sendDirectWhatsApp(product, product.sizes[0], product.colors[0]?.name || "Estándar", 1);
      return;
    }
    if (event.target.closest("#mobileSearchResetFilters")) {
      if (searchInputMobile) searchInputMobile.value = "";
      handleSearch("");
    }
  });

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
        : mobileSearchOverlay?.classList.contains("is-open")
          ? mobileSearchOverlay
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
    categoryNav?.querySelectorAll(".category-tab-btn").forEach((tab) => {
      const selected = tab.getAttribute("data-category") === category;
      tab.classList.toggle("active", selected);
      tab.classList.toggle("font-black", selected);
      tab.classList.toggle("text-neutral-950", selected);
      tab.classList.toggle("text-neutral-500", !selected && category !== "ofertas");
      tab.setAttribute("aria-pressed", String(selected));
    });
    if (categorySelectMobile) categorySelectMobile.value = category;
    moveCategoryIndicator(true);
  };

  const setCategory = (category) => {
    animateNextCategoryRender = state.selectedCategory !== category;
    state.mobileCategoryGroupId = null;
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
    scrollToCatalog(scrollBehavior);
    setCategory(category);
  };

  categoryNav?.addEventListener("click", (event) => {
    const tab = event.target.closest(".category-tab-btn");
    if (tab) {
      const behavior = event.detail > 0 && !prefersReducedMotion ? "smooth" : "instant";
      changeCategory(tab.getAttribute("data-category"), behavior);
    }
  });
  mobileFilterToggle?.addEventListener("click", () => {
    const open = mobileFilterToggle.getAttribute("aria-expanded") !== "true";
    mobileFilterToggle.setAttribute("aria-expanded", String(open));
    catalogControls?.classList.toggle("filters-open", open);
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

  saleOnlyCheckbox.addEventListener("change", (e) => {
    state.onlySale = e.target.checked;
    animateNextCatalogRender = true;
    applyFilters();
  });

  const handleSearch = (val) => {
    state.searchQuery = val;
    if (searchInput) searchInput.value = val;
    if (searchInputMobile) searchInputMobile.value = val;
    if (window.matchMedia("(max-width: 767px)").matches && !state.mobileCategoryGroupId) {
      if (val.trim()) showMobileProductList("Resultados");
      else showMobileCategoryHome();
    }
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
    state.mobileCategoryGroupId = null;
    state.selectedCategory = "all";
    if (categorySelectMobile) categorySelectMobile.value = "all";
    state.selectedBrand = "all";
    state.searchQuery = "";
    state.onlySale = false;

    if (searchInput) searchInput.value = "";
    if (searchInputMobile) searchInputMobile.value = "";
    brandSelect.value = "all";
    saleOnlyCheckbox.checked = false;
    if (mobileFilterToggle) mobileFilterToggle.setAttribute("aria-expanded", "false");
    catalogControls?.classList.remove("filters-open");
    showMobileCategoryHome();

    updateCategoryControls("all");

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
          heroLogo.style.setProperty("--logo-tilt-x", `${-y * 12}deg`);
          heroLogo.style.setProperty("--logo-tilt-y", `${x * 14}deg`);
          heroLogo.style.setProperty("--logo-shift-x", `${x * 14}px`);
          heroLogo.style.setProperty("--logo-shift-y", `${y * 12}px`);
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
          heroLogo.style.setProperty("--logo-shift-x", "0px");
          heroLogo.style.setProperty("--logo-shift-y", "0px");
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
    renderDesktopCategoryTabs();
    renderMobileCategoryCards();
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
