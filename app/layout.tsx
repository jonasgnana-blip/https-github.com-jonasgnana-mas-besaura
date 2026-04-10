import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mas Besaura — Casa Rural · Talleres · Retiros",
  description:
    "Descubre Mas Besaura, una casa rural en plena naturaleza. Talleres, actividades familiares y retiros para reconectar con lo esencial.",
  openGraph: {
    title: "Mas Besaura",
    description: "Casa rural · Talleres · Retiros",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
