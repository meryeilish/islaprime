// Inspecciona la estructura de un GLB: materiales, mallas y nodos.
import { readFileSync } from "node:fs";

const path = process.argv[2];
const buf = readFileSync(path);

// Cabecera GLB: magic(4) version(4) length(4), luego chunks: length(4) type(4) data
const jsonLength = buf.readUInt32LE(12);
const jsonType = buf.toString("ascii", 16, 20);
if (jsonType !== "JSON") throw new Error("Chunk JSON no encontrado");
const gltf = JSON.parse(buf.toString("utf8", 20, 20 + jsonLength));

console.log("== Materiales ==");
for (const [i, m] of (gltf.materials ?? []).entries()) {
  const pbr = m.pbrMetallicRoughness ?? {};
  console.log(
    `${i}: ${m.name ?? "(sin nombre)"} | baseColorTexture: ${pbr.baseColorTexture ? "sí" : "no"} | baseColorFactor: ${JSON.stringify(pbr.baseColorFactor ?? null)} | metallic: ${pbr.metallicFactor ?? 1} | roughness: ${pbr.roughnessFactor ?? 1}`,
  );
}

console.log("\n== Mallas ==");
for (const [i, mesh] of (gltf.meshes ?? []).entries()) {
  const mats = mesh.primitives.map((p) => p.material).join(",");
  console.log(`${i}: ${mesh.name ?? "(sin nombre)"} | primitivas: ${mesh.primitives.length} | materiales: [${mats}]`);
}

console.log("\n== Nodos ==");
for (const [i, n] of (gltf.nodes ?? []).entries()) {
  if (n.mesh !== undefined) console.log(`${i}: ${n.name ?? "(sin nombre)"} -> mesh ${n.mesh}`);
}

console.log("\n== Posición (min/max) ==");
for (const mesh of gltf.meshes ?? []) {
  for (const p of mesh.primitives) {
    const acc = gltf.accessors[p.attributes.POSITION];
    console.log(`min: ${JSON.stringify(acc.min)} max: ${JSON.stringify(acc.max)}`);
  }
}

console.log("\n== Nodos raíz y transformaciones ==");
for (const n of gltf.nodes ?? []) {
  if (n.rotation || n.scale) {
    console.log(`${n.name}: rot=${JSON.stringify(n.rotation ?? null)} scale=${JSON.stringify(n.scale ?? null)}`);
  }
}

console.log("\n== Texturas/Imágenes ==");
console.log(`texturas: ${(gltf.textures ?? []).length}, imágenes: ${(gltf.images ?? []).length}`);
for (const [i, img] of (gltf.images ?? []).entries()) {
  console.log(`img ${i}: ${img.name ?? "(sin nombre)"} ${img.mimeType ?? ""}`);
}
