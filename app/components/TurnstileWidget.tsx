"use client";
import { useEffect, useRef } from "react";

export default function TurnstileWidget({
  onVerify,
  siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
}: {
  onVerify: (token: string) => void;
  siteKey?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    // Load Cloudflare Turnstile script once
    if (!document.getElementById("cf-turnstile-script")) {
      const script = document.createElement("script");
      script.id = "cf-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      document.head.appendChild(script);
    }
    // Wait for turnstile to load
    const tryRender = () => {
      if ((window as any).turnstile && ref.current) {
        (window as any).turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: onVerify,
        });
      } else {
        setTimeout(tryRender, 200);
      }
    };
    tryRender();
  }, [siteKey, onVerify]);

  if (!siteKey) return null;
  return <div ref={ref} className="my-2" />;
}
