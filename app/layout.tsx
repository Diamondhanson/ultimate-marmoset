import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { site } from "@/lib/site";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const HOME_TITLE = "Marmoset & Capuchin Monkeys for Sale | Ultimate Marmoset";
const HOME_DESCRIPTION =
  "Hand-raised marmosets, capuchins, spider and squirrel monkeys for sale. Bottle-fed in our home, vet-checked, and sold with a written health guarantee.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: HOME_TITLE,
    template: `%s | ${site.shortName}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: site.shortName,
  category: "Pets",
  // No canonical here on purpose: every page sets its own. A canonical in the
  // root layout is inherited by any page that forgets one, which tells Google
  // that page is a duplicate of the home page.
  keywords: [
    "marmoset monkey for sale",
    "capuchin monkey for sale",
    "finger monkey for sale",
    "pygmy marmoset for sale",
    "spider monkey for sale",
    "squirrel monkey for sale",
    "baby monkey for sale",
    "pet monkey for sale",
    "hand-raised monkeys",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Google Search Console HTML-tag verification. Set GOOGLE_SITE_VERIFICATION
  // to the code from the "HTML tag" method (just the content value).
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
