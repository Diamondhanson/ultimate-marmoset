import type { ContactMessage, Order, Review } from "./types";

/**
 * Placeholder reservations/messages/reviews shown in the dashboard while
 * Supabase is not configured, so the admin screens can be previewed. Real data
 * replaces these automatically once the keys are in.
 */
export const sampleOrders: Order[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    customer_name: "Danielle Reyes",
    email: "danielle.reyes@example.com",
    phone: "(555) 867-5309",
    city: "Austin",
    state: "TX",
    fulfilment: "pickup",
    message:
      "We have wanted a marmoset for three years and finally have the room and a vet lined up. We would like to book a visit first and are happy to put the deposit down today.",
    status: "new",
    total: 3800,
    created_at: "2026-09-14T15:24:00Z",
    items: [
      {
        id: "11000000-0000-4000-8000-000000000001",
        order_id: "10000000-0000-4000-8000-000000000001",
        monkey_id: "00000000-0000-4000-8000-000000000001",
        monkey_name: "Pip",
        monkey_species: "Common Marmoset",
        price: 3800,
      },
    ],
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    customer_name: "Marcus Whitfield",
    email: "m.whitfield@example.com",
    phone: "(555) 221-8890",
    city: "Scottsdale",
    state: "AZ",
    fulfilment: "delivery",
    message:
      "Interested in Mango. I work from home full time and already keep an exotic vet on file. Please send delivery pricing to 85251.",
    status: "contacted",
    total: 8200,
    created_at: "2026-09-11T09:02:00Z",
    items: [
      {
        id: "11000000-0000-4000-8000-000000000002",
        order_id: "10000000-0000-4000-8000-000000000002",
        monkey_id: "00000000-0000-4000-8000-000000000004",
        monkey_name: "Mango",
        monkey_species: "Brown Capuchin",
        price: 8200,
      },
    ],
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    customer_name: "Priya & Tom Anand",
    email: "anand.household@example.com",
    phone: "(555) 640-1177",
    city: "Naperville",
    state: "IL",
    fulfilment: "pickup",
    message:
      "We'd like to take Pip and Willow together so they stay a pair. Is there a companion discount?",
    status: "completed",
    total: 7900,
    created_at: "2026-09-02T18:40:00Z",
    items: [
      {
        id: "11000000-0000-4000-8000-000000000003",
        order_id: "10000000-0000-4000-8000-000000000003",
        monkey_id: "00000000-0000-4000-8000-000000000001",
        monkey_name: "Pip",
        monkey_species: "Common Marmoset",
        price: 3800,
      },
      {
        id: "11000000-0000-4000-8000-000000000004",
        order_id: "10000000-0000-4000-8000-000000000003",
        monkey_id: "00000000-0000-4000-8000-000000000002",
        monkey_name: "Willow",
        monkey_species: "Common Marmoset",
        price: 4100,
      },
    ],
  },
];

export const sampleContacts: ContactMessage[] = [
  {
    id: "20000000-0000-4000-8000-000000000001",
    name: "Alicia Moreno",
    email: "alicia.moreno@example.com",
    phone: "(555) 902-3311",
    subject: "Legality in Washington State",
    message:
      "Before I go any further, are capuchins legal to own in Washington? I would rather find out now than fall in love with Pearl first.",
    status: "new",
    created_at: "2026-09-15T12:05:00Z",
  },
  {
    id: "20000000-0000-4000-8000-000000000002",
    name: "Grant Whitaker",
    email: "gwhitaker@example.com",
    phone: "",
    subject: "Enclosure requirements for a spider monkey",
    message:
      "I have a 12ft ceiling in a converted sunroom and a fully fenced yard. Would that be enough vertical space for Nova, or should I be looking at a smaller species?",
    status: "replied",
    created_at: "2026-09-09T08:31:00Z",
  },
  {
    id: "20000000-0000-4000-8000-000000000003",
    name: "Renata Silva",
    email: "renata.s@example.com",
    phone: "(555) 448-0092",
    subject: "Waitlist for the spring litter",
    message:
      "Everything available right now is a little older than we hoped. Could you add us to the waitlist for the next marmoset litter?",
    status: "new",
    created_at: "2026-09-06T17:12:00Z",
  },
];

export const sampleReviews: Review[] = [
  {
    id: "30000000-0000-4000-8000-000000000001",
    name: "Danielle & Marco R.",
    location: "Austin, TX",
    rating: 5,
    message:
      "The deposit for the visit felt odd at first, and now I understand why they ask. We got two full hours, every question answered, and nobody rushing us. Pip has been home six weeks and he is exactly the monkey they described.",
    approved: true,
    featured: true,
    created_at: "2026-08-30T14:00:00Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    name: "Kenneth B.",
    location: "Charlotte, NC",
    rating: 5,
    message:
      "They talked me out of a spider monkey and into a marmoset, which cost them money and won my trust. That conversation told me everything I needed to know about them.",
    approved: true,
    featured: true,
    created_at: "2026-08-18T09:30:00Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    name: "The Anand family",
    location: "Naperville, IL",
    rating: 5,
    message:
      "Delivery was handled start to finish: health certificate, travel crate, a call when they set off and another when they were twenty minutes away. Both girls arrived calm and were eating within the hour.",
    approved: true,
    featured: false,
    created_at: "2026-08-04T11:45:00Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000004",
    name: "Sofia L.",
    location: "Miami, FL",
    rating: 4,
    message:
      "Wonderful nursery and a healthy, beautiful capuchin. My only note is that they are busy, so give them a day to reply. Once they do, they are thorough.",
    approved: true,
    featured: false,
    created_at: "2026-07-22T16:20:00Z",
  },
  {
    id: "30000000-0000-4000-8000-000000000005",
    name: "Hannah T.",
    location: "Portland, OR",
    rating: 5,
    message:
      "Six months of emails before we committed, and they never once pushed us. The care guide they sent home is better than anything I found online.",
    approved: false,
    featured: false,
    created_at: "2026-09-13T19:05:00Z",
  },
];
