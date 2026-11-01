const perfume = ({ id, name, brand, gender, price, image, family, concentration = "Eau de parfum", segment, description }) => ({
  id,
  name,
  brand,
  category: "Perfumes",
  gender,
  regularPrice: price,
  offerPrice: price,
  onSale: false,
  isNew: true,
  featured: false,
  stockStatus: "En stock",
  rating: 0,
  images: [image],
  sizes: ["100 ml"],
  colors: [],
  details: {
    type: concentration,
    material: "",
    fragranceFamily: family,
    concentration,
    marketSegment: segment
  },
  description,
  features: ["Presentación de 100 ml", concentration, `Perfume ${segment.toLocaleLowerCase("es-MX")}`]
});

export const CATALOG_EXPANSION_ID = "perfumes-h30-m25-2026-10-31";

export const CATALOG_EXPANSION_PRODUCTS = [
  perfume({ id: "catalog-versace-man-eau-fraiche", name: "Man Eau Fraîche", brand: "Versace", gender: "Hombre", price: 599, image: "/assets/products/versace-man-eau-fraiche.catalog.jpg", family: "Acuática", concentration: "Eau de toilette", segment: "Diseñador", description: "Una propuesta fresca, cítrica y amaderada de Versace para uso diario." }),
  perfume({ id: "catalog-versace-dylan-blue", name: "Dylan Blue Pour Homme", brand: "Versace", gender: "Hombre", price: 649, image: "/assets/products/versace-dylan-blue.catalog.jpg", family: "Aromática", concentration: "Eau de toilette", segment: "Diseñador", description: "Fragancia aromática de carácter moderno, con salida fresca y fondo cálido." }),
  perfume({ id: "catalog-lattafa-asad-bourbon", name: "Asad Bourbon", brand: "Lattafa", gender: "Hombre", price: 599, image: "/assets/products/lattafa-asad-bourbon.catalog.jpg", family: "Oriental / ambarada", segment: "Árabe", description: "Perfume especiado y envolvente con un perfil cálido, elegante y dulce." }),
  perfume({ id: "catalog-lattafa-asad-zanzibar", name: "Asad Zanzibar", brand: "Lattafa", gender: "Hombre", price: 549, image: "/assets/products/lattafa-asad-zanzibar.catalog.jpg", family: "Acuática", segment: "Árabe", description: "Composición fresca y tropical con matices especiados y un fondo cremoso." }),
  perfume({ id: "catalog-armaf-odyssey-homme-white", name: "Odyssey Homme White Edition", brand: "Armaf", gender: "Hombre", price: 549, image: "/assets/products/armaf-odyssey-homme-white.catalog.jpg", family: "Aromática", segment: "Árabe", description: "Fragancia aromática y versátil con una presencia limpia y contemporánea." }),

  perfume({ id: "catalog-ariana-sweet-like-candy", name: "Sweet Like Candy", brand: "Ariana Grande", gender: "Mujer", price: 599, image: "/assets/products/ariana-sweet-like-candy.catalog.jpg", family: "Gourmand", segment: "Diseñador", description: "Una fragancia dulce y alegre con un perfil frutal, cremoso y femenino." }),
  perfume({ id: "catalog-ariana-cloud", name: "Cloud", brand: "Ariana Grande", gender: "Mujer", price: 649, image: "/assets/products/ariana-cloud.catalog.jpg", family: "Gourmand", segment: "Diseñador", description: "Perfume suave y envolvente con una estela cremosa, dulce y luminosa." }),
  perfume({ id: "catalog-dg-light-blue-intense", name: "Light Blue Eau Intense", brand: "Dolce & Gabbana", gender: "Mujer", price: 699, image: "/assets/products/dolce-gabbana-light-blue-intense.catalog.jpg", family: "Acuática", segment: "Diseñador", description: "Aroma fresco y vibrante inspirado en la sensación limpia del Mediterráneo." }),
  perfume({ id: "catalog-lancome-la-vie-est-belle", name: "La Vie Est Belle", brand: "Lancôme", gender: "Mujer", price: 699, image: "/assets/products/lancome-la-vie-est-belle.catalog.jpg", family: "Gourmand", segment: "Diseñador", description: "Una firma floral y gourmand, elegante, dulce y de presencia sofisticada." }),
  perfume({ id: "catalog-versace-bright-crystal", name: "Bright Crystal", brand: "Versace", gender: "Mujer", price: 649, image: "/assets/products/versace-bright-crystal.catalog.jpg", family: "Floral", concentration: "Eau de toilette", segment: "Diseñador", description: "Fragancia floral y luminosa de carácter fresco, delicado y femenino." }),
  perfume({ id: "catalog-lancome-miracle", name: "Miracle", brand: "Lancôme", gender: "Mujer", price: 649, image: "/assets/products/lancome-miracle.catalog.jpg", family: "Floral", segment: "Diseñador", description: "Una composición floral con sensación limpia, especiada y radiante." }),
  perfume({ id: "catalog-issey-leau-dissey", name: "L’Eau d’Issey", brand: "Issey Miyake", gender: "Mujer", price: 599, image: "/assets/products/issey-miyake-leau-dissey.catalog.jpg", family: "Acuática", concentration: "Eau de toilette", segment: "Diseñador", description: "Un clásico floral acuático de estilo minimalista, fresco y atemporal." }),
  perfume({ id: "catalog-valentino-donna-born-in-roma", name: "Donna Born in Roma", brand: "Valentino", gender: "Mujer", price: 699, image: "/assets/products/valentino-donna-born-in-roma.catalog.jpg", family: "Oriental / ambarada", segment: "Diseñador", description: "Fragancia floral ambarada con una presencia moderna, elegante y cálida." }),
  perfume({ id: "catalog-rasasi-hawas-glitz", name: "Hawas Glitz For Her", brand: "Rasasi", gender: "Mujer", price: 599, image: "/assets/products/rasasi-hawas-glitz.catalog.jpg", family: "Gourmand", segment: "Árabe", description: "Perfume frutal y gourmand con un acabado cremoso, luminoso y sofisticado." }),
  perfume({ id: "catalog-rasasi-hawas-pink", name: "Hawas Pink For Her", brand: "Rasasi", gender: "Mujer", price: 599, image: "/assets/products/rasasi-hawas-pink.catalog.jpg", family: "Gourmand", segment: "Árabe", description: "Una propuesta dulce y floral con matices suaves, alegres y femeninos." }),
  perfume({ id: "catalog-rasasi-hawas-diva", name: "Hawas Diva For Her", brand: "Rasasi", gender: "Mujer", price: 649, image: "/assets/products/rasasi-hawas-diva.catalog.jpg", family: "Oriental / ambarada", segment: "Árabe", description: "Aroma floral ambarado de carácter elegante, intenso y expresivo." }),
  perfume({ id: "catalog-rasasi-hawas-eclat", name: "Hawas Éclat For Her", brand: "Rasasi", gender: "Mujer", price: 649, image: "/assets/products/rasasi-hawas-eclat.catalog.jpg", family: "Floral", segment: "Árabe", description: "Fragancia floral afrutada con una estela suave, luminosa y refinada." })
];
