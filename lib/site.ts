/**
 * Central place for business details. Edit these once the real info is ready;
 * every page, email, and footer reads from here.
 */
export const site = {
  /** Full legal/brand name, used in emails, SEO, and the footer. */
  name: "Ultimate Marmoset & Capuchin Monkeys Home",
  /** Compact name for the header, badges, and tight spaces. */
  shortName: "Ultimate Marmoset",
  tagline: "Hand-raised monkeys, born and raised in our home",
  url: "https://ultimatemarmoset.com",
  currency: "USD",
  phone: "+1 (555) 014-2277", // TODO: replace with the real number
  email: "ultimatemonkeyshome@gmail.com",
  hours: "Monday to Saturday, 9am to 6pm",
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  /** Deposit required to hold a pickup slot or a visit appointment. */
  appointmentDeposit: 500,
  /** Notice required to cancel or reschedule an appointment. */
  rescheduleNotice: "24 hours",
};

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
