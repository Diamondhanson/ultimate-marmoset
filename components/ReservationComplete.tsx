"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { ADS_RESERVATION_LABEL, track, trackAdsConversion } from "@/lib/gtag";

/**
 * Runs on the thank-you page: empties the reservation list and fires the
 * conversion events exactly once.
 */
export function ReservationComplete() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
    track("reservation_submitted");
    trackAdsConversion(ADS_RESERVATION_LABEL);
  }, [clear]);

  return null;
}
