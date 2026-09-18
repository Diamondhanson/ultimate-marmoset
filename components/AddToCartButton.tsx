"use client";

import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { track } from "@/lib/gtag";
import type { Monkey } from "@/lib/types";

export function AddToCartButton({
  monkey,
  size = "sm",
  goToList = false,
}: {
  monkey: Monkey;
  size?: "sm" | "lg";
  goToList?: boolean;
}) {
  const { addItem, has } = useCart();
  const router = useRouter();
  const inList = has(monkey.id);
  const unavailable = monkey.status !== "available";

  const base =
    size === "lg"
      ? "rounded-xl px-7 py-3.5 text-base"
      : "rounded-lg px-4 py-2 text-sm";

  if (unavailable) {
    return (
      <span
        className={`${base} inline-block cursor-not-allowed bg-mist-200 font-bold text-bark-400`}
      >
        {monkey.status === "reserved" ? "Reserved" : "Rehomed"}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        addItem({
          id: monkey.id,
          slug: monkey.slug,
          name: monkey.name,
          species: monkey.species,
          price: monkey.price,
          image: monkey.images[0] ?? "",
        });
        track("add_to_cart", {
          currency: "USD",
          value: monkey.price,
          items: [{ item_id: monkey.id, item_name: monkey.name }],
        });
        if (goToList) router.push("/reserve");
      }}
      className={`${base} font-bold transition-all duration-300 ${
        inList
          ? "bg-fern-100 text-fern-700 ring-1 ring-fern-200"
          : "bg-gold-400 text-canopy-900 shadow-sm hover:-translate-y-0.5 hover:bg-gold-300 hover:shadow-md active:translate-y-0"
      }`}
    >
      {inList ? (goToList ? "In your list. Review" : "✓ On your list") : "Reserve"}
    </button>
  );
}
