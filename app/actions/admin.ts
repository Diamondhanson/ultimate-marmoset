"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  createMonkey,
  deleteMonkey,
  deleteReview,
  updateContactStatus,
  updateMonkey,
  updateOrderStatus,
  updateReview,
} from "@/lib/data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ContactStatus, MonkeyInput, OrderStatus } from "@/lib/types";

export interface MonkeyFormState {
  error?: string;
}

const IMAGE_BUCKET = "monkey-images";

/**
 * Backstop for the browser-side compression in lib/compress-image.ts. That
 * runs first and normally brings photos to a few hundred KB; this refuses
 * anything oversized or non-image that reaches the server anyway, so storage
 * can't be filled by a stray upload.
 */
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const MAX_PHOTOS_PER_LISTING = 12;

async function uploadPhotos(files: File[]): Promise<string[]> {
  if (files.length > MAX_PHOTOS_PER_LISTING) {
    throw new Error(
      `Please upload at most ${MAX_PHOTOS_PER_LISTING} photos per listing.`
    );
  }
  const supabase = createSupabaseAdminClient();
  const urls: string[] = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      throw new Error(`"${file.name}" is not an image.`);
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error(
        `"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)} MB, over the 8 MB limit.`
      );
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, {
        contentType: file.type || "image/jpeg",
        // Listing photos never change under the same name, so let browsers
        // and the CDN hold on to them and save repeat bandwidth.
        cacheControl: "31536000",
      });
    if (error) throw new Error(`Photo upload failed: ${error.message}`);
    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

function parseMonkeyForm(formData: FormData): Omit<MonkeyInput, "images"> {
  return {
    name: String(formData.get("name") ?? "").trim(),
    species: String(formData.get("species") ?? "").trim(),
    gender: formData.get("gender") === "female" ? "female" : "male",
    markings: String(formData.get("markings") ?? "").trim(),
    date_of_birth: String(formData.get("date_of_birth") ?? "").trim(),
    price: Number(formData.get("price") ?? 0),
    description: String(formData.get("description") ?? "").trim(),
    temperament: String(formData.get("temperament") ?? "").trim(),
    vaccinated: formData.get("vaccinated") === "on",
    diaper_trained: formData.get("diaper_trained") === "on",
    hand_raised: formData.get("hand_raised") === "on",
    health_notes: String(formData.get("health_notes") ?? "").trim(),
    status: (formData.get("status") as MonkeyInput["status"]) || "available",
    featured: formData.get("featured") === "on",
  };
}

export async function saveMonkey(
  _prev: MonkeyFormState,
  formData: FormData
): Promise<MonkeyFormState> {
  await requireAdmin();

  if (!isSupabaseConfigured()) {
    return {
      error:
        "Preview mode: connect Supabase (see SETUP.md) to add or edit listings. The nursery currently shows built-in sample data.",
    };
  }

  const id = String(formData.get("id") ?? "");
  const fields = parseMonkeyForm(formData);

  if (!fields.name || !fields.species || !fields.date_of_birth) {
    return { error: "Name, species, and date of birth are required." };
  }
  if (!Number.isFinite(fields.price) || fields.price <= 0) {
    return { error: "Please enter a valid price." };
  }

  // Existing images kept from the edit form + any pasted URLs + new uploads.
  const imageUrls = formData
    .getAll("image_urls")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const photos = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  try {
    const uploaded = photos.length > 0 ? await uploadPhotos(photos) : [];
    const images = [...imageUrls, ...uploaded];
    if (images.length === 0) {
      return { error: "Add at least one photo (upload or image URL)." };
    }
    if (id) {
      await updateMonkey(id, { ...fields, images });
    } else {
      await createMonkey({ ...fields, images });
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save." };
  }

  revalidatePath("/", "layout");
  redirect("/admin/monkeys");
}

export async function removeMonkey(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!isSupabaseConfigured() || !id) return;
  await deleteMonkey(id);
  revalidatePath("/", "layout");
}

export async function setMonkeyStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as MonkeyInput["status"];
  if (!isSupabaseConfigured() || !id) return;
  if (!["available", "reserved", "rehomed"].includes(status)) return;
  await updateMonkey(id, { status });
  revalidatePath("/", "layout");
}

export async function setOrderStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  if (!isSupabaseConfigured() || !id) return;
  if (!["new", "contacted", "completed", "cancelled"].includes(status)) return;
  await updateOrderStatus(id, status);
  revalidatePath("/admin/orders");
}

export async function setContactStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ContactStatus;
  if (!isSupabaseConfigured() || !id) return;
  if (!["new", "replied"].includes(status)) return;
  await updateContactStatus(id, status);
  revalidatePath("/admin/contacts");
}

export async function setReviewApproval(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const approved = formData.get("approved") === "true";
  if (!isSupabaseConfigured() || !id) return;
  await updateReview(id, { approved });
  revalidatePath("/", "layout");
}

export async function setReviewFeatured(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const featured = formData.get("featured") === "true";
  if (!isSupabaseConfigured() || !id) return;
  await updateReview(id, { featured });
  revalidatePath("/", "layout");
}

export async function removeReview(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!isSupabaseConfigured() || !id) return;
  await deleteReview(id);
  revalidatePath("/", "layout");
}
