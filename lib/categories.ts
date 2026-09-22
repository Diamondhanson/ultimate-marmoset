import type { Monkey } from "./types";

/**
 * Species landing pages, one per search phrase the site needs to rank for
 * ("capuchin monkey for sale", "finger monkey for sale", ...).
 *
 * The owner types species freely in the dashboard ("Capuchin monkey",
 * "Common Marmoset (finger monkey)"), so each page matches loosely on a
 * pattern rather than an exact species name.
 */

export interface CategoryFact {
  label: string;
  value: string;
}

export interface CategoryFaq {
  q: string;
  a: string;
}

export interface Category {
  slug: string;
  /** Matches against a listing's species, case-insensitive. */
  match: RegExp;
  /** Short name used in links and buttons. */
  name: string;
  /** Search title, kept under ~40 characters (the site name is appended). */
  title: string;
  /** Search description, ~120 to 155 characters. */
  description: string;
  h1: string;
  intro: string[];
  facts: CategoryFact[];
  faqs: CategoryFaq[];
  image: string;
}

export const categories: Category[] = [
  {
    slug: "marmosets-for-sale",
    match: /marmoset/i,
    name: "Marmosets",
    title: "Marmoset Monkeys for Sale",
    description:
      "Hand-raised common and pygmy marmosets for sale. Bottle-fed in our home, checked by an exotic vet, and sold with a written health guarantee.",
    h1: "Marmoset monkeys for sale",
    intro: [
      "Marmosets are the smallest and most manageable monkeys we raise. An adult common marmoset weighs about as much as a can of soup, and a pygmy marmoset weighs less than a bar of soap. They chirp, whistle and chatter all day, and they are happiest with company.",
      "Every marmoset we sell is bottle-fed in our living room from a few weeks old, handled every day, and seen by an exotic-animal vet before it leaves. If you are new to primates, a marmoset is usually where we suggest starting.",
    ],
    facts: [
      { label: "Lifespan", value: "12 to 18 years" },
      { label: "Adult weight", value: "Common: 10 to 17 oz. Pygmy: about 4 oz" },
      { label: "Adult size", value: "Body 5 to 8 in, plus a longer tail" },
      { label: "Diet", value: "Tree gum, fruit, insects, marmoset biscuit" },
      { label: "Best for", value: "Calm homes where someone is around most of the day" },
    ],
    faqs: [
      {
        q: "How much does a marmoset cost?",
        a: "Prices depend on age and temperament, and every marmoset's price is listed on its own page. Expect to budget more for housing, diet and vet care over the years than for the monkey itself.",
      },
      {
        q: "Should I get one marmoset or two?",
        a: "Marmosets live in family groups in the wild and do noticeably better in pairs. We often sell siblings together and will talk through a companion price with you.",
      },
      {
        q: "Are marmosets legal to own?",
        a: "It depends on your state and sometimes your county or city. We check the rules where you live before we accept any reservation.",
      },
    ],
    image: "/monkeys/marmoset-portrait.jpg",
  },
  {
    slug: "finger-monkeys-for-sale",
    match: /pygmy|finger/i,
    name: "Finger monkeys",
    title: "Pygmy Marmoset Finger Monkeys for Sale",
    description:
      "Finger monkeys (pygmy marmosets) for sale, hand-raised and vet-checked. The smallest monkey in the world, sold with a written health guarantee.",
    h1: "Finger monkeys for sale",
    intro: [
      "Finger monkey is the everyday name for the pygmy marmoset, the smallest monkey in the world. A grown one fits in the palm of your hand and weighs around four ounces. The name comes from how a baby will wrap itself around a single finger.",
      "They are tiny, but they are not simple pets. Pygmy marmosets eat tree gum and insects, need warmth, and do best in pairs. We raise every one by hand and walk each family through the feeding and care before they take one home.",
    ],
    facts: [
      { label: "Lifespan", value: "12 to 15 years, sometimes longer" },
      { label: "Adult weight", value: "About 3.5 to 4.5 oz" },
      { label: "Adult size", value: "Body about 5 in, tail about 7 in" },
      { label: "Diet", value: "Tree gum and sap, insects, some fruit" },
      { label: "Best for", value: "Experienced keepers ready for specialist care" },
    ],
    faqs: [
      {
        q: "What is a finger monkey?",
        a: "It is the common name for the pygmy marmoset. Some people also use it loosely for any very small marmoset. If a listing matters to you, the species line on each monkey's page tells you exactly what it is.",
      },
      {
        q: "How big do finger monkeys get?",
        a: "Adults reach about five inches in the body, with a tail a little longer than that, and weigh roughly four ounces.",
      },
      {
        q: "Are finger monkeys hard to care for?",
        a: "Harder than their size suggests. They need a gum-based diet, supplements, warmth and company. We send every family home with written care notes and stay on the phone afterwards.",
      },
    ],
    image: "/monkeys/marmoset-palm.jpg",
  },
  {
    slug: "capuchin-monkeys-for-sale",
    match: /capuchin/i,
    name: "Capuchins",
    title: "Capuchin Monkeys for Sale",
    description:
      "Hand-raised baby capuchin monkeys for sale. Bottle-fed, diaper-trained, checked by an exotic vet, and sold with a written health guarantee.",
    h1: "Capuchin monkeys for sale",
    intro: [
      "Capuchins are the clever ones. They learn fast, use tools, open anything a toddler can open, and form very close bonds with the people who raise them. That is what makes them rewarding, and also what makes them a lot of work.",
      "Our capuchins are bottle-fed from a young age, wear diapers, and are used to being handled, bathed and taken to the vet. A capuchin can live 25 to 40 years, so we only place them with families who have thought that far ahead.",
    ],
    facts: [
      { label: "Lifespan", value: "25 to 40 years" },
      { label: "Adult weight", value: "About 3 to 9 lb" },
      { label: "Adult size", value: "Body 12 to 22 in, tail about the same" },
      { label: "Diet", value: "Fruit, vegetables, protein, primate biscuit" },
      { label: "Best for", value: "Families home most of the day, planning long term" },
    ],
    faqs: [
      {
        q: "How much does a capuchin monkey cost?",
        a: "Each capuchin's price is on its own page and depends on age and temperament. The lifetime cost of housing, food and vet care is far higher than the purchase price.",
      },
      {
        q: "Are capuchins good pets?",
        a: "For the right family, yes. They are affectionate and smart, but they need hours of attention every day, a secure enclosure, and a plan for care that may outlast you.",
      },
      {
        q: "Do your capuchins come diaper-trained?",
        a: "Most of them are wearing diapers comfortably before they go home, and we show you the routine we use.",
      },
    ],
    image: "/monkeys/capuchin-baby.jpg",
  },
  {
    slug: "spider-monkeys-for-sale",
    match: /spider/i,
    name: "Spider monkeys",
    title: "Spider Monkeys for Sale",
    description:
      "Hand-raised baby spider monkeys for sale. Bottle-fed at home, vet-checked, and sold with a written health guarantee. See photos and prices.",
    h1: "Spider monkeys for sale",
    intro: [
      "Spider monkeys are long-limbed climbers with a tail that works like a fifth hand. They hang, swing and wrap themselves around the people they love, and they are among the most affectionate monkeys we raise.",
      "They are also big. An adult can weigh over 15 pounds and needs real height to climb in. We raise every baby by hand and are honest with families about the space and time a spider monkey needs.",
    ],
    facts: [
      { label: "Lifespan", value: "25 to 35 years" },
      { label: "Adult weight", value: "About 13 to 24 lb" },
      { label: "Adult size", value: "Body 16 to 26 in, tail up to 35 in" },
      { label: "Diet", value: "Mostly fruit, plus leaves, vegetables and biscuit" },
      { label: "Best for", value: "Homes with lots of vertical space and time" },
    ],
    faqs: [
      {
        q: "How big do spider monkeys get?",
        a: "Adults reach 16 to 26 inches in the body with a tail that can be longer than that, and usually weigh 13 to 24 pounds.",
      },
      {
        q: "Do spider monkeys make good pets?",
        a: "They are very loving, but they need a lot of room to climb and someone with them most of the day. We will tell you honestly if your setup is not a good fit.",
      },
      {
        q: "How long do spider monkeys live?",
        a: "Around 25 to 35 years in good care, so a spider monkey is a commitment for decades.",
      },
    ],
    image: "/monkeys/spider-monkey-portrait.jpg",
  },
  {
    slug: "squirrel-monkeys-for-sale",
    match: /squirrel/i,
    name: "Squirrel monkeys",
    title: "Squirrel Monkeys for Sale",
    description:
      "Hand-raised squirrel monkeys for sale. Small, bright and busy, bottle-fed at home, vet-checked, and sold with a written health guarantee.",
    h1: "Squirrel monkeys for sale",
    intro: [
      "Squirrel monkeys are small, quick and always on the move. They have a white face mask, gold arms and legs, and more energy than any other monkey we raise. They are up and exploring from sunrise and sleep hard by early evening.",
      "Every squirrel monkey we sell is bottle-fed at home and used to people and our house dog. They suit lively households where someone is around to keep them busy.",
    ],
    facts: [
      { label: "Lifespan", value: "15 to 20 years" },
      { label: "Adult weight", value: "About 1.5 to 2.5 lb" },
      { label: "Adult size", value: "Body 10 to 14 in, tail 14 to 17 in" },
      { label: "Diet", value: "Insects, fruit, vegetables, primate biscuit" },
      { label: "Best for", value: "Active homes where someone is home most of the day" },
    ],
    faqs: [
      {
        q: "Are squirrel monkeys good pets?",
        a: "They are friendly and fun, but very active. They need plenty of space, toys and attention, and they do not like being left alone for long.",
      },
      {
        q: "How big do squirrel monkeys get?",
        a: "Adults are about 10 to 14 inches in the body with a longer tail, and weigh around 1.5 to 2.5 pounds.",
      },
      {
        q: "Are squirrel monkeys legal to own?",
        a: "Rules vary by state and sometimes by city. We check your local rules before we accept any reservation.",
      },
    ],
    image: "/monkeys/squirrel-monkey-cuddle.jpg",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** The most specific landing page for a listing, if any. */
export function categoryForSpecies(species: string): Category | undefined {
  // Pygmy / finger first, so those listings link to the narrower page.
  const order = ["finger-monkeys-for-sale", ...categories.map((c) => c.slug)];
  for (const slug of order) {
    const c = getCategory(slug);
    if (c && c.match.test(species)) return c;
  }
  return undefined;
}

const statusRank = { available: 0, reserved: 1, rehomed: 2 } as const;

export function monkeysInCategory(monkeys: Monkey[], category: Category): Monkey[] {
  return monkeys
    .filter((m) => category.match.test(m.species))
    .sort((a, b) => statusRank[a.status] - statusRank[b.status]);
}
