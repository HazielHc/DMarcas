const hawas = ({ id, name, gender, price, image, family, description }) => ({
  id,
  name,
  brand: "Rasasi",
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
    type: "Eau de parfum",
    material: "",
    fragranceFamily: family,
    concentration: "Eau de parfum",
    marketSegment: "Árabe"
  },
  description,
  features: ["Presentación de 100 ml", "Eau de parfum", "Perfume árabe"]
});

export const HAWAS_EXPANSION_ID = "hawas-family-2026-10-31";

export const HAWAS_EXISTING_UPDATES = {
  "ice-cc011b": {
    brand: "Rasasi",
    name: "Hawas Ice",
    gender: "Hombre",
    price: 549,
    image: "/assets/products/rasasi-hawas-ice.catalog.jpg"
  },
  "catalog-rasasi-hawas-glitz": { price: 599 },
  "catalog-rasasi-hawas-pink": { price: 599 },
  "catalog-rasasi-hawas-diva": { price: 599 },
  "catalog-rasasi-hawas-eclat": { price: 599 }
};

export const HAWAS_EXPANSION_PRODUCTS = [
  hawas({ id: "catalog-rasasi-hawas-elixir", name: "Hawas Elixir", gender: "Unisex", price: 599, image: "/assets/products/rasasi-hawas-elixir.catalog.jpg", family: "Oriental / gourmand", description: "Menta y bergamota abren una composición gourmand de chocolate oscuro, lavanda, vainilla y haba tonka." }),
  hawas({ id: "catalog-rasasi-hawas-viper", name: "Hawas Viper", gender: "Hombre", price: 599, image: "/assets/products/rasasi-hawas-viper.catalog.jpg", family: "Aromática", description: "Una fragancia intensa y moderna, de carácter fresco y masculino, con un fondo cálido y persistente." }),
  hawas({ id: "catalog-rasasi-hawas-tropical", name: "Hawas Tropical", gender: "Unisex", price: 549, image: "/assets/products/rasasi-hawas-tropical.catalog.jpg", family: "Frutal / tropical", description: "Perfil tropical fresco y luminoso, pensado para días cálidos y momentos relajados." }),
  hawas({ id: "catalog-rasasi-hawas-kobra", name: "Hawas Kobra", gender: "Hombre", price: 599, image: "/assets/products/rasasi-hawas-kobra.catalog.jpg", family: "Especiada", description: "Jengibre, cítricos y té verde se combinan con canela, neroli, ámbar y almizcle." }),
  hawas({ id: "catalog-rasasi-hawas-atlantis", name: "Hawas Atlantis", gender: "Unisex", price: 599, image: "/assets/products/rasasi-hawas-atlantis.catalog.jpg", family: "Acuática", description: "Una interpretación acuática y vibrante de la familia Hawas, fresca, versátil y energética." }),
  hawas({ id: "catalog-rasasi-hawas-verde", name: "Hawas Verde", gender: "Unisex", price: 549, image: "/assets/products/rasasi-hawas-verde.catalog.jpg", family: "Cítrica / aromática", description: "Lima, manzana verde y romero sobre un fondo limpio de pachulí y ámbar." }),
  hawas({ id: "catalog-rasasi-hawas-london", name: "Hawas London", gender: "Unisex", price: 599, image: "/assets/products/rasasi-hawas-london.catalog.jpg", family: "Frutal / aromática", description: "Una mezcla contemporánea y colorida con salida frutal, corazón fresco y fondo envolvente." }),
  hawas({ id: "catalog-rasasi-hawas-malibu", name: "Hawas Malibu", gender: "Unisex", price: 599, image: "/assets/products/rasasi-hawas-malibu.catalog.jpg", family: "Frutal / amaderada", description: "Piña, cítricos y lavanda se apoyan en haba tonka, almizcle, pachulí y maderas suaves." }),
  hawas({ id: "catalog-rasasi-hawas-fire", name: "Hawas Fire", gender: "Hombre", price: 599, image: "/assets/products/rasasi-hawas-fire.catalog.jpg", family: "Aromática / especiada", description: "Una expresión cálida y enérgica con salida fresca, corazón especiado y fondo ambarado." }),
  hawas({ id: "catalog-rasasi-hawas-black", name: "Hawas Black", gender: "Hombre", price: 549, image: "/assets/products/rasasi-hawas-black.catalog.jpg", family: "Amaderada / aromática", description: "Oscuro, elegante y versátil, con un perfil fresco que evoluciona hacia maderas y musgo." }),
  hawas({ id: "catalog-rasasi-hawas-for-him", name: "Hawas For Him", gender: "Hombre", price: 549, image: "/assets/products/rasasi-hawas-for-him.catalog.jpg", family: "Aromática / acuática", description: "El clásico acuático de Rasasi con manzana, cítricos, canela, notas marinas, ciruela y maderas." }),
  hawas({ id: "catalog-rasasi-hawas-for-her", name: "Hawas For Her", gender: "Mujer", price: 549, image: "/assets/products/rasasi-hawas-for-her.catalog.jpg", family: "Floral / frutal", description: "Una fragancia femenina, luminosa y duradera con matices frutales, florales y cálidos." }),
  hawas({ id: "catalog-rasasi-hawas-thunder", name: "Hawas Thunder", gender: "Hombre", price: 599, image: "/assets/products/rasasi-hawas-thunder.catalog.jpg", family: "Aromática / amaderada", description: "Una propuesta limpia y contundente que equilibra frescura aromática con una base amaderada." }),
  hawas({ id: "catalog-rasasi-hawas-lava-gold", name: "Hawas Lava Gold", gender: "Hombre", price: 599, image: "/assets/products/rasasi-hawas-lava-gold.catalog.jpg", family: "Cuero / frutal", description: "Frutas brillantes, cuero, azafrán y oud se funden con ámbar, pachulí y un toque de caramelo." }),
  hawas({ id: "catalog-rasasi-hawas-exotic", name: "Hawas Exotic", gender: "Hombre", price: 599, image: "/assets/products/rasasi-hawas-exotic.catalog.jpg", family: "Oriental / especiada", description: "Coco, lavanda y cardamomo dan paso a flores especiadas y una base profunda de ámbar y pachulí." }),
  hawas({ id: "catalog-rasasi-hawas-blanche", name: "Hawas Blanche", gender: "Unisex", price: 599, image: "/assets/products/rasasi-hawas-blanche.catalog.jpg", family: "Frutal / amaderada", description: "Una interpretación clara y contemporánea con frutas vivas, verdes aromáticos y maderas refinadas." }),
  hawas({ id: "catalog-rasasi-hawas-reina", name: "Hawas Reina", gender: "Mujer", price: 599, image: "/assets/products/rasasi-hawas-reina.catalog.jpg", family: "Oriental / gourmand", description: "Albaricoque, pera y canela se mezclan con flores blancas, coco, café, vainilla y ámbar." }),
  hawas({ id: "catalog-rasasi-hawas-rouge", name: "Hawas Rouge", gender: "Mujer", price: 599, image: "/assets/products/rasasi-hawas-rouge.catalog.jpg", family: "Floral / gourmand", description: "Frutas vibrantes y flores blancas descansan sobre vainilla, almizcle, café y maderas secas." }),
  hawas({ id: "catalog-rasasi-hawas-for-him-le-parfum", name: "Hawas For Him Le Parfum", gender: "Hombre", price: 599, image: "/assets/products/rasasi-hawas-for-him-le-parfum.catalog.jpg", family: "Aromática / amaderada", description: "Frutas y jengibre abren una composición especiada y marina con ámbar gris, cachemira y cedro." }),
  hawas({ id: "catalog-rasasi-hawas-highness", name: "Hawas Highness", gender: "Hombre", price: 599, image: "/assets/products/rasasi-hawas-highness.catalog.jpg", family: "Cítrica / aromática", description: "Una fragancia fresca y elegante, con cítricos, especias suaves, flores y un fondo limpio de maderas." })
];
