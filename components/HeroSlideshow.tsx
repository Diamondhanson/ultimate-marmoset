"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Full-bleed crossfading background slideshow. A deep canopy gradient sits on
 * top so the hero copy always reads at AA contrast regardless of the photo.
 */
export function HeroSlideshow({
  images,
  interval = 6000,
}: {
  images: string[];
  interval?: number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((current) => (current + 1) % images.length),
      interval
    );
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {images.map((src, i) => (
          <div
            key={src}
            className={`hero-slide absolute inset-0 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              sizes="100vw"
              className={`object-cover ${i === active ? "animate-slow-zoom" : ""}`}
            />
          </div>
        ))}
        {/* Readability: dark on the copy side, lighter towards the portrait */}
        <div className="absolute inset-0 bg-linear-to-r from-canopy-950 via-canopy-950/88 to-canopy-900/55" />
        <div className="absolute inset-0 bg-canopy-950/55 lg:hidden" />
        <div className="texture-canopy absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-mist-50 to-transparent" />
      </div>

      <div className="absolute bottom-8 right-6 z-10 hidden gap-2 sm:flex">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Show photo ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              i === active
                ? "w-8 bg-gold-400"
                : "w-2.5 bg-mist-50/45 hover:bg-gold-200"
            }`}
          />
        ))}
      </div>
    </>
  );
}
