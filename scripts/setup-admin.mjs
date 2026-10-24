import { randomBytes } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";

const envPath = new URL("../.env", import.meta.url);
if (existsSync(envPath)) {
  console.log("Ya existe .env; no se modificó ningún secreto.");
  process.exit(0);
}

const password = randomBytes(24).toString("base64url");
const sessionSecret = randomBytes(48).toString("base64url");
writeFileSync(envPath, `ADMIN_PASSWORD=${password}\nSESSION_SECRET=${sessionSecret}\n`, { flag: "wx", mode: 0o600 });
console.log("Se creó .env con una contraseña aleatoria de administrador y una clave de sesión.");
console.log("La contraseña no se muestra en pantalla. Consulta npm run admin:credentials para verla en tu equipo.");
