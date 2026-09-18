import { setContactStatus } from "@/app/actions/admin";
import { getContacts } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export default async function AdminContactsPage() {
  const contacts = await getContacts();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-canopy-900">
        Messages
      </h1>
      <p className="mt-2 text-bark-500">
        Everything sent through the contact form, newest first.
      </p>

      <div className="mt-8 space-y-5">
        {contacts.map((contact) => (
          <article
            key={contact.id}
            className={`rounded-3xl border bg-white p-6 ${
              contact.status === "new"
                ? "border-fern-200 ring-1 ring-fern-100"
                : "border-mist-200"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display text-xl font-semibold text-canopy-900">
                    {contact.name}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      contact.status === "new"
                        ? "bg-fern-100 text-fern-700"
                        : "bg-mist-200 text-bark-500"
                    }`}
                  >
                    {contact.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-bark-500">
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-semibold text-canopy-700 hover:text-fern-600"
                  >
                    {contact.email}
                  </a>
                  {contact.phone && <> · {contact.phone}</>}
                </p>
              </div>
              <p className="shrink-0 text-xs text-bark-400">
                {formatDateTime(contact.created_at)}
              </p>
            </div>

            {contact.subject && (
              <p className="mt-4 font-semibold text-bark-700">
                {contact.subject}
              </p>
            )}
            <p className="mt-2 rounded-2xl bg-mist-100 p-4 text-sm leading-relaxed text-bark-600">
              {contact.message}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-mist-200 pt-4">
              <a
                href={`mailto:${contact.email}?subject=${encodeURIComponent(
                  `Re: ${contact.subject || "your message"}`
                )}`}
                className="rounded-lg bg-canopy-700 px-4 py-1.5 text-sm font-bold text-mist-50 transition-colors hover:bg-canopy-800"
              >
                Reply by email
              </a>
              <form action={setContactStatus}>
                <input type="hidden" name="id" value={contact.id} />
                <input
                  type="hidden"
                  name="status"
                  value={contact.status === "new" ? "replied" : "new"}
                />
                <button
                  type="submit"
                  className="rounded-lg border border-mist-300 px-4 py-1.5 text-sm font-bold text-bark-500 transition-colors hover:border-fern-300"
                >
                  {contact.status === "new"
                    ? "Mark as replied"
                    : "Mark as unread"}
                </button>
              </form>
            </div>
          </article>
        ))}

        {contacts.length === 0 && (
          <div className="rounded-3xl border border-mist-200 bg-white p-12 text-center text-bark-400">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
