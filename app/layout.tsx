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
    "casa rural Vidrà",
    "casa rural Girona",
    "casa rural Ripollès",
    "retiros espirituales Girona",
    "retiros naturaleza Cataluña",
    "alquiler casa retiros",
    "constelaciones familiares Girona",
    "actividades naturaleza Girona",
    "alojamiento rural Girona",
    "La Cabanya Mas Besaura",
    "Mas Besaura",
    "casa rural grupos",
    "inmersión terapéutica",
    "BTT Girona",
    "rutas senderismo Ripollès",
  ],
  authors: [{ name: "Mas Besaura" }],
  openGraph: {
    title: "Mas Besaura — Casa Rural en Vidrà, Girona",
    description:
      "Alojamiento, actividades terapéuticas y retiros entre ríos y bosques del Ripollès. Casa rural con La Cabanya (350 m²) para grupos y retiros.",
    url: "https://masbesaura.com",
    siteName: "Mas Besaura",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://masbesaura.com/images/hero1.jpg",
        width: 1200,
        height: 630,
        alt: "Mas Besaura — Casa Rural en Vidrà, Girona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mas Besaura — Casa Rural en Vidrà, Girona",
    description:
      "Alojamiento, actividades terapéuticas y retiros en la naturaleza del Ripollès.",
    images: ["https://masbesaura.com/images/hero1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "https://masbesaura.com" },
  verification: {},
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Mas Besaura",
  description:
    "Casa rural en La Vila de Buscarons, Vidrà (Girona). Alojamiento, actividades terapéuticas, retiros y alquiler para grupos entre ríos y bosques del Ripollès.",
  url: "https://masbesaura.com",
  telephone: "+34665822542",
  image: "https://masbesaura.com/images/hero1.jpg",
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "La Vila de Buscarons",
    addressLocality: "Vidrà",
    addressRegion: "Girona",
    postalCode: "17459",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 42.1167,
    longitude: 2.2833,
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Sala de actividades exterior (La Cabanya)", value: true },
    { "@type": "LocationFeatureSpecification", name: "Pensión completa con productos de proximidad", value: true },
    { "@type": "LocationFeatureSpecification", name: "Entorno natural: bosques, ríos y cascadas", value: true },
    { "@type": "LocationFeatureSpecification", name: "Opción vegetariana", value: true },
    { "@type": "LocationFeatureSpecification", name: "Wifi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Zona de camping", value: true },
  ],
  hasMap: "https://maps.app.goo.gl/R5jGm9yANyER96e68",
  sameAs: [
    "https://www.instagram.com/masbesaura",
  ],
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
