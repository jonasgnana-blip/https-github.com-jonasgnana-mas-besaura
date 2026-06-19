import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const CSP = [
  "default-src 'self'",
  // unsafe-eval only in dev (Next.js HMR). Production: drop it.
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://js.stripe.com"
    : "script-src 'self' 'unsafe-inline' https://connect.facebook.net https://js.stripe.com",
  // Frames: Stripe + YouTube + Vimeo
  "frame-src https://js.stripe.com https://hooks.stripe.com https://www.youtube.com https://player.vimeo.com",
  // Images: self + data URIs + any HTTPS (Vercel Blob, etc.)
  "img-src 'self' data: blob: https:",
  // Styles: self + inline (Tailwind) + Google Fonts
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Fonts
  "font-src 'self' https://fonts.gstatic.com",
  // Fetch / XHR: self + Stripe + FB + Supabase
  "connect-src 'self' https://api.stripe.com https://www.facebook.com https://*.supabase.co https://*.supabase.in",
  // No plugins
  "object-src 'none'",
  // Limit <base> tag hijacking
  "base-uri 'self'",
  // Forms only submit to same origin
  "form-action 'self'",
  // Block framing from other origins (replaces X-Frame-Options in modern browsers)
  "frame-ancestors 'self'",
  // Upgrade insecure requests in production
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Prevent clickjacking (legacy browsers)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // DNS prefetch
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Referrer: only send origin on cross-origin requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Cross-origin isolation — prevents Spectre-style attacks
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  // Limit browser feature access
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HSTS: 2 years, include subdomains, preload-ready
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Content Security Policy
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Don't expose Next.js server version
  poweredByHeader: false,
};

export default nextConfig;
