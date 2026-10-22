import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="section cream" style={{ minHeight: "100svh" }}>
      <div className="wrap narrow">
        <p className="kicker">CTWP · Your Copier Company</p>
        <h2>We couldn&rsquo;t find that page.</h2>
        <p className="sub">The link may be mistyped. Call us and we&rsquo;ll help you directly.</p>
        <a href={PHONE_HREF} className="btn btnRed btnFull btnBig">Call {PHONE_DISPLAY}</a>
        <p style={{ marginTop: 16 }}><a href="/">See how CTWP helps local offices</a></p>
      </div>
    </main>
  );
}
