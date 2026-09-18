import { ImageResponse } from "next/og";
import { loadFonts, logoDataUri, palette, resolveImage } from "@/lib/og";

/**
 * Facebook / social cover art, 1640×856 (Facebook's recommended page-cover
 * size). Built on a solid brand ground rather than a full-bleed photo: the
 * nursery's photos are all phone portraits, which crop badly in a wide frame,
 * and Facebook crops the sides again on mobile. Everything sits centred so it
 * survives that crop. A static copy lives at /brand/facebook-cover.png; hit
 * this route to regenerate it after a brand change.
 */

const MEDALLIONS = [
  "/monkeys/marmoset-twins.jpg",
  "/monkeys/capuchin-pink-teddy.jpg",
  "/monkeys/spider-monkey-portrait.jpg",
  "/monkeys/white-faced-capuchins.jpg",
];

export async function GET() {
  const [fonts, logo, photos] = await Promise.all([
    loadFonts(),
    logoDataUri(),
    Promise.all(MEDALLIONS.map(resolveImage)),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${palette.canopy800} 0%, ${palette.canopy900} 55%, #061a11 100%)`,
        }}
      >
        {/* Warm light bloom behind the lockup. Satori needs explicit box
            dimensions on absolute layers. `inset: 0` alone renders nothing. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1640,
            height: 856,
            background:
              "radial-gradient(circle at 50% 34%, rgba(226,172,51,0.16) 0%, rgba(226,172,51,0) 46%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={112} height={112} alt="" style={{ marginRight: 28 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "Newsreader",
                fontSize: 62,
                color: palette.mist50,
                lineHeight: 1.04,
              }}
            >
              Ultimate Marmoset
            </span>
            <span
              style={{
                fontFamily: "Jakarta",
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: 4.4,
                color: palette.gold400,
                marginTop: 10,
              }}
            >
              &amp; CAPUCHIN MONKEYS HOME
            </span>
          </div>
        </div>

        <span
          style={{
            fontFamily: "Newsreader",
            fontSize: 44,
            color: palette.gold200,
            marginTop: 34,
            textAlign: "center",
            position: "relative",
          }}
        >
          Hand-raised monkeys, born and raised in our home
        </span>
        <span
          style={{
            fontFamily: "Jakarta",
            fontWeight: 500,
            fontSize: 24,
            color: palette.mist200,
            marginTop: 16,
            textAlign: "center",
            position: "relative",
          }}
        >
          Bottle-fed by hand · Exotic-vet checked · Written health guarantee
        </span>

        <div style={{ display: "flex", marginTop: 46, position: "relative" }}>
          {photos.map((photo, i) =>
            photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={MEDALLIONS[i]}
                src={photo}
                width={150}
                height={150}
                alt=""
                style={{
                  objectFit: "cover",
                  borderRadius: 999,
                  border: `4px solid ${palette.gold400}`,
                  marginLeft: i === 0 ? 0 : 26,
                }}
              />
            ) : null
          )}
        </div>
      </div>
    ),
    { width: 1640, height: 856, fonts }
  );
}
