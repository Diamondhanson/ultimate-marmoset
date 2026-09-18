import type { MonkeyStatus } from "@/lib/types";

const styles: Record<MonkeyStatus, string> = {
  available: "bg-fern-100 text-fern-700 ring-fern-200",
  reserved: "bg-gold-100 text-gold-700 ring-gold-200",
  rehomed: "bg-mist-200 text-bark-500 ring-mist-300",
};

const labels: Record<MonkeyStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  rehomed: "Rehomed",
};

export function StatusBadge({ status }: { status: MonkeyStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${styles[status]}`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          status === "available"
            ? "bg-fern-500"
            : status === "reserved"
              ? "bg-gold-500"
              : "bg-bark-300"
        }`}
      />
      {labels[status]}
    </span>
  );
}
