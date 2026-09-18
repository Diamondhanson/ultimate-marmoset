import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center bg-mist-50 px-4 py-24">
      <div className="max-w-md text-center">
        <p className="font-display text-7xl font-semibold text-fern-300">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-canopy-900">
          This branch is empty
        </h1>
        <p className="mt-3 leading-relaxed text-bark-500">
          The page you’re looking for has swung off somewhere else. Let’s get
          you back to the nursery.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-canopy-700 px-7 py-3.5 font-bold text-mist-50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-canopy-800"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
