"use server";

import { redirect } from "next/navigation";
import { createOrder, getMonkeysByIds } from "@/lib/data";
import { sendOrderNotification } from "@/lib/email";

export interface OrderFormState {
  error?: string;
}

export async function submitOrder(
  _prev: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  const customer_name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const fulfilment =
    formData.get("fulfilment") === "delivery" ? "delivery" : "pickup";

  let monkeyIds: string[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("monkey_ids") ?? "[]"));
    if (Array.isArray(parsed)) monkeyIds = parsed.map(String);
  } catch {
    // fall through to the empty-list error below
  }

  if (!customer_name || !email) {
    return { error: "Please fill in your name and email address." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "That email address doesn't look right." };
  }
  if (monkeyIds.length === 0) {
    return { error: "Your list is empty. Pick a monkey first." };
  }

  // Look the monkeys up server-side so prices/names can't be tampered with.
  const monkeys = await getMonkeysByIds(monkeyIds);
  if (monkeys.length !== monkeyIds.length) {
    return {
      error:
        "One of the monkeys on your list is no longer listed. Please review your list and try again.",
    };
  }
  const unavailable = monkeys.filter((m) => m.status !== "available");
  if (unavailable.length > 0) {
    return {
      error: `${unavailable.map((m) => m.name).join(", ")} ${
        unavailable.length === 1 ? "has" : "have"
      } just been reserved by another family. Please remove ${
        unavailable.length === 1 ? "that one" : "them"
      } from your list.`,
    };
  }

  const order = {
    customer_name,
    email,
    phone,
    city,
    state,
    fulfilment,
    message,
    items: monkeys.map((m) => ({
      monkey_id: m.id,
      monkey_name: m.name,
      monkey_species: m.species,
      price: m.price,
    })),
  };

  try {
    await createOrder(order);
    await sendOrderNotification(order);
  } catch (err) {
    console.error("Reservation submission failed:", err);
    return {
      error:
        "Something went wrong while sending your reservation. Please try again, or contact us directly.",
    };
  }

  redirect("/reserve/thank-you");
}
