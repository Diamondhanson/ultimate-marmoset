/** Remounts on every navigation, replaying a soft fade-up page transition. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
