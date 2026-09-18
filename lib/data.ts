import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "./supabase/admin";
import { isSupabaseConfigured } from "./supabase/config";
import { sampleMonkeys } from "./sample-monkeys";
import { sampleContacts, sampleOrders, sampleReviews } from "./sample-admin";
import type {
  ContactMessage,
  ContactStatus,
  Monkey,
  MonkeyInput,
  Order,
  OrderStatus,
  Review,
} from "./types";

// ---------------------------------------------------------------------------
// Monkeys (public reads use a cookie-less anon client so pages stay cacheable;
// RLS allows read-only access)
// ---------------------------------------------------------------------------

function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

export async function getMonkeys(species?: string): Promise<Monkey[]> {
  if (!isSupabaseConfigured()) {
    const all = sampleMonkeys;
    return species ? all.filter((m) => m.species === species) : all;
  }
  const supabase = createAnonClient();
  let query = supabase
    .from("monkeys")
    .select("*")
    .order("created_at", { ascending: false });
  if (species) query = query.eq("species", species);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to load monkeys: ${error.message}`);
  return data as Monkey[];
}

export async function getFeaturedMonkeys(): Promise<Monkey[]> {
  const monkeys = await getMonkeys();
  const featured = monkeys.filter(
    (m) => m.featured && m.status === "available"
  );
  return (featured.length > 0 ? featured : monkeys).slice(0, 3);
}

export async function getSpeciesList(): Promise<string[]> {
  const monkeys = await getMonkeys();
  return [...new Set(monkeys.map((m) => m.species))].sort();
}

export async function getMonkeyBySlug(slug: string): Promise<Monkey | null> {
  if (!isSupabaseConfigured()) {
    return sampleMonkeys.find((m) => m.slug === slug) ?? null;
  }
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("monkeys")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load monkey: ${error.message}`);
  return data as Monkey | null;
}

export async function getMonkeyById(id: string): Promise<Monkey | null> {
  if (!isSupabaseConfigured()) {
    return sampleMonkeys.find((m) => m.id === id) ?? null;
  }
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("monkeys")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load monkey: ${error.message}`);
  return data as Monkey | null;
}

export async function getMonkeysByIds(ids: string[]): Promise<Monkey[]> {
  if (ids.length === 0) return [];
  if (!isSupabaseConfigured()) {
    return sampleMonkeys.filter((m) => ids.includes(m.id));
  }
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("monkeys")
    .select("*")
    .in("id", ids);
  if (error) throw new Error(`Failed to load monkeys: ${error.message}`);
  return data as Monkey[];
}

// ---------------------------------------------------------------------------
// Monkeys (admin writes; callers must verify the admin session first)
// ---------------------------------------------------------------------------

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createMonkey(input: MonkeyInput): Promise<Monkey> {
  const supabase = createSupabaseAdminClient();
  const slug = `${slugify(input.name)}-${slugify(input.species)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
  const { data, error } = await supabase
    .from("monkeys")
    .insert({ ...input, slug })
    .select()
    .single();
  if (error) throw new Error(`Failed to create listing: ${error.message}`);
  return data as Monkey;
}

export async function updateMonkey(
  id: string,
  input: Partial<MonkeyInput>
): Promise<Monkey> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("monkeys")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(`Failed to update listing: ${error.message}`);
  return data as Monkey;
}

export async function deleteMonkey(id: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("monkeys").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete listing: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Reservations
// ---------------------------------------------------------------------------

export interface NewOrder {
  customer_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  fulfilment: string;
  message: string;
  items: {
    monkey_id: string;
    monkey_name: string;
    monkey_species: string;
    price: number;
  }[];
}

/** Returns the created reservation id, or null in preview mode (nothing persisted). */
export async function createOrder(order: NewOrder): Promise<string | null> {
  const total = order.items.reduce((sum, item) => sum + item.price, 0);
  if (!isSupabaseConfigured()) {
    console.log("[preview] Reservation received (not persisted):", order);
    return null;
  }
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: order.customer_name,
      email: order.email,
      phone: order.phone,
      city: order.city,
      state: order.state,
      fulfilment: order.fulfilment,
      message: order.message,
      total,
    })
    .select("id")
    .single();
  if (error) throw new Error(`Failed to save reservation: ${error.message}`);

  const { error: itemsError } = await supabase.from("order_items").insert(
    order.items.map((item) => ({ order_id: data.id, ...item }))
  );
  if (itemsError)
    throw new Error(`Failed to save reservation items: ${itemsError.message}`);

  // Monkey status is NOT changed here on purpose: the owner decides when a
  // listing becomes "reserved" or "rehomed" from the dashboard.
  return data.id as string;
}

export async function getOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return sampleOrders;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load reservations: ${error.message}`);
  return (data ?? []).map((row) => {
    const { order_items, ...order } = row as Order & {
      order_items: Order["items"];
    };
    return { ...order, items: order_items ?? [] };
  });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(`Failed to update reservation: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------

export interface NewContact {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function createContact(contact: NewContact): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log("[preview] Contact message received (not persisted):", contact);
    return;
  }
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("contacts").insert(contact);
  if (error) throw new Error(`Failed to save message: ${error.message}`);
}

export async function getContacts(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured()) return sampleContacts;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load messages: ${error.message}`);
  return data as ContactMessage[];
}

export async function updateContactStatus(
  id: string,
  status: ContactStatus
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("contacts")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(`Failed to update message: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export interface NewReview {
  name: string;
  location: string;
  rating: number;
  message: string;
}

/** Public: approved reviews only, featured ones first. */
export async function getApprovedReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured()) {
    return sampleReviews.filter((r) => r.approved);
  }
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("approved", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load reviews: ${error.message}`);
  return data as Review[];
}

/** Admin: everything, pending first so new submissions surface on top. */
export async function getAllReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured()) return sampleReviews;
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("approved", { ascending: true })
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to load reviews: ${error.message}`);
  return data as Review[];
}

export async function createReview(review: NewReview): Promise<void> {
  if (!isSupabaseConfigured()) {
    console.log("[preview] Review received (not persisted):", review);
    return;
  }
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("reviews").insert(review);
  if (error) throw new Error(`Failed to save review: ${error.message}`);
}

export async function updateReview(
  id: string,
  patch: Partial<Pick<Review, "approved" | "featured">>
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("reviews").update(patch).eq("id", id);
  if (error) throw new Error(`Failed to update review: ${error.message}`);
}

export async function deleteReview(id: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(`Failed to delete review: ${error.message}`);
}
