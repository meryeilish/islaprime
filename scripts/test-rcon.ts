/**
 * Prueba one-shot de RCON Evrima.
 * Uso: npx tsx scripts/test-rcon.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { IsleRconClient } from "../lib/isle/rcon";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();
  const host = process.env.ISLE_RCON_HOST;
  const port = process.env.ISLE_RCON_PORT;
  console.log(`Conectando RCON → ${host}:${port} …`);

  const client = IsleRconClient.fromEnv();
  try {
    await client.connect();
    console.log("Auth: OK");

    const details = await client.serverDetails();
    console.log("serverdetails:", details.slice(0, 400) || "(vacío)");

    const players = await client.playerList();
    console.log("playerlist:", players.slice(0, 400) || "(nadie / vacío)");

    console.log("RCON funcionando.");
  } catch (error) {
    console.error(
      "FALLO:",
      error instanceof Error ? error.message : error,
    );
    console.error(
      "Si falla el auth/timeout: abre el puerto 8888 en el firewall del VPS hacia tu IP.",
    );
    process.exitCode = 1;
  } finally {
    client.close();
  }
}

main();
