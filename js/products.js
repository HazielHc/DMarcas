// Catálogo oficial de Diversas Marcas (Tepic, Nayarit)
// Moneda en Pesos Mexicanos ($ MXN)
export const PRODUCTS = [
  // ================= PERFUMES =================
  {
    id: "PERF-001",
    name: "Perfume Bad Boy Eau de Toilette",
    brand: "Carolina Herrera",
    category: "Perfumes",
    gender: "Hombre",
    regularPrice: 2850,
    offerPrice: 2199,
    onSale: true,
    isNew: true,
    featured: true,
    stockStatus: "En stock",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["100 ml", "150 ml"],
    colors: [
      { name: "Edición Clásica Rayo Negro", hex: "#111827" }
    ],
    description: "Una fragancia oriental especiada y atrevida, que redefine el concepto de masculinidad moderna con notas de pimienta negra y blanca, cedro y haba tonka.",
    features: [
      "Presentación sellada con código de lote",
      "Familia olfativa: Oriental Especiada",
      "Notas de salida: Pimienta blanca, bergamota verde italiana",
      "Notas de fondo: Haba tonka y absoluto de cacao"
    ]
  },
  {
    id: "PERF-002",
    name: "Perfume Good Girl Eau de Parfum",
    brand: "Carolina Herrera",
    category: "Perfumes",
    gender: "Mujer",
    regularPrice: 3100,
    offerPrice: 2399,
    onSale: true,
    isNew: false,
    featured: true,
    stockStatus: "Últimas unidades",
    rating: 5.0,
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["80 ml", "100 ml"],
    colors: [
      { name: "Frasco Tacón Azul Medianoche", hex: "#1E1B4B" }
    ],
    description: "El icónico tacón de aguja. Una fragancia audaz y sofisticada que combina la luminosidad del nardo y el jazmín con la adicción del cacao y el café.",
    features: [
      "Presentación de diseño floral",
      "Familia olfativa: Oriental Floral",
      "Fijación prolongada de hasta 10-12 horas",
      "Presentación icónica en forma de stiletto"
    ]
  },
  {
    id: "PERF-003",
    name: "Perfume Sauvage Eau de Parfum",
    brand: "Dior",
    category: "Perfumes",
    gender: "Hombre",
    regularPrice: 3450,
    offerPrice: 2799,
    onSale: true,
    isNew: false,
    featured: true,
    stockStatus: "En stock",
    rating: 5.0,
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527632984437-993ac400b64d?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["100 ml", "200 ml"],
    colors: [
      { name: "Frasco Azul Degradado", hex: "#0F172A" }
    ],
    description: "Inspirado en el desierto en la hora mágica del crepúsculo. Sauvage EDP despliega facetas sensuales y misteriosas dominadas por la bergamota de Calabria y el ambroxan.",
    features: [
      "Notas de bergamota, pimienta y vainilla",
      "Proyección y estela de alto impacto",
      "Notas olfativas: Bergamota de Reggio, pimienta de Sichuan, vainilla de Papúa Nueva Guinea"
    ]
  },
  {
    id: "PERF-004",
    name: "Perfume 1 Million Eau de Toilette",
    brand: "Paco Rabanne",
    category: "Perfumes",
    gender: "Hombre",
    regularPrice: 2650,
    offerPrice: 1999,
    onSale: true,
    isNew: false,
    featured: true,
    stockStatus: "En stock",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["100 ml", "200 ml"],
    colors: [
      { name: "Lingote Dorado", hex: "#D97706" }
    ],
    description: "El perfume del éxito seductor. El lingote de oro más famoso de la perfumería mundial con acordes de cuero especiado, mandarina roja y canela.",
    features: [
      "Notas de canela, cuero, ámbar y menta",
      "Aroma seductor y fiestero de máxima duración",
      "Notas de canela, cuero rubio, ámbar y menta piperita"
    ]
  },
  {
    id: "PERF-005",
    name: "Perfume Versace Eros Eau de Parfum",
    brand: "Versace",
    category: "Perfumes",
    gender: "Hombre",
    regularPrice: 2750,
    offerPrice: 2099,
    onSale: true,
    isNew: true,
    featured: false,
    stockStatus: "En stock",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["100 ml"],
    colors: [
      { name: "Azul Turquesa Medusa", hex: "#0284C7" }
    ],
    description: "Amor, pasión, belleza y deseo. Una fragancia luminosa y vibrante con aceite de menta, manzana caramelizada y cedro del Atlas.",
    features: [
      "Diseño de la colección",
      "Aroma dulce, fresco y altamente magnético",
      "Diseño icónico con la greca y el relieve de Medusa Versace"
    ]
  },

  // ================= CALZADO =================
  {
    id: "CALZ-001",
    name: "Tenis Nike Air Max SC Retro",
    brand: "Nike",
    category: "Calzado",
    gender: "Unisex",
    regularPrice: 2299,
    offerPrice: 1699,
    onSale: true,
    isNew: false,
    featured: true,
    stockStatus: "En stock",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["25 MX", "26 MX", "27 MX", "27.5 MX", "28 MX", "29 MX"],
    colors: [
      { name: "Rojo / Blanco", hex: "#EF4444" },
      { name: "Negro Total", hex: "#111827" }
    ],
    description: "Líneas clásicas de atletismo con amortiguación Air visible. Combina piel genuina, textil y malla para máxima comodidad en el día a día.",
    features: [
      "Cámara Air Max visible en el talón",
      "Materiales duraderos y transpirables",
      "Incluye caja de presentación Nike",
      "Tallas estándar mexicanas"
    ]
  },
  {
    id: "CALZ-002",
    name: "Tenis Adidas Forum Low Urban",
    brand: "Adidas",
    category: "Calzado",
    gender: "Unisex",
    regularPrice: 2199,
    offerPrice: 1749,
    onSale: true,
    isNew: true,
    featured: true,
    stockStatus: "En stock",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["25.5 MX", "26 MX", "27 MX", "28 MX", "28.5 MX"],
    colors: [
      { name: "Blanco / Azul Royal", hex: "#2563EB" },
      { name: "Blanco / Negro", hex: "#18181B" }
    ],
    description: "El calzado que dominó las canchas de baloncesto en los 80 regresa como ícono supremo de la moda urbana con su correa de velcro clásica.",
    features: [
      "Piel suave prémium con las 3 bandas Adidas",
      "Correa de ajuste autoadherente desmontable",
      "Suela tipo cupsole cosida de alta resistencia"
    ]
  },
  {
    id: "CALZ-003",
    name: "Tenis New Balance 574 Core Classic",
    brand: "New Balance",
    category: "Calzado",
    gender: "Unisex",
    regularPrice: 2099,
    offerPrice: 1599,
    onSale: true,
    isNew: false,
    featured: false,
    stockStatus: "En stock",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["26 MX", "26.5 MX", "27 MX", "27.5 MX", "28 MX"],
    colors: [
      { name: "Gris Heritage", hex: "#6B7280" },
      { name: "Azul Marino", hex: "#1E3A8A" }
    ],
    description: "El modelo más emblemático de New Balance. Brinda comodidad insuperable gracias a la amortiguación de entresuela ENCAP.",
    features: [
      "Gamuza prémium y malla transpirable",
      "Tecnología ENCAP para soporte duradero",
      "Diseño de la colección"
    ]
  },

  // ================= ROPA =================
  {
    id: "ROPA-001",
    name: "Playera Polo Clásica Tommy Hilfiger",
    brand: "Tommy Hilfiger",
    category: "Ropa",
    gender: "Hombre",
    regularPrice: 1550,
    offerPrice: 999,
    onSale: true,
    isNew: true,
    featured: true,
    stockStatus: "Últimas unidades",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["CH (S)", "M", "G (L)", "XG (XL)"],
    colors: [
      { name: "Azul Marino", hex: "#1E3A8A" },
      { name: "Blanco", hex: "#F8FAFC" },
      { name: "Rojo Tommy", hex: "#DC2626" }
    ],
    description: "Polo de piqué en puro algodón orgánico con corte regular fit y el inconfundible logo de la bandera bordado en el pecho.",
    features: [
      "100% Algodón piqué prémium",
      "Cuello acanalado y dos botones de nácar",
      "Logotipo bandera bordado de alta precisión"
    ]
  },
  {
    id: "ROPA-002",
    name: "Jeans Levi's 511 Slim Fit Stretch",
    brand: "Levi's",
    category: "Ropa",
    gender: "Hombre",
    regularPrice: 1699,
    offerPrice: 1199,
    onSale: true,
    isNew: false,
    featured: true,
    stockStatus: "En stock",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["30x32", "32x32", "34x32", "36x32"],
    colors: [
      { name: "Azul Índigo Clásico", hex: "#1D4ED8" },
      { name: "Negro Lavado", hex: "#374151" }
    ],
    description: "Corte moderno ajustado sin apretar. Tela con tecnología Levi's Flex para máxima elasticidad y confort en movimiento.",
    features: [
      "99% Algodón, 1% Elastano con Levi's Flex",
      "Remaches de cobre y bolsillo clásico Red Tab",
      "Cremallera metálica reforzada"
    ]
  },
  {
    id: "ROPA-003",
    name: "Hoodie Calvin Klein Monograma Jeans",
    brand: "Calvin Klein",
    category: "Ropa",
    gender: "Unisex",
    regularPrice: 1899,
    offerPrice: 1399,
    onSale: true,
    isNew: false,
    featured: false,
    stockStatus: "En stock",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Negro", hex: "#18181B" },
      { name: "Gris Jaspe", hex: "#9CA3AF" }
    ],
    description: "Sudadera cerrada con gorro en felpa de algodón afelpado, cómoda, abrigadora y con el monograma CK icónico estampado en el pecho.",
    features: [
      "Felpa interior suave al tacto",
      "Bolsillo tipo canguro frontal",
      "Cordones ajustables gruesos"
    ]
  },
  {
    id: "ROPA-004",
    name: "Playera Deportiva Adidas Trefoil Originals",
    brand: "Adidas",
    category: "Ropa",
    gender: "Unisex",
    regularPrice: 799,
    offerPrice: 549,
    onSale: true,
    isNew: true,
    featured: false,
    stockStatus: "En stock",
    rating: 4.7,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Blanco / Logo Negro", hex: "#FFFFFF" },
      { name: "Negro / Logo Blanco", hex: "#000000" }
    ],
    description: "Playera clásica de cuello redondo con el icónico trébol de Adidas Originals. Fresca, ligera y esencial para cualquier atuendo diario.",
    features: [
      "100% Algodón de tacto ultrasuave",
      "Estampado serigráfico de alta duración",
      "Corte regular estándar"
    ]
  },

  // ================= ACCESORIOS =================
  {
    id: "ACC-001",
    name: "Lentes de Sol Ray-Ban Wayfarer Classic",
    brand: "Ray-Ban",
    category: "Accesorios",
    gender: "Unisex",
    regularPrice: 3200,
    offerPrice: 2299,
    onSale: true,
    isNew: false,
    featured: true,
    stockStatus: "Últimas unidades",
    rating: 5.0,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Estándar (50mm)", "Grande (54mm)"],
    colors: [
      { name: "Negro Brillante / Lente Verde G-15", hex: "#111827" },
      { name: "Carey Havana / Café", hex: "#78350F" }
    ],
    description: "El modelo más legendario de la historia de los lentes de sol, representado en nuestro logo de Diversas Marcas. Protección 100% UV con cristales G-15.",
    features: [
      "Armazón con grabado «RB» y diseño Wayfarer",
      "Protección UV400 contra rayos UVA/UVB",
      "Incluye estuche de cuero, paño de microfibra y folleto"
    ]
  },
  {
    id: "ACC-002",
    name: "Gorra Nike Heritage86 Swoosh",
    brand: "Nike",
    category: "Accesorios",
    gender: "Unisex",
    regularPrice: 650,
    offerPrice: 480,
    onSale: true,
    isNew: true,
    featured: true,
    stockStatus: "En stock",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Unitalla (Ajustable)"],
    colors: [
      { name: "Negro", hex: "#111827" },
      { name: "Blanco", hex: "#F3F4F6" },
      { name: "Azul Marino", hex: "#1E3A8A" }
    ],
    description: "Gorra de 6 paneles en sarga de algodón suave con el logo metálico Swoosh de Nike en el lateral frontal. Como la del logo de Diversas Marcas.",
    features: [
      "Tejido de sarga 100% algodón",
      "Cierre trasero deslizable con hebilla metálica",
      "Ojales bordados para frescura total"
    ]
  },
  {
    id: "ACC-003",
    name: "Cartera Bifold Tommy Hilfiger Leather",
    brand: "Tommy Hilfiger",
    category: "Accesorios",
    gender: "Hombre",
    regularPrice: 999,
    offerPrice: 699,
    onSale: true,
    isNew: false,
    featured: false,
    stockStatus: "En stock",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Estándar"],
    colors: [
      { name: "Negro con Franja Hilfiger", hex: "#111827" },
      { name: "Café Chocolate", hex: "#78350F" }
    ],
    description: "Cartera elegante de piel auténtica con la distintiva franja tricolor y compartimento para múltiples tarjetas y billetes.",
    features: [
      "100% Cuero genuino vacuno",
      "Protección RFID contra clonación de tarjetas",
      "Incluye caja de regalo Tommy Hilfiger"
    ]
  }
];
