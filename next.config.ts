import type { NextConfig } from "next";

const CSP = [
  "default-src 'self'",
  // Scripts: self + Next.js inline hydration + FB Pixel + Stripe
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://js.stripe.com",
  // Frames: Stripe checkout & payment elements
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  // Images: self + data URIs + any HTTPS (Vercel Blob, etc.)
  "img-src 'self' data: blob: https:",
  // Styles: self + inline (Tailwind) + Google Fonts
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Fonts
  "font-src 'self' https://fonts.gstatic.com",
  // Fetch / XHR: self + Stripe API + FB + Supabase storage
  "connect-src 'self' https://api.stripe.com https://www.facebook.com https://*.supabase.co https://*.supabase.in",
  // No plugins
  "object-src 'none'",
  // Limit <base> tag hijacking
  "base-uri 'self'",
  // Forms only submit to same origin
  "form-action 'self'",
  // Upgrade insecure requests in production
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Prevent MIME type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Disable browser DNS prefetch leaking
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Referrer: only send origin on cross-origin requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
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
        // Apply to every route
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Don't expose Next.js server version
  poweredByHeader: false,
};

export default nextConfig;
