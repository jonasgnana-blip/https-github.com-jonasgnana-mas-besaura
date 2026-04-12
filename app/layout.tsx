import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

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
  title: {
    default: "Mas Besaura — Casa Rural · Actividades · Retiros en Vidrà, Girona",
    template: "%s | Mas Besaura",
  },
  description:
    "Casa rural en La Vila de Buscarons, Vidrà (Girona). Alojamiento en plena naturaleza, actividades terapéuticas y familiares, retiros y alquiler para grupos. Entre ríos y bosques salvajes del Ripollès.",
  keywords: [
    "casa rural",
    "Vidrà",
    "Girona",
    "Ripollès",
    "retiros",
    "actividades",
    "alojamiento rural",
    "constelaciones familiares",
    "Mas Besaura",
  ],
  authors: [{ name: "Mas Besaura" }],
  openGraph: {
    title: "Mas Besaura — Casa Rural en Vidrà, Girona",
    description:
      "Alojamiento, actividades terapéuticas y retiros entre ríos y bosques del Ripollès.",
    url: "https://masbesaura.com",
    siteName: "Mas Besaura",
    locale: "es_ES",
    type: "website",
    images: [
      { url: "/images/hero1.jpg", width: 1200, height: 630, alt: "Mas Besaura" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mas Besaura — Casa Rural en Vidrà, Girona",
    description:
      "Alojamiento, actividades y retiros en la naturaleza del Ripollès.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://masbesaura.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Mas Besaura",
  description: "Casa rural en La Vila de Buscarons, Vidrà (Girona)",
  url: "https://masbesaura.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vidrà",
    addressRegion: "Girona",
    addressCountry: "ES",
  },
};

const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LanguageProvider>
        {children}
        </LanguageProvider>

        {/* Facebook Pixel */}
        {fbPixelId && (
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${fbPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
