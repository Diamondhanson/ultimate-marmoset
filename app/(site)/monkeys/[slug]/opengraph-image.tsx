import { ImageResponse } from "next/og";
import {
  BrandLockup,
  OG_CONTENT_TYPE,
  OG_SIZE,
  loadFonts,
  toShareImage,
  logoDataUri,
  palette,
  resolveImage,
} from "@/lib/og";
import { getMonkeyBySlug } from "@/lib/data";
import { formatPrice } from "@/lib/site";
import { formatAge } from "@/lib/utils";

// Satori's `alt` export is static, so this describes the card generically
// rather than naming the individual monkey.
export const alt =
  "A hand-raised monkey available at Ultimate Marmoset & Capuchin Monkeys Home";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const statusLabel = {
  available: "Available now",
  reserved: "Reserved",
  rehomed: "Rehomed",
} as const;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const monkey = await getMonkeyBySlug(slug);
  const [fonts, logo] = await Promise.all([loadFonts(), logoDataUri()]);

  // Unknown slug: still return a valid, on-brand card rather than a broken one.
  if (!monkey) {
    return toShareImage(
      new ImageResponse(
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            background: palette.canopy900,
          }}
        >
          <BrandLockup logo={logo} scale={1.6} />
        </div>,
        { ...size, fonts },
      ),
    );
  }

  const photo = await resolveImage(monkey.images[0]);
  const isAvailable = monkey.status === "available";

  return toShareImage(
    new ImageResponse(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: palette.canopy900,
        }}
      >
        {/* Copy side */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 660,
            padding: 56,
            background: `linear-gradient(135deg, ${palette.canopy800} 0%, ${palette.canopy900} 100%)`,
          }}
        >
          <BrandLockup logo={logo} scale={0.8} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "Jakarta",
                fontWeight: 800,
                fontSize: 17,
                letterSpacing: 2.6,
                color: palette.fern400,
              }}
            >
              {monkey.species.toUpperCase()}
            </span>
            <span
              style={{
                fontFamily: "Newsreader",
                fontSize: 86,
                lineHeight: 1.05,
                color: palette.mist50,
                marginTop: 10,
              }}
            >
              {monkey.name}
            </span>
            <span
              style={{
                fontFamily: "Jakarta",
                fontWeight: 500,
                fontSize: 24,
                color: palette.mist200,
                marginTop: 14,
              }}
            >
              {monkey.gender === "female" ? "Female" : "Male"} ·{" "}
              {formatAge(monkey.date_of_birth)}
              {monkey.hand_raised ? " · Hand-raised" : ""}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "Newsreader",
                fontSize: 56,
                color: palette.gold400,
                marginRight: 22,
              }}
            >
              {formatPrice(monkey.price)}
            </span>
            <span
              style={{
                fontFamily: "Jakarta",
                fontWeight: 800,
                fontSize: 17,
                letterSpacing: 1.4,
                color: isAvailable ? palette.canopy900 : palette.mist200,
                background: isAvailable ? palette.gold400 : palette.canopy700,
                borderRadius: 999,
                padding: "10px 20px",
              }}
            >
              {statusLabel[monkey.status]}
            </span>
          </div>
        </div>

        {/* Photo side */}
        <div style={{ display: "flex", position: "relative", width: 540 }}>
          {photo && (
            <img
              src={photo}
              alt=""
              width={540}
              height={630}
              style={{ objectFit: "cover" }}
            />
          )}
          {/* Satori needs explicit box dimensions on absolute overlays -
              `inset: 0` alone renders nothing. */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 540,
              height: 630,
              background: `linear-gradient(90deg, ${palette.canopy900} 0%, rgba(10,36,23,0) 32%)`,
            }}
          />
        </div>
      </div>,
      { ...size, fonts },
    ),
  );
}
