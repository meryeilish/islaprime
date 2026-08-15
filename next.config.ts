import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Paquete listo para VPS: .next/standalone (sin copiar todo node_modules)
  output: "standalone",
};

export default nextConfig;
