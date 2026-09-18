import Image from "next/image";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { removeMonkey, setMonkeyStatus } from "@/app/actions/admin";
import { getMonkeys } from "@/lib/data";
import { formatPrice } from "@/lib/site";
import { formatAge } from "@/lib/utils";

const statusOptions = ["available", "reserved", "rehomed"] as const;

export default async function AdminMonkeysPage() {
  const monkeys = await getMonkeys();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-canopy-900">
          Monkeys
        </h1>
        <Link
          href="/admin/monkeys/new"
          className="rounded-xl bg-canopy-700 px-5 py-2.5 text-sm font-bold text-mist-50 transition-colors hover:bg-canopy-800"
        >
          + Add a monkey
        </Link>
      </div>

      {/* Phone: card list */}
      <div className="mt-8 space-y-4 md:hidden">
        {monkeys.map((monkey) => (
          <article
            key={monkey.id}
            className="rounded-3xl border border-mist-200 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-mist-200">
                {monkey.images[0] && (
                  <Image
                    src={monkey.images[0]}
                    alt={monkey.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-lg font-semibold text-canopy-900">
                    {monkey.name}
                  </p>
                  <p className="font-bold text-gold-600">
                    {formatPrice(monkey.price)}
                  </p>
                </div>
                <p className="truncate text-xs text-bark-400">
                  {monkey.species} ·{" "}
                  {monkey.gender === "female" ? "Female" : "Male"} ·{" "}
                  {formatAge(monkey.date_of_birth)}
                </p>
                <div className="mt-1.5">
                  <StatusBadge status={monkey.status} />
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-mist-200 pt-3">
              <form action={setMonkeyStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={monkey.id} />
                <select
                  name="status"
                  defaultValue={monkey.status}
                  className="rounded-lg border border-mist-300 bg-white px-2 py-1.5 text-xs"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="rounded-lg bg-mist-100 px-3 py-1.5 text-xs font-bold text-bark-500 hover:bg-mist-200"
                >
                  Set
                </button>
              </form>
              <div className="flex items-center gap-2">
                <Link
                  href={`/monkeys/${monkey.slug}`}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold text-bark-400 hover:bg-mist-100"
                >
                  View
                </Link>
                <Link
                  href={`/admin/monkeys/${monkey.id}/edit`}
                  className="rounded-lg bg-fern-100 px-3 py-1.5 text-xs font-bold text-fern-700 hover:bg-fern-200"
                >
                  Edit
                </Link>
                <form action={removeMonkey}>
                  <input type="hidden" name="id" value={monkey.id} />
                  <button
                    type="submit"
                    className="rounded-lg bg-gold-100 px-3 py-1.5 text-xs font-bold text-gold-700 hover:bg-gold-200"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
        {monkeys.length === 0 && (
          <div className="rounded-3xl border border-mist-200 bg-white p-10 text-center text-bark-400">
            No monkeys listed yet. Add your first one.
          </div>
        )}
      </div>

      {/* Tablet/desktop: table */}
      <div className="mt-8 hidden overflow-x-auto rounded-3xl border border-mist-200 bg-white md:block">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-mist-200 text-xs font-bold uppercase tracking-wide text-bark-400">
            <tr>
              <th className="px-5 py-4">Monkey</th>
              <th className="px-5 py-4">Species</th>
              <th className="px-5 py-4">Age</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist-200">
            {monkeys.map((monkey) => (
              <tr key={monkey.id}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-mist-200">
                      {monkey.images[0] && (
                        <Image
                          src={monkey.images[0]}
                          alt={monkey.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-canopy-900">
                        {monkey.name}
                      </p>
                      <p className="text-xs text-bark-400">
                        {monkey.gender === "female" ? "Female" : "Male"} ·{" "}
                        {monkey.markings}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-bark-500">{monkey.species}</td>
                <td className="px-5 py-3 text-bark-500">
                  {formatAge(monkey.date_of_birth)}
                </td>
                <td className="px-5 py-3 font-bold text-gold-600">
                  {formatPrice(monkey.price)}
                </td>
                <td className="px-5 py-3">
                  <form
                    action={setMonkeyStatus}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="id" value={monkey.id} />
                    <StatusBadge status={monkey.status} />
                    <select
                      name="status"
                      defaultValue={monkey.status}
                      className="rounded-lg border border-mist-300 bg-white px-2 py-1 text-xs"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-lg bg-mist-100 px-2 py-1 text-xs font-bold text-bark-500 hover:bg-mist-200"
                    >
                      Set
                    </button>
                  </form>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/monkeys/${monkey.slug}`}
                      className="rounded-lg px-3 py-1.5 text-xs font-bold text-bark-400 hover:bg-mist-100"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/monkeys/${monkey.id}/edit`}
                      className="rounded-lg bg-fern-100 px-3 py-1.5 text-xs font-bold text-fern-700 hover:bg-fern-200"
                    >
                      Edit
                    </Link>
                    <form action={removeMonkey}>
                      <input type="hidden" name="id" value={monkey.id} />
                      <button
                        type="submit"
                        className="rounded-lg bg-gold-100 px-3 py-1.5 text-xs font-bold text-gold-700 hover:bg-gold-200"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {monkeys.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-bark-400">
                  No monkeys listed yet. Add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
