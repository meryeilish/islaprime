import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://islaprime.lat"),
  title: "Isla Prime | Servidor The Isle Evrima LATAM",
  description:
    "Servidor Isla Prime de The Isle: Evrima para LATAM/ESP. Survival, growth x3, mapa Gateway. Entra, caza y sobrevive con la comunidad.",
  openGraph: {
    title: "Isla Prime | Servidor The Isle Evrima LATAM",
    description:
      "Servidor Isla Prime de The Isle: Evrima para LATAM/ESP. Survival, growth x3, mapa Gateway.",
    url: "https://islaprime.lat",
    siteName: "Isla Prime",
    locale: "es_LA",
    type: "website",
    images: [{ url: "/images/hero/beipi-bg.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Isla Prime | Servidor The Isle Evrima LATAM",
    description:
      "Servidor Isla Prime de The Isle: Evrima para LATAM/ESP. Survival, growth x3, mapa Gateway.",
    images: ["/images/hero/beipi-bg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-zinc-100">
        {children}
      </body>
    </html>
  );
}
