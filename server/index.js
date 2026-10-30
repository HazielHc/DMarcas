import "dotenv/config";
import crypto from "node:crypto";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTS as SEED_PRODUCTS } from "../js/products.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 3001);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "";
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, "data"));
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const FRAGRANCE_FAMILIES_FILE = path.join(DATA_DIR, "fragrance-families.json");
const PRODUCT_IMAGES_DIR = path.join(DATA_DIR, "product-images");
const SESSION_COOKIE = "__Host-dm-admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const SESSION_SALT = "diversas-marcas-admin-v1";

if (ADMIN_PASSWORD.length < 12 || SESSION_SECRET.length < 32) {
  console.error("Faltan secretos seguros. Ejecuta npm run setup:admin y vuelve a iniciar el servidor.");
  process.exit(1);
}

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const cookieName = isProduction ? SESSION_COOKIE : "dm-admin";
const passwordDigest = crypto.scryptSync(ADMIN_PASSWORD, SESSION_SALT, 64);
let products = [];
const DEFAULT_CATEGORIES = ["Perfumes", "Calzado", "Lentes", "Ropa", "Accesorios", "Otros"];
const DEFAULT_FRAGRANCE_FAMILIES = ["Cítrica", "Floral", "Amaderada", "Aromática", "Acuática", "Oriental / ambarada", "Gourmand", "Chipre"];
let categories = [...DEFAULT_CATEGORIES];
let fragranceFamilies = [...DEFAULT_FRAGRANCE_FAMILIES];
let writeQueue = Promise.resolve();

app.disable("x-powered-by");
app.set("trust proxy", isProduction ? 1 : false);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
      imgSrc: ["'self'", "https:", "data:", "blob:"],
      connectSrc: ["'self'"],
      ...(isProduction ? { upgradeInsecureRequests: [] } : {})
    }
  },
  crossOriginEmbedderPolicy: false
}));
app.use(express.json({ limit: "64kb", type: "application/json" }));
app.use("/uploads", express.static(PRODUCT_IMAGES_DIR, { maxAge: "1h", immutable: true }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." }
});

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function signSession(expiresAt) {
  const payload = Buffer.from(JSON.stringify({ role: "owner", exp: expiresAt })).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function isAuthenticated(req) {
  const cookieHeader = req.headers.cookie || "";
  const cookie = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`));
  if (!cookie) return false;

  let token;
  try {
    token = decodeURIComponent(cookie.slice(cookieName.length + 1));
  } catch {
    return false;
  }
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  if (!safeEqual(signature, expected)) return false;

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return claims.role === "owner" && Number.isFinite(claims.exp) && claims.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function ownerOnly(req, res, next) {
  if (!isAuthenticated(req)) return res.status(401).json({ error: "Inicia sesión como administrador para continuar." });
  next();
}

function sameOrigin(req, res, next) {
  const origin = req.get("origin");
  const forwardedHost = req.get("x-forwarded-host");
  const requestHost = forwardedHost || req.get("host");
  if (origin) {
    try {
      if (new URL(origin).host !== requestHost) return res.status(403).json({ error: "Origen no permitido." });
    } catch {
      return res.status(403).json({ error: "Origen no permitido." });
    }
  }
  next();
}

function cleanText(value, label, maxLength = 240, required = false) {
  if (typeof value !== "string") value = value == null ? "" : String(value);
  const text = value.trim();
  if (required && !text) throw new Error(`${label} es obligatorio.`);
  if (text.length > maxLength) throw new Error(`${label} supera el máximo de ${maxLength} caracteres.`);
  return text;
}

function stringList(value, label, maxItems = 20, maxLength = 120) {
  if (!Array.isArray(value)) throw new Error(`${label} debe ser una lista.`);
  if (value.length > maxItems) throw new Error(`${label} admite hasta ${maxItems} elementos.`);
  return value.map((item) => cleanText(item, label, maxLength)).filter(Boolean);
}

function normalizeProduct(input, id) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Datos de producto inválidos.");

  const name = cleanText(input.name, "El nombre", 160, true);
  const brand = cleanText(input.brand, "La marca", 100, true);
  const category = cleanText(input.category, "La categoría", 80, true);
  const offerPrice = Number(input.offerPrice);
  const suppliedRegularPrice = input.regularPrice == null || input.regularPrice === "" ? offerPrice : Number(input.regularPrice);
  const regularPrice = Math.max(suppliedRegularPrice, offerPrice);
  if (!Number.isFinite(offerPrice) || offerPrice <= 0 || offerPrice > 100000000) throw new Error("El precio debe ser mayor que cero.");
  if (!Number.isFinite(regularPrice) || regularPrice <= 0 || regularPrice > 100000000) throw new Error("El precio debe ser mayor que cero.");

  const images = stringList(input.images, "Las imágenes", 12, 2048);
  for (const image of images) {
    if (image.startsWith("/")) {
      if ((!image.startsWith("/assets/") && !image.startsWith("/uploads/")) || image.startsWith("//") || image.includes("..")) throw new Error("Las rutas locales deben estar dentro de /assets/ o /uploads/.");
      continue;
    }
    let parsed;
    try { parsed = new URL(image); } catch { throw new Error("Cada imagen debe usar una URL HTTPS o una ruta local /assets/…"); }
    if (parsed.protocol !== "https:") throw new Error("Las imágenes externas deben usar HTTPS.");
  }

  const colors = Array.isArray(input.colors) ? input.colors.slice(0, 20).map((color) => {
    const colorName = cleanText(color?.name, "El color", 80, true);
    const hex = cleanText(color?.hex, "El color", 7);
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) throw new Error("Cada color debe usar un código hex de 6 dígitos.");
    return { name: colorName, hex };
  }) : [];

  const rating = input.rating == null || input.rating === "" ? 0 : Number(input.rating);
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) throw new Error("La calificación debe estar entre 0 y 5.");

  const rawDetails = input.details && typeof input.details === "object" && !Array.isArray(input.details) ? input.details : {};

  return {
    id,
    name,
    brand,
    category,
    gender: cleanText(input.gender, "El público", 40),
    regularPrice,
    offerPrice,
    onSale: Boolean(input.onSale),
    isNew: Boolean(input.isNew),
    featured: Boolean(input.featured),
    stockStatus: cleanText(input.stockStatus, "La disponibilidad", 80),
    rating,
    images,
    sizes: stringList(input.sizes, "Las tallas o presentaciones", 40, 80),
    colors,
    details: {
      type: cleanText(rawDetails.type, "El tipo de producto", 80),
      material: cleanText(rawDetails.material, "El material", 100),
      fragranceFamily: cleanText(rawDetails.fragranceFamily, "La familia olfativa", 80),
      concentration: cleanText(rawDetails.concentration, "La concentración", 60)
    },
    description: cleanText(input.description, "La descripción", 2000),
    features: stringList(input.features, "Las características", 12, 240)
  };
}

async function persistProducts(nextProducts) {
  writeQueue = writeQueue.then(async () => {
    const temporaryFile = `${PRODUCTS_FILE}.tmp`;
    await writeFile(temporaryFile, `${JSON.stringify(nextProducts, null, 2)}\n`, "utf8");
    await rename(temporaryFile, PRODUCTS_FILE);
  });
  await writeQueue;
}

function categoryKey(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-MX").trim();
}

function mergeCategories(values) {
  const seen = new Set();
  return values.map((value) => cleanText(value, "La sección", 50, true)).filter((value) => {
    const key = categoryKey(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function persistCategories(nextCategories) {
  const temporaryFile = `${CATEGORIES_FILE}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(nextCategories, null, 2)}\n`, "utf8");
  await rename(temporaryFile, CATEGORIES_FILE);
}

function mergeFragranceFamilies(values) {
  const seen = new Set();
  return values.map((value) => cleanText(value, "La familia olfativa", 80, true)).filter((value) => {
    const key = categoryKey(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function persistFragranceFamilies(nextFamilies) {
  const temporaryFile = `${FRAGRANCE_FAMILIES_FILE}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(nextFamilies, null, 2)}\n`, "utf8");
  await rename(temporaryFile, FRAGRANCE_FAMILIES_FILE);
}

function handleValidationError(error, res) {
  return res.status(400).json({ error: error.message || "No se pudieron guardar los cambios." });
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/api/products", (_req, res) => res.set("Cache-Control", "no-store").json(products));

app.get("/api/admin/categories", ownerOnly, (_req, res) => {
  const merged = mergeCategories([...categories, ...products.map((product) => product.category)]);
  res.set("Cache-Control", "no-store").json(merged);
});

app.post("/api/admin/categories", sameOrigin, ownerOnly, async (req, res) => {
  try {
    const name = cleanText(req.body?.name, "El nombre de la sección", 50, true);
    const existing = categories.find((category) => categoryKey(category) === categoryKey(name));
    if (existing) return res.json({ category: existing, categories });
    const nextCategories = mergeCategories([...categories, name]);
    await persistCategories(nextCategories);
    categories = nextCategories;
    res.status(201).json({ category: name, categories });
  } catch (error) {
    handleValidationError(error, res);
  }
});

app.get("/api/admin/fragrance-families", ownerOnly, (_req, res) => {
  res.set("Cache-Control", "no-store").json(fragranceFamilies);
});

app.post("/api/admin/fragrance-families", sameOrigin, ownerOnly, async (req, res) => {
  try {
    const name = cleanText(req.body?.name, "El nombre de la familia olfativa", 80, true);
    const existing = fragranceFamilies.find((family) => categoryKey(family) === categoryKey(name));
    if (existing) return res.json({ family: existing, families: fragranceFamilies });
    const nextFamilies = mergeFragranceFamilies([...fragranceFamilies, name]);
    await persistFragranceFamilies(nextFamilies);
    fragranceFamilies = nextFamilies;
    res.status(201).json({ family: name, families: fragranceFamilies });
  } catch (error) {
    handleValidationError(error, res);
  }
});

app.get("/api/admin/session", (req, res) => {
  res.set("Cache-Control", "no-store").json({ authenticated: isAuthenticated(req) });
});

app.post("/api/admin/uploads/product-image", sameOrigin, ownerOnly, async (req, res) => {
  const allowedTypes = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"], ["image/gif", "gif"]]);
  const contentType = String(req.get("content-type") || "").toLowerCase();
  if (!allowedTypes.has(contentType)) return res.status(415).json({ error: "Elige una imagen JPG, PNG, WebP o GIF." });
  const chunks = [];
  let size = 0;
  try {
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 8 * 1024 * 1024) return res.status(413).json({ error: "Cada imagen debe pesar 8 MB o menos." });
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const signatureOk = contentType === "image/jpeg" ? buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
      : contentType === "image/png" ? buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : contentType === "image/gif" ? buffer.subarray(0, 6).toString("ascii").match(/^GIF8[79]a$/)
          : buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
    if (!signatureOk) return res.status(400).json({ error: "El archivo no parece ser una imagen válida del formato elegido." });
    await mkdir(PRODUCT_IMAGES_DIR, { recursive: true });
    const filename = `${crypto.randomUUID()}.${allowedTypes.get(contentType)}`;
    await writeFile(path.join(PRODUCT_IMAGES_DIR, filename), buffer, { flag: "wx" });
    res.status(201).json({ path: `/uploads/${filename}` });
  } catch (error) {
    if (error?.type === "entity.too.large") return res.status(413).json({ error: "Cada imagen debe pesar 8 MB o menos." });
    res.status(500).json({ error: "No se pudo guardar la imagen. Inténtalo de nuevo." });
  }
});

app.delete("/api/admin/uploads/product-image", sameOrigin, ownerOnly, async (req, res) => {
  const imagePath = String(req.query.path || "");
  const filename = path.basename(imagePath);
  if (!imagePath.startsWith("/uploads/") || !/^[\da-f-]{36}\.(jpg|png|webp|gif)$/.test(filename)) return res.status(400).json({ error: "La ruta de imagen no es válida." });
  try {
    await unlink(path.join(PRODUCT_IMAGES_DIR, filename));
    res.status(204).end();
  } catch (error) {
    if (error.code === "ENOENT") return res.status(204).end();
    res.status(500).json({ error: "No se pudo limpiar la imagen temporal." });
  }
});

app.post("/api/admin/login", sameOrigin, loginLimiter, (req, res) => {
  const submittedPassword = typeof req.body?.password === "string" ? req.body.password : "";
  if (submittedPassword.length > 1024) return res.status(401).json({ error: "La contraseña no es correcta." });

  const submittedDigest = crypto.scryptSync(submittedPassword, SESSION_SALT, 64);
  if (!safeEqual(submittedDigest, passwordDigest)) return res.status(401).json({ error: "La contraseña no es correcta." });

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const token = signSession(expiresAt);
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS * 1000
  });
  res.set("Cache-Control", "no-store").json({ authenticated: true, expiresAt });
});

app.post("/api/admin/logout", sameOrigin, ownerOnly, (_req, res) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/"
  });
  res.status(204).end();
});

app.post("/api/admin/products", sameOrigin, ownerOnly, async (req, res) => {
  try {
    const id = `${slugify(req.body?.name) || "producto"}-${crypto.randomBytes(3).toString("hex")}`;
    const product = normalizeProduct(req.body, id);
    const nextProducts = [...products, product];
    await persistProducts(nextProducts);
    products = nextProducts;
    res.status(201).json(product);
  } catch (error) {
    handleValidationError(error, res);
  }
});

app.put("/api/admin/products/:id", sameOrigin, ownerOnly, async (req, res) => {
  try {
    const index = products.findIndex((product) => product.id === req.params.id);
    if (index < 0) return res.status(404).json({ error: "No se encontró ese producto." });
    const updated = normalizeProduct(req.body, products[index].id);
    const nextProducts = products.map((product, currentIndex) => currentIndex === index ? updated : product);
    await persistProducts(nextProducts);
    products = nextProducts;
    res.json(updated);
  } catch (error) {
    handleValidationError(error, res);
  }
});

app.delete("/api/admin/products/:id", sameOrigin, ownerOnly, async (req, res) => {
  const nextProducts = products.filter((product) => product.id !== req.params.id);
  if (nextProducts.length === products.length) return res.status(404).json({ error: "No se encontró ese producto." });
  try {
    await persistProducts(nextProducts);
    products = nextProducts;
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "No se pudo guardar el catálogo. Inténtalo de nuevo." });
  }
});

function slugify(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

if (isProduction) {
  const DIST_DIR = path.join(ROOT, "dist");
  app.use(express.static(DIST_DIR, { index: false, maxAge: "1h" }));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
}

app.use((error, _req, res, _next) => {
  if (error?.type === "entity.parse.failed") return res.status(400).json({ error: "El contenido enviado no es JSON válido." });
  console.error("Error de servidor:", error?.message || error);
  res.status(500).json({ error: "Ocurrió un error interno. Inténtalo de nuevo." });
});

await mkdir(DATA_DIR, { recursive: true });
try {
  const savedCategories = JSON.parse(await readFile(CATEGORIES_FILE, "utf8"));
  if (!Array.isArray(savedCategories)) throw new Error("Formato inválido.");
  categories = mergeCategories([...DEFAULT_CATEGORIES, ...savedCategories]);
} catch (error) {
  if (error.code !== "ENOENT") console.error("No se pudo leer categories.json; se cargarán las secciones iniciales.", error.message);
  categories = [...DEFAULT_CATEGORIES];
}
try {
  const saved = JSON.parse(await readFile(PRODUCTS_FILE, "utf8"));
  if (!Array.isArray(saved)) throw new Error("Formato inválido.");
  products = saved;
} catch (error) {
  if (error.code !== "ENOENT") console.error("No se pudo leer products.json; se cargará la semilla inicial.", error.message);
  products = SEED_PRODUCTS.map((product) => ({ ...product }));
  await persistProducts(products);
}

categories = mergeCategories([...categories, ...products.map((product) => product.category)]);
await persistCategories(categories);
try {
  const savedFamilies = JSON.parse(await readFile(FRAGRANCE_FAMILIES_FILE, "utf8"));
  if (!Array.isArray(savedFamilies)) throw new Error("Formato inválido.");
  fragranceFamilies = mergeFragranceFamilies([...DEFAULT_FRAGRANCE_FAMILIES, ...savedFamilies, ...products.map((product) => product.details?.fragranceFamily).filter(Boolean)]);
} catch (error) {
  if (error.code !== "ENOENT") console.error("No se pudo leer fragrance-families.json; se cargarán las familias iniciales.", error.message);
  fragranceFamilies = mergeFragranceFamilies([...DEFAULT_FRAGRANCE_FAMILIES, ...products.map((product) => product.details?.fragranceFamily).filter(Boolean)]);
}
await persistFragranceFamilies(fragranceFamilies);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API y servidor listos en el puerto ${PORT}.`);
});
