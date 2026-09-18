"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import { saveMonkey, type MonkeyFormState } from "@/app/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";
import { compressImage, formatBytes } from "@/lib/compress-image";
import type { Monkey } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-mist-300 bg-white px-4 py-2.5 text-bark-900 transition-shadow placeholder:text-bark-300 focus:border-fern-400 focus:outline-none focus:ring-3 focus:ring-fern-100";
const labelClass = "mb-1.5 block text-sm font-bold text-bark-700";
const checkboxClass = "h-4 w-4 accent-fern-600";

export function MonkeyForm({ monkey }: { monkey?: Monkey }) {
  const [state, action] = useActionState<MonkeyFormState, FormData>(
    saveMonkey,
    {}
  );
  const [imageUrls, setImageUrls] = useState<string[]>(monkey?.images ?? []);
  const [newUrl, setNewUrl] = useState("");
  const photosRef = useRef<HTMLInputElement>(null);
  const [photoInfo, setPhotoInfo] = useState<{
    count: number;
    before: number;
    after: number;
  } | null>(null);
  const [compressing, setCompressing] = useState(false);

  /**
   * Shrinks the chosen photos in the browser, then writes them back into the
   * file input so the normal form submit uploads the small versions. Keeps
   * Supabase Storage from filling up with 8 MB phone photos.
   */
  async function handlePhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const chosen = Array.from(input.files ?? []);
    if (chosen.length === 0) {
      setPhotoInfo(null);
      return;
    }
    if (typeof DataTransfer === "undefined") return; // upload originals instead

    setCompressing(true);
    try {
      const before = chosen.reduce((sum, f) => sum + f.size, 0);
      const compressed = await Promise.all(chosen.map(compressImage));
      const after = compressed.reduce((sum, f) => sum + f.size, 0);

      const bucket = new DataTransfer();
      compressed.forEach((f) => bucket.items.add(f));
      input.files = bucket.files;

      setPhotoInfo({ count: compressed.length, before, after });
    } finally {
      setCompressing(false);
    }
  }

  const addUrl = () => {
    const url = newUrl.trim();
    if (url && !imageUrls.includes(url)) {
      setImageUrls((prev) => [...prev, url]);
      setNewUrl("");
    }
  };

  return (
    <form action={action} className="max-w-3xl space-y-6">
      {monkey && <input type="hidden" name="id" value={monkey.id} />}
      {imageUrls.map((url) => (
        <input key={url} type="hidden" name="image_urls" value={url} />
      ))}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name *
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={monkey?.name}
            className={inputClass}
            placeholder="Pip"
          />
        </div>
        <div>
          <label htmlFor="species" className={labelClass}>
            Species *
          </label>
          <input
            id="species"
            name="species"
            required
            defaultValue={monkey?.species}
            className={inputClass}
            placeholder="Common Marmoset"
            list="species-suggestions"
          />
          <datalist id="species-suggestions">
            <option value="Common Marmoset" />
            <option value="Pygmy Marmoset" />
            <option value="Brown Capuchin" />
            <option value="White-faced Capuchin" />
            <option value="Spider Monkey" />
            <option value="Squirrel Monkey" />
            <option value="Cotton-top Tamarin" />
            <option value="Macaque" />
          </datalist>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="gender" className={labelClass}>
            Sex
          </label>
          <select
            id="gender"
            name="gender"
            defaultValue={monkey?.gender ?? "male"}
            className={inputClass}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="markings" className={labelClass}>
            Colour / markings
          </label>
          <input
            id="markings"
            name="markings"
            defaultValue={monkey?.markings}
            className={inputClass}
            placeholder="Silver-agouti with white ear tufts"
          />
        </div>
        <div>
          <label htmlFor="date_of_birth" className={labelClass}>
            Date of birth *
          </label>
          <input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            required
            defaultValue={monkey?.date_of_birth}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className={labelClass}>
            Price (USD) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="1"
            step="1"
            required
            defaultValue={monkey?.price}
            className={inputClass}
            placeholder="3800"
          />
        </div>
        <div>
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={monkey?.status ?? "available"}
            className={inputClass}
          >
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="rehomed">Rehomed</option>
          </select>
        </div>
      </div>

      <fieldset className="rounded-2xl border border-mist-200 bg-mist-50 p-5">
        <legend className="px-2 text-sm font-bold text-bark-700">
          Quick facts
        </legend>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-bark-700">
            <input
              type="checkbox"
              name="vaccinated"
              defaultChecked={monkey?.vaccinated ?? true}
              className={checkboxClass}
            />
            Vaccinated for age
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-bark-700">
            <input
              type="checkbox"
              name="diaper_trained"
              defaultChecked={monkey?.diaper_trained ?? true}
              className={checkboxClass}
            />
            Diaper trained
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-bark-700">
            <input
              type="checkbox"
              name="hand_raised"
              defaultChecked={monkey?.hand_raised ?? true}
              className={checkboxClass}
            />
            Hand-raised / bottle-fed
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-bark-700">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={monkey?.featured ?? false}
              className={checkboxClass}
            />
            Feature on the home page
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="temperament" className={labelClass}>
          Temperament
        </label>
        <input
          id="temperament"
          name="temperament"
          defaultValue={monkey?.temperament}
          className={inputClass}
          placeholder="Curious, chatty, deeply bonded to his people"
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          defaultValue={monkey?.description}
          className={inputClass}
          placeholder="Personality, habits, how they were raised, what makes this one special…"
        />
      </div>

      <div>
        <label htmlFor="health_notes" className={labelClass}>
          Health notes
        </label>
        <textarea
          id="health_notes"
          name="health_notes"
          rows={3}
          defaultValue={monkey?.health_notes}
          className={inputClass}
          placeholder="Vet exams, vaccinations, TB test, deworming, what records travel with them…"
        />
      </div>

      <fieldset className="rounded-2xl border border-mist-200 bg-mist-50 p-5">
        <legend className="px-2 text-sm font-bold text-bark-700">Photos</legend>

        {imageUrls.length > 0 && (
          <ul className="flex flex-wrap gap-3">
            {imageUrls.map((url) => (
              <li key={url} className="relative">
                <div className="relative h-20 w-24 overflow-hidden rounded-xl bg-mist-200">
                  <Image src={url} alt="" fill sizes="96px" className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setImageUrls((prev) => prev.filter((u) => u !== url))
                  }
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-canopy-700 text-xs font-bold text-mist-50 shadow"
                  aria-label="Remove photo"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4">
          <label htmlFor="photos" className={labelClass}>
            Upload photos
          </label>
          <input
            id="photos"
            name="photos"
            ref={photosRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotos}
            className="block w-full text-sm text-bark-500 file:mr-4 file:rounded-lg file:border-0 file:bg-canopy-700 file:px-4 file:py-2 file:text-sm file:font-bold file:text-mist-50 hover:file:bg-canopy-800"
          />
          {compressing ? (
            <p className="mt-1.5 text-xs font-semibold text-fern-700">
              Optimising photos…
            </p>
          ) : photoInfo ? (
            <p className="mt-1.5 text-xs font-semibold text-fern-700">
              {photoInfo.count} photo{photoInfo.count === 1 ? "" : "s"} ready ·{" "}
              {formatBytes(photoInfo.after)}
              {photoInfo.after < photoInfo.before && (
                <> (shrunk from {formatBytes(photoInfo.before)})</>
              )}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-bark-400">
              Photos are resized to 1600px and compressed in your browser before
              upload, so they don’t fill up your storage. You can also paste an
              image URL below.
            </p>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            className={inputClass}
            placeholder="https://…/photo.jpg"
            aria-label="Image URL"
          />
          <button
            type="button"
            onClick={addUrl}
            className="shrink-0 rounded-xl border border-mist-300 bg-white px-5 text-sm font-bold text-bark-700 transition-colors hover:border-fern-300"
          >
            Add
          </button>
        </div>
      </fieldset>

      {state.error && (
        <p className="rounded-xl bg-gold-100 px-4 py-3 text-sm font-semibold text-gold-700">
          {state.error}
        </p>
      )}

      <SubmitButton pendingLabel="Saving…" disabled={compressing}>
        {monkey ? "Save changes" : "Add to the nursery"}
      </SubmitButton>
    </form>
  );
}
