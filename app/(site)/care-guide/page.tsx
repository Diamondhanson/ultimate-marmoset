import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = pageMeta({
  title: "Pet Monkey Care Guide",
  description:
    "How to care for a pet monkey: daily routine, diet, housing, enrichment, vet care, the law in your state, and what twenty years of care costs.",
  path: "/care-guide",
});

const sections = [
  {
    id: "day",
    title: "A day in the life",
    body: [
      "Infants feed every three to four hours around the clock, including overnight, until they wean. Expect broken sleep for the first several weeks. This is the part people underestimate most.",
      "Once weaned, a young monkey needs several hours of direct interaction spread through the day, plus free-climbing time outside the enclosure under supervision. A monkey left alone all day becomes an unhappy, destructive one.",
    ],
  },
  {
    id: "diet",
    title: "Diet",
    body: [
      "Fresh produce twice daily, a species-appropriate commercial biscuit, and protein: insects for marmosets and squirrel monkeys, eggs and cooked lean meat for capuchins and spider monkeys.",
      "Vitamin D3 and calcium supplementation is not optional for indoor primates. Metabolic bone disease is the single most common preventable illness we see, and it is heartbreaking.",
      "No chocolate, caffeine, alcohol, avocado, or salted human snacks. Ever.",
    ],
  },
  {
    id: "housing",
    title: "Housing",
    body: [
      "Bigger than you think, and taller than it is wide. Height matters far more than floor space, because these animals live in the trees.",
      "Solid metal construction with secure latches. Primates open anything a toddler can open, and then some. Wooden frames and plastic clips will not hold.",
      "A warm, draft-free sleeping area kept between 75 to 85°F for infants, with a fleece pouch or hammock they can burrow into.",
    ],
  },
  {
    id: "enrichment",
    title: "Enrichment",
    body: [
      "Rotate toys weekly so nothing becomes wallpaper. Puzzle feeders, foraging boxes, ropes, swings, mirrors and safe branches all earn their place.",
      "Training with positive reinforcement is enrichment too. Target training, crate training and simple recall make vet visits dramatically less stressful for everyone.",
    ],
  },
  {
    id: "vet",
    title: "Veterinary care",
    body: [
      "Find an exotic-animal veterinarian who will see primates before you bring one home, not after. Many small-animal clinics will not, and emergencies do not wait.",
      "Annual wellness exams, TB testing, and up-to-date vaccinations are the baseline. Budget for it the way you would for any long-lived animal.",
    ],
  },
  {
    id: "legal",
    title: "Legality",
    body: [
      "Primate ownership is governed at state and often county or city level, and the rules change. Some states ban all primates, some permit smaller species only, and some require a permit issued before purchase.",
      "We check your jurisdiction with you before any reservation is accepted. If the law where you live says no, we will not sell to you. That protects you and the animal.",
    ],
  },
  {
    id: "cost",
    title: "The real cost",
    body: [
      "The purchase price is the smallest line in the budget. Housing, diet, supplements, enrichment, routine and emergency veterinary care, and the occasional replaced sofa add up over a twenty-to-forty-year life.",
      "Plan for care after you. Many owners name a guardian in their will, because a capuchin bought at thirty may well outlive its owner’s ability to care for it.",
    ],
  },
];

export default function CareGuidePage() {
  return (
    <>
      <section className="texture-canopy border-b border-canopy-800 bg-canopy-900">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            Read this first
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-mist-50 sm:text-5xl">
            How to care for a pet monkey
          </h1>
          <p className="mt-5 max-w-2xl leading-relaxed text-mist-200/80">
            This is the guide we wish every prospective owner read before they
            fell in love with a photograph. It is not designed to sell you
            anything. It is here to help you decide honestly.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
        {/* Jump links */}
        <nav aria-label="Care guide sections" className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-full border border-mist-300 bg-white px-4 py-2 text-sm font-semibold text-bark-500 transition-all duration-300 hover:border-fern-300 hover:text-canopy-800"
            >
              {section.title}
            </a>
          ))}
        </nav>

        <div className="mt-12 space-y-12">
          {sections.map((section, i) => (
            <Reveal key={section.id} delay={i * 60}>
              <section id={section.id} className="scroll-mt-28">
                <h2 className="font-display text-2xl font-semibold text-canopy-900 sm:text-3xl">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3.5">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-bark-600">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 rounded-3xl border border-gold-200 bg-gold-100/60 p-8 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-canopy-900">
              Still not sure?
            </h2>
            <p className="mt-3 leading-relaxed text-bark-600">
              That is a perfectly good place to be. Call us and describe your
              home, your hours and your household. We will tell you which
              species fits, or whether none of them do.
            </p>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-xl bg-canopy-700 px-7 py-3.5 font-bold text-mist-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-canopy-800"
              >
                Talk it through with us
              </Link>
              <Link
                href="/health-guarantee"
                className="rounded-xl border border-gold-300 bg-white px-7 py-3.5 font-bold text-canopy-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500"
              >
                Our health guarantee
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
