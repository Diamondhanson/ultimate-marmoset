"use client";

import Script from "next/script";
import { ADS_ID, GA_ID, analyticsEnabled } from "@/lib/gtag";

/**
 * Loads the Google tag once, for GA4 and/or Google Ads. Renders nothing at all
 * until at least one of the NEXT_PUBLIC_* IDs is set.
 */
export function Analytics() {
  if (!analyticsEnabled) return null;
  const primaryId = GA_ID || ADS_ID;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${GA_ID ? `gtag('config', '${GA_ID}');` : ""}
          ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ""}
        `}
      </Script>
    </>
  );
}
