import { MonkeyForm } from "@/components/admin/MonkeyForm";

export default function NewMonkeyPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-canopy-900">
        Add a monkey
      </h1>
      <p className="mt-2 text-bark-500">
        Everything here appears on the public listing page.
      </p>
      <div className="mt-8">
        <MonkeyForm />
      </div>
    </div>
  );
}
