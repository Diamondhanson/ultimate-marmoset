import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "About Our Monkey Nursery",
  description:
    "Meet the family behind our in-home monkey nursery: how we bottle-raise every baby, how we choose homes, and why we turn some people away.",
  path: "/about",
});

const values = [
  {
    title: "Nobody here lives in a cage",
    text: "Our babies are raised in the house: on the sofa, in a sling, in a playpen next to the kitchen. Cages are for sleeping and safety, not for living.",
  },
  {
    title: "We say no, often",
    text: "Most enquiries do not end in a sale, and that is deliberate. If the species is wrong for your home, or your state does not allow it, we will tell you so.",
  },
  {
    title: "The relationship doesn’t end at the door",
    text: "Every family gets our direct number. Diet questions at eleven at night, a first vet visit, a behaviour problem at two years old. Call us.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="texture-canopy border-b border-canopy-800 bg-canopy-900">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
              Who we are
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold text-mist-50 sm:text-5xl">
              A small monkey nursery, run from our home
            </h1>
            <p className="mt-5 leading-relaxed text-mist-200/80">
              {site.name} is a family operation. There is no warehouse, no sales
              team, and no list of a hundred animals. There is a house, a
              nursery room, a very tolerant dog, and a handful of babies at any
              one time.
            </p>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-[2rem] shadow-2xl shadow-canopy-950/40 ring-1 ring-mist-50/15">
            <Image
              src="/monkeys/spider-monkeys-ride.jpg"
              alt="Two young spider monkeys being carried around the house"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
        <Reveal>
          <div className="space-y-5 text-lg leading-relaxed text-bark-600">
            <p>
              We started the way most people do, with one marmoset, a stack of
              books, and an exotic vet who was very patient with us. Fifteen
              years later the books have been replaced by experience, but the vet
              is still the first number we call.
            </p>
            <p>
              Every baby that leaves here has been bottle-fed by hand, carried in
              a pouch, introduced to the vacuum cleaner, the doorbell, the car,
              and the dog. That early work is the difference between a confident
              adult primate and a frightened one, and it cannot be rushed or
              outsourced.
            </p>
            <p>
              We are equally honest about the hard parts. Primates are noisy,
              messy, long-lived and legally complicated. They are not a pet for
              everyone, and the families who thrive with them are the ones who
              knew exactly what they were signing up for.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={i * 110} className="h-full">
              <div className="h-full rounded-3xl border border-mist-200 bg-white p-7">
                <h2 className="font-display text-xl font-semibold text-canopy-900">
                  {value.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-bark-500">
                  {value.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl ring-1 ring-mist-200">
              <Image
                src="/monkeys/squirrel-monkey-cuddle.jpg"
                alt="A squirrel monkey being held close"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl ring-1 ring-mist-200">
              <Image
                src="/monkeys/monkeys-and-dog.jpg"
                alt="Two young monkeys riding on the family dog"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-14 rounded-3xl border border-fern-200 bg-fern-50 p-8 text-center sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-canopy-900 sm:text-3xl">
              Come and see for yourself
            </h2>
            <p className="mx-auto mt-3 max-w-lg leading-relaxed text-bark-500">
              Visits are welcome by appointment. Read how appointments work, then
              pick a time that suits you.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Link
                href="/delivery-and-visits"
                className="rounded-xl bg-canopy-700 px-7 py-3.5 font-bold text-mist-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-canopy-800"
              >
                How visits work
              </Link>
              <Link
                href="/monkeys"
                className="rounded-xl border border-fern-300 bg-white px-7 py-3.5 font-bold text-canopy-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-fern-500"
              >
                Meet the babies
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
