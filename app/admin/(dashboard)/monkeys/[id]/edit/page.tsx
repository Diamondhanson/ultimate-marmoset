import { notFound } from "next/navigation";
import { MonkeyForm } from "@/components/admin/MonkeyForm";
import { getMonkeyById } from "@/lib/data";

export default async function EditMonkeyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const monkey = await getMonkeyById(id);
  if (!monkey) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-canopy-900">
        Edit {monkey.name}
      </h1>
      <p className="mt-2 text-bark-500">
        Changes go live on the website as soon as you save.
      </p>
      <div className="mt-8">
        <MonkeyForm monkey={monkey} />
      </div>
    </div>
  );
}
