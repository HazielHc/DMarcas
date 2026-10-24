import "dotenv/config";

if (!process.env.ADMIN_PASSWORD) {
  console.error("No se encontró ADMIN_PASSWORD. Ejecuta primero npm run setup:admin.");
  process.exit(1);
}

console.log(`Contraseña local de administrador: ${process.env.ADMIN_PASSWORD}`);
console.log("Guárdala en un lugar privado y cámbiala en .env antes de publicar el sitio.");
