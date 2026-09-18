"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { useCart } from "./CartProvider";
import { SubmitButton } from "./SubmitButton";
import { submitOrder, type OrderFormState } from "@/app/actions/orders";
import { formatPrice, site } from "@/lib/site";

const inputClass =
  "w-full rounded-xl border border-mist-300 bg-white px-4 py-3 text-bark-900 transition-shadow placeholder:text-bark-300 focus:border-fern-400 focus:outline-none focus:ring-3 focus:ring-fern-100";
const labelClass = "mb-1.5 block text-sm font-bold text-bark-700";

export function ReserveForm() {
  const { items, removeItem } = useCart();
  const [state, action] = useActionState<OrderFormState, FormData>(
    submitOrder,
    {}
  );
  const total = items.reduce((sum, item) => sum + item.price, 0);

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-mist-200 bg-white p-12 text-center">
        <p className="font-display text-2xl font-semibold text-canopy-900">
          Your list is empty
        </p>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-bark-500">
          Add a monkey to your list and we’ll hold this page for you. Nothing is
          charged online. A reservation just starts the conversation.
        </p>
        <Link
          href="/monkeys"
          className="mt-7 inline-block rounded-xl bg-canopy-700 px-7 py-3.5 font-bold text-mist-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-canopy-800"
        >
          Browse available monkeys
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
      <form action={action} className="space-y-5">
        <input
          type="hidden"
          name="monkey_ids"
          value={JSON.stringify(items.map((i) => i.id))}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Your name *
            </label>
            <input id="name" name="name" required className={inputClass} placeholder="Jordan Ellis" />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email *
            </label>
            <input id="email" name="email" type="email" required className={inputClass} placeholder="you@example.com" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
            <input id="phone" name="phone" className={inputClass} placeholder="(555) 000-0000" />
          </div>
          <div>
            <label htmlFor="city" className={labelClass}>
              City
            </label>
            <input id="city" name="city" className={inputClass} placeholder="Austin" />
          </div>
          <div>
            <label htmlFor="state" className={labelClass}>
              State
            </label>
            <input id="state" name="state" className={inputClass} placeholder="TX" />
          </div>
        </div>

        <fieldset>
          <legend className={labelClass}>How would you like to receive them?</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                value: "pickup",
                title: "Pickup in person",
                text: `Collect from us by appointment. Secured with a refundable ${formatPrice(site.appointmentDeposit)} deposit.`,
              },
              {
                value: "delivery",
                title: "Delivery to me",
                text: "We arrange transport to your address. Timing and fees confirmed in advance.",
              },
            ].map((option, i) => (
              <label
                key={option.value}
                className="group relative flex cursor-pointer flex-col rounded-2xl border border-mist-300 bg-white p-4 transition-all duration-300 hover:border-fern-300 has-checked:border-fern-500 has-checked:bg-fern-50 has-checked:ring-2 has-checked:ring-fern-100"
              >
                <input
                  type="radio"
                  name="fulfilment"
                  value={option.value}
                  defaultChecked={i === 0}
                  className="sr-only"
                />
                <span className="font-bold text-canopy-900">{option.title}</span>
                <span className="mt-1 text-sm leading-relaxed text-bark-500">
                  {option.text}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="message" className={labelClass}>
            Tell us about your home
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className={inputClass}
            placeholder="Who lives with you, whether anyone is home during the day, other pets, and any experience you have with primates. The more you tell us, the better we can match you."
          />
        </div>

        {state.error && (
          <p className="rounded-xl bg-gold-100 px-4 py-3 text-sm font-semibold text-gold-700">
            {state.error}
          </p>
        )}

        <SubmitButton pendingLabel="Sending your request…">
          Send reservation request
        </SubmitButton>
        <p className="text-sm leading-relaxed text-bark-400">
          No payment is taken on this website. We’ll reply within 24 hours to
          talk everything through. Pickup and visit appointments are confirmed
          with a fully refundable {formatPrice(site.appointmentDeposit)} deposit
          . See our{" "}
          <Link href="/delivery-and-visits" className="font-bold text-canopy-700 underline underline-offset-2">
            delivery &amp; visits policy
          </Link>
          .
        </p>
      </form>

      <aside className="h-fit rounded-3xl border border-mist-200 bg-white p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-semibold text-canopy-900">
          Your list
        </h2>
        <ul className="mt-5 divide-y divide-mist-200">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-4">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-mist-200">
                {item.image && (
                  <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/monkeys/${item.slug}`}
                  className="font-display text-lg font-semibold text-canopy-900 transition-colors hover:text-fern-600"
                >
                  {item.name}
                </Link>
                <p className="truncate text-sm text-bark-400">{item.species}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-bold text-gold-600">{formatPrice(item.price)}</p>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="mt-1 text-xs font-semibold text-bark-400 transition-colors hover:text-canopy-700"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-baseline justify-between border-t border-mist-200 pt-5">
          <span className="font-bold text-bark-700">Estimated total</span>
          <span className="font-display text-2xl font-semibold text-gold-600">
            {formatPrice(total)}
          </span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-bark-400">
          Transport fees, if any, are quoted separately once we know your
          location.
        </p>
      </aside>
    </div>
  );
}
