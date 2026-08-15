// Extrae las imágenes embebidas de un GLB a archivos PNG.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const path = process.argv[2];
const outDir = process.argv[3] ?? "glb-images";
mkdirSync(outDir, { recursive: true });

const buf = readFileSync(path);
const jsonLength = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.toString("utf8", 20, 20 + jsonLength));

// El chunk BIN va después del chunk JSON (alineado a 4 bytes)
let offset = 20 + jsonLength;
offset = Math.ceil(offset / 4) * 4;
const binLength = buf.readUInt32LE(offset);
const binStart = offset + 8;

for (const [i, img] of (gltf.images ?? []).entries()) {
  const bv = gltf.bufferViews[img.bufferView];
  const start = binStart + (bv.byteOffset ?? 0);
  const data = buf.subarray(start, start + bv.byteLength);
  const name = (img.name ?? `image_${i}`).replace(/[^\w.-]/g, "_");
  const file = join(outDir, `${name}.png`);
  writeFileSync(file, data);
  console.log(`${file} (${(bv.byteLength / 1024 / 1024).toFixed(1)} MB)`);
}
