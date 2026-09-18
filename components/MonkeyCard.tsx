import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";
import { StatusBadge } from "./StatusBadge";
import { formatPrice } from "@/lib/site";
import { formatAge } from "@/lib/utils";
import type { Monkey } from "@/lib/types";

export function MonkeyCard({ monkey }: { monkey: Monkey }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-mist-200 bg-white shadow-[0_1px_2px_rgba(23,33,28,0.05)] transition-all duration-500 hover:-translate-y-2 hover:border-fern-200 hover:shadow-[0_18px_40px_-16px_rgba(15,52,35,0.35)]">
      <Link
        href={`/monkeys/${monkey.slug}`}
        className="relative block aspect-4/3 overflow-hidden bg-mist-200"
      >
        {monkey.images[0] && (
          <Image
            src={monkey.images[0]}
            alt={`${monkey.name}, a ${monkey.species}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-canopy-950/55 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute left-3 top-3">
          <StatusBadge status={monkey.status} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl font-semibold text-canopy-900">
            <Link
              href={`/monkeys/${monkey.slug}`}
              className="transition-colors hover:text-fern-600"
            >
              {monkey.name}
            </Link>
          </h3>
          <p className="shrink-0 font-display text-lg font-semibold text-gold-600">
            {formatPrice(monkey.price)}
          </p>
        </div>

        <p className="mt-1.5 text-sm font-semibold text-fern-600">
          {monkey.species}
        </p>
        <p className="mt-0.5 text-sm text-bark-400">
          {monkey.gender === "female" ? "Female" : "Male"} ·{" "}
          {formatAge(monkey.date_of_birth)}
          {monkey.hand_raised ? " · Hand-raised" : ""}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-bark-500">
          {monkey.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <Link
            href={`/monkeys/${monkey.slug}`}
            className="group/link text-sm font-bold text-canopy-700 transition-colors hover:text-fern-600"
          >
            Meet {monkey.name}{" "}
            <span className="inline-block transition-transform duration-300 group-hover/link:translate-x-1">
              →
            </span>
          </Link>
          <AddToCartButton monkey={monkey} />
        </div>
      </div>
    </article>
  );
}
