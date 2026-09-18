import { setOrderStatus } from "@/app/actions/admin";
import { getOrders } from "@/lib/data";
import { formatPrice } from "@/lib/site";
import { formatDateTime } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const statusStyles: Record<OrderStatus, string> = {
  new: "bg-fern-100 text-fern-700",
  contacted: "bg-gold-100 text-gold-700",
  completed: "bg-mist-200 text-bark-600",
  cancelled: "bg-mist-100 text-bark-400",
};

const statusOptions: OrderStatus[] = [
  "new",
  "contacted",
  "completed",
  "cancelled",
];

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-canopy-900">
        Reservations
      </h1>
      <p className="mt-2 text-bark-500">
        Every reservation request sent from the website, newest first.
      </p>

      <div className="mt-8 space-y-5">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-3xl border border-mist-200 bg-white p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-xl font-semibold text-canopy-900">
                    {order.customer_name}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                  <span className="rounded-full bg-mist-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-bark-500">
                    {order.fulfilment === "delivery" ? "Delivery" : "Pickup"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-bark-500">
                  <a
                    href={`mailto:${order.email}`}
                    className="font-semibold text-canopy-700 hover:text-fern-600"
                  >
                    {order.email}
                  </a>
                  {order.phone && <> · {order.phone}</>}
                  {(order.city || order.state) && (
                    <> · {[order.city, order.state].filter(Boolean).join(", ")}</>
                  )}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-2xl font-semibold text-gold-600">
                  {formatPrice(order.total)}
                </p>
                <p className="text-xs text-bark-400">
                  {formatDateTime(order.created_at)}
                </p>
              </div>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2">
              {(order.items ?? []).map((item) => (
                <li
                  key={item.id}
                  className="rounded-full bg-mist-100 px-3.5 py-1.5 text-sm text-bark-600"
                >
                  <span className="font-semibold text-canopy-900">
                    {item.monkey_name}
                  </span>{" "}
                  · {item.monkey_species} · {formatPrice(item.price)}
                </li>
              ))}
            </ul>

            {order.message && (
              <p className="mt-4 rounded-2xl bg-mist-100 p-4 text-sm leading-relaxed text-bark-600">
                {order.message}
              </p>
            )}

            <form
              action={setOrderStatus}
              className="mt-5 flex flex-wrap items-center gap-2 border-t border-mist-200 pt-4"
            >
              <input type="hidden" name="id" value={order.id} />
              <label
                htmlFor={`status-${order.id}`}
                className="text-sm font-bold text-bark-500"
              >
                Status
              </label>
              <select
                id={`status-${order.id}`}
                name="status"
                defaultValue={order.status}
                className="rounded-lg border border-mist-300 bg-white px-3 py-1.5 text-sm"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-lg bg-canopy-700 px-4 py-1.5 text-sm font-bold text-mist-50 transition-colors hover:bg-canopy-800"
              >
                Update
              </button>
            </form>
          </article>
        ))}

        {orders.length === 0 && (
          <div className="rounded-3xl border border-mist-200 bg-white p-12 text-center text-bark-400">
            No reservations yet.
          </div>
        )}
      </div>
    </div>
  );
}
