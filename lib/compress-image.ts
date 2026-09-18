/**
 * Shrinks a photo in the browser before it is uploaded to Supabase Storage.
 *
 * Phone photos arrive at 3-12 MB each. The site never displays an image wider
 * than ~1600px, so uploading the original wastes storage, bandwidth and upload
 * time for no visible gain. This resizes the long edge down to MAX_EDGE and
 * re-encodes as JPEG, which typically cuts a 6 MB photo to about 250 KB.
 *
 * Re-encoding also drops EXIF metadata, so GPS coordinates from a phone are
 * not published with the photo.
 */

const MAX_EDGE = 1600;
const QUALITY = 0.82;

/** Returns a compressed copy, or the original if it can't be processed. */
export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  // Already-small files aren't worth re-encoding (and GIFs would lose animation).
  if (file.type === "image/gif" || file.size < 200 * 1024) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY)
    );
    if (!blob || blob.size >= file.size) return file; // no gain, keep the original

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    // Unsupported format, or a browser without createImageBitmap; upload as-is.
    return file;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
