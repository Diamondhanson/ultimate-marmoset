export type MonkeyStatus = "available" | "reserved" | "rehomed";
export type OrderStatus = "new" | "contacted" | "completed" | "cancelled";
export type ContactStatus = "new" | "replied";

export interface Monkey {
  id: string;
  slug: string;
  name: string;
  species: string;
  gender: "male" | "female";
  markings: string;
  date_of_birth: string; // ISO date
  price: number;
  description: string;
  temperament: string;
  vaccinated: boolean;
  diaper_trained: boolean;
  hand_raised: boolean;
  health_notes: string;
  status: MonkeyStatus;
  featured: boolean;
  images: string[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  monkey_id: string | null;
  monkey_name: string;
  monkey_species: string;
  price: number;
}

export interface Order {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  /** "delivery" | "pickup": how the family plans to receive their monkey. */
  fulfilment: string;
  message: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  items?: OrderItem[];
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  message: string;
  approved: boolean;
  featured: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  created_at: string;
}

/** Fields the dashboard submits when creating/editing a monkey. */
export interface MonkeyInput {
  name: string;
  species: string;
  gender: "male" | "female";
  markings: string;
  date_of_birth: string;
  price: number;
  description: string;
  temperament: string;
  vaccinated: boolean;
  diaper_trained: boolean;
  hand_raised: boolean;
  health_notes: string;
  status: MonkeyStatus;
  featured: boolean;
  images: string[];
}
