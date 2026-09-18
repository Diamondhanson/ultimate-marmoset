import Link from "next/link";
import { getAllReviews, getContacts, getMonkeys, getOrders } from "@/lib/data";
import { formatPrice } from "@/lib/site";
import { formatDateTime } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const [monkeys, orders, contacts, reviews] = await Promise.all([
    getMonkeys(),
    getOrders(),
    getContacts(),
    getAllReviews(),
  ]);

  const available = monkeys.filter((m) => m.status === "available").length;
  const newOrders = orders.filter((o) => o.status === "new").length;
  const newMessages = contacts.filter((c) => c.status === "new").length;
  const pendingReviews = reviews.filter((r) => !r.approved).length;

  const stats = [
    {
      label: "Monkeys listed",
      value: monkeys.length,
      sub: `${available} available`,
      href: "/admin/monkeys",
    },
    {
      label: "Reservations",
      value: orders.length,
      sub: `${newOrders} new`,
      href: "/admin/orders",
    },
    {
      label: "Reviews",
      value: reviews.length,
      sub: `${pendingReviews} awaiting approval`,
      href: "/admin/reviews",
    },
    {
      label: "Messages",
      value: contacts.length,
      sub: `${newMessages} unread`,
      href: "/admin/contacts",
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-canopy-900">
          Overview
        </h1>
        <Link
          href="/admin/monkeys/new"
          className="rounded-xl bg-canopy-700 px-5 py-2.5 text-sm font-bold text-mist-50 transition-colors hover:bg-canopy-800"
        >
          + Add a monkey
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-3xl border border-mist-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_-20px_rgba(15,52,35,0.45)]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-bark-400">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-4xl font-semibold text-canopy-900">
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-semibold text-fern-600">
              {stat.sub}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-mist-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-canopy-900">
              Latest reservations
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm font-bold text-canopy-700 hover:text-fern-600"
            >
              View all →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-mist-200">
            {orders.slice(0, 5).map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-canopy-900">
                    {order.customer_name}
                  </p>
                  <p className="truncate text-sm text-bark-400">
                    {(order.items ?? []).map((i) => i.monkey_name).join(", ") ||
                      "No items"}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-bold text-gold-600">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-xs text-bark-400">
                    {formatDateTime(order.created_at)}
                  </p>
                </div>
              </li>
            ))}
            {orders.length === 0 && (
              <li className="py-6 text-center text-sm text-bark-400">
                No reservations yet.
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-3xl border border-mist-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-canopy-900">
              Latest messages
            </h2>
            <Link
              href="/admin/contacts"
              className="text-sm font-bold text-canopy-700 hover:text-fern-600"
            >
              View all →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-mist-200">
            {contacts.slice(0, 5).map((contact) => (
              <li key={contact.id} className="py-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-canopy-900">
                    {contact.name}
                  </p>
                  <p className="shrink-0 text-xs text-bark-400">
                    {formatDateTime(contact.created_at)}
                  </p>
                </div>
                <p className="mt-0.5 truncate text-sm text-bark-400">
                  {contact.subject || contact.message}
                </p>
              </li>
            ))}
            {contacts.length === 0 && (
              <li className="py-6 text-center text-sm text-bark-400">
                No messages yet.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
