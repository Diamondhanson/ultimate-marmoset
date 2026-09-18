"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;

  return (
    <div>
      <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-mist-200 shadow-[0_18px_50px_-24px_rgba(15,52,35,0.5)] ring-1 ring-mist-200">
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="animate-fade-in object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="scrollbar-slim mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl transition-all duration-300 ${
                i === active
                  ? "ring-2 ring-gold-400 ring-offset-2 ring-offset-mist-50"
                  : "opacity-70 ring-1 ring-mist-200 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
