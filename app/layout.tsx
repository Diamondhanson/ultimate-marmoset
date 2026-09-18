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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "Marmosets & Capuchin Monkeys for Sale | Hand-Raised Primate Nursery | Ultimate Marmoset",
    template: `%s | ${site.shortName}`,
  },
  description:
    "Hand-raised marmosets, capuchins, spider monkeys and squirrel monkeys from a small in-home primate nursery. Bottle-fed, vet-checked, diaper-trained, and placed with a written health guarantee.",
  applicationName: site.shortName,
  category: "Pets",
  alternates: { canonical: "/" },
  keywords: [
    "marmoset monkey for sale",
    "capuchin monkey for sale",
    "finger monkey for sale",
    "pygmy marmoset",
    "spider monkey for sale",
    "squirrel monkey for sale",
    "baby monkey for sale",
    "hand-raised monkeys",
    "primate nursery",
    "bottle-fed capuchin",
    "diaper-trained monkey",
    "exotic pet monkey breeder",
  ],
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: `Hand-Raised Marmosets & Capuchins | ${site.tagline}`,
    description:
      "A small in-home primate nursery. Bottle-raised marmosets, capuchins and spider monkeys, vet-checked and backed by a written health guarantee.",
  },
  twitter: {
    card: "summary_large_image",
    title: `Hand-Raised Marmosets & Capuchins | ${site.tagline}`,
    description:
      "A small in-home primate nursery. Bottle-raised marmosets, capuchins and spider monkeys, vet-checked and backed by a written health guarantee.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
