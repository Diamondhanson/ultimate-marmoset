import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared pieces for the generated share images (Open Graph cards, social
 * cover art). Everything here runs at build/request time on the server and is
 * rendered by Satori via `next/og`, which needs real font bytes and inlined
 * image data rather than CSS or URLs.
 */

export const OG_SIZE = { width: 1200, height: 630 };

export const palette = {
  canopy900: "#0a2417",
  canopy800: "#0f3423",
  canopy700: "#16492f",
  fern400: "#57ae7c",
  gold400: "#e2ac33",
  gold200: "#f7e0a6",
  mist50: "#f7fbf8",
  mist200: "#e1ebe4",
};

const assets = (file: string) => join(process.cwd(), "assets", file);

/** Brand fonts, loaded once per server process. */
export async function loadFonts() {
  const [display, body, bodyBold] = await Promise.all([
    readFile(assets("Newsreader-SemiBold.ttf")),
    readFile(assets("PlusJakartaSans-Medium.ttf")),
    readFile(assets("PlusJakartaSans-ExtraBold.ttf")),
  ]);
  return [
    { name: "Newsreader", data: display, style: "normal" as const, weight: 600 as const },
    { name: "Jakarta", data: body, style: "normal" as const, weight: 500 as const },
    { name: "Jakarta", data: bodyBold, style: "normal" as const, weight: 800 as const },
  ];
}

/** The logo mark as a data URI, so Satori can draw it with a plain <img>. */
export async function logoDataUri(): Promise<string> {
  const svg = await readFile(join(process.cwd(), "public", "brand", "logo.svg"));
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

/**
 * Resolves a listing photo to something Satori can draw. Local paths (the
 * sample photos in /public) are inlined as data URIs; remote ones (Supabase
 * Storage, once the dashboard is live) are passed straight through for
 * ImageResponse to fetch.
 */
export async function resolveImage(src: string | undefined): Promise<string | null> {
  if (!src) return null;
  if (!src.startsWith("/")) return src;
  try {
    const file = await readFile(join(process.cwd(), "public", src.slice(1)));
    const ext = src.split(".").pop()?.toLowerCase() ?? "jpg";
    return `data:${MIME[ext] ?? "image/jpeg"};base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Small brand lockup used in the corner of every share image. */
export function BrandLockup({
  logo,
  scale = 1,
}: {
  logo: string;
  scale?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        width={64 * scale}
        height={64 * scale}
        alt=""
        style={{ marginRight: 18 * scale }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontFamily: "Newsreader",
            fontSize: 30 * scale,
            color: palette.mist50,
            lineHeight: 1.1,
          }}
        >
          Ultimate Marmoset
        </span>
        <span
          style={{
            fontFamily: "Jakarta",
            fontWeight: 800,
            fontSize: 14 * scale,
            letterSpacing: 2.4 * scale,
            color: palette.gold400,
            marginTop: 4 * scale,
          }}
        >
          &amp; CAPUCHIN MONKEYS HOME
        </span>
      </div>
    </div>
  );
}
