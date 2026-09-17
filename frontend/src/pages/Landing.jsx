import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">TIFFIN OPERATIONS PLATFORM</p>
          <h1>Run daily deliveries. Bill only for days actually served.</h1>
          <p>
            Manage subscriptions, pauses, weekday billing, delivery
            notifications, mid-cycle transfers and messy customer imports.
          </p>
          <Link className="primary" to="/login">Open TiffinTrack</Link>
        </div>
      </section>

      <section className="grid">
        <article>
          <h3>What it is</h3>
          <p>A lightweight management system for home-style tiffin services.</p>
        </article>
        <article>
          <h3>Key features</h3>
          <p>Pro-rated billing, pause history, delivery outbox, transfers and CSV import.</p>
        </article>
        <article>
          <h3>Target audience</h3>
          <p>Small tiffin owners and lunch delivery operators.</p>
        </article>
        <article>
          <h3>Next features</h3>
          <p>Online payments · WhatsApp notifications · Delivery staff management.</p>
        </article>
      </section>
    </>
  );
}
