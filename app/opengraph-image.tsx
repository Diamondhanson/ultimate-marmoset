import { ImageResponse } from "next/og";
import {
  BrandLockup,
  OG_SIZE,
  loadFonts,
  logoDataUri,
  palette,
  resolveImage,
} from "@/lib/og";

export const alt =
  "Ultimate Marmoset & Capuchin Monkeys Home: hand-raised marmosets, capuchins and spider monkeys";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const [fonts, logo, photo] = await Promise.all([
    loadFonts(),
    logoDataUri(),
    resolveImage("/monkeys/marmoset-twins.jpg"),
  ]);

  return new ImageResponse(
    (
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
            width: 690,
            padding: 56,
            background: `linear-gradient(135deg, ${palette.canopy800} 0%, ${palette.canopy900} 100%)`,
          }}
        >
          <BrandLockup logo={logo} />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "Newsreader",
                fontSize: 64,
                lineHeight: 1.08,
                color: palette.mist50,
              }}
            >
              Tiny hands that will
            </span>
            <span
              style={{
                fontFamily: "Newsreader",
                fontSize: 64,
                lineHeight: 1.08,
                color: palette.gold400,
              }}
            >
              hold on for decades
            </span>
            <span
              style={{
                fontFamily: "Jakarta",
                fontWeight: 500,
                fontSize: 24,
                lineHeight: 1.45,
                color: palette.mist200,
                marginTop: 22,
              }}
            >
              A small in-home primate nursery. Every baby bottle-fed by hand,
              vet-checked, and placed with a written health guarantee.
            </span>
          </div>

          <div style={{ display: "flex" }}>
            {["Marmosets", "Capuchins", "Spider monkeys", "Squirrel monkeys"].map(
              (chip) => (
                <span
                  key={chip}
                  style={{
                    fontFamily: "Jakarta",
                    fontWeight: 800,
                    fontSize: 16,
                    color: palette.gold200,
                    border: `1px solid ${palette.canopy700}`,
                    borderRadius: 999,
                    padding: "8px 16px",
                    marginRight: 10,
                  }}
                >
                  {chip}
                </span>
              )
            )}
          </div>
        </div>

        {/* Photo side */}
        <div style={{ display: "flex", position: "relative", width: 510 }}>
          {photo && (
             
            <img
              src={photo}
              alt=""
              width={510}
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
              width: 510,
              height: 630,
              background: `linear-gradient(90deg, ${palette.canopy900} 0%, rgba(10,36,23,0) 34%)`,
            }}
          />
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
