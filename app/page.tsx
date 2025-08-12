import Link from 'next/link';

export default function Page() {
  return (
    <section className="container mx-auto py-12 px-6">
      <div className="bg-light-surfaceSecondary dark:bg-dark-surfaceSecondary text-light-textSecondary dark:text-dark-textSecondary inline-block rounded-full px-3 py-1 text-sm mb-3">
        Phase 1 — Find a partner
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
        Diagnose your smartphone. <span className="text-primary">Build trust</span> when selling.
      </h1>
      <p className="text-lg text-light-textSecondary dark:text-dark-textSecondary max-w-2xl mb-6">
        An app that checks a phone's condition in minutes and generates a shareable report. We're looking for a partner
        to fund and support the launch.
      </p>
      <div className="flex gap-3 flex-wrap mb-8">
        <a href="#video" className="bg-primary text-white px-4 py-2 rounded-md">
          Watch the demo
        </a>
        <Link href="/download" className="border border-light-border dark:border-dark-border px-4 py-2 rounded-md">
          Download the app
        </Link>
        <Link href="/teaser" className="border border-accent text-accent px-4 py-2 rounded-md">
          30s Teaser
        </Link>
      </div>

      <div
        id="video"
        className="rounded-2xl shadow-xl border border-light-border dark:border-dark-border bg-light-surfaceSecondary dark:bg-dark-surfaceSecondary p-3"
      >
        <video controls playsInline poster="/poster.jpg" className="w-full rounded-xl">
          <source src="/demo.mp4" type="video/mp4" />
        </video>
        <div className="flex justify-between items-center flex-wrap gap-3 mt-3">
          <span className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
            A clear video showing what the app does.
          </span>
          <Link href="/contact" className="bg-primary text-white px-4 py-2 rounded-md">
            Become a partner
          </Link>
        </div>
      </div>

      <section className="mt-12">
        <div className="bg-light-surfaceSecondary dark:bg-dark-surfaceSecondary rounded-xl border border-light-border dark:border-dark-border p-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['Shareable PDF report', 'for buyers & marketplaces'],
              ['Camera, screen, battery tests', 'full diagnostics'],
              ['API & white‑label', 'for partners'],
              ['Privacy‑respecting', 'local data only'],
            ].map(([title, sub], i) => (
              <li
                key={i}
                className="rounded-xl border border-light-border dark:border-dark-border p-4 bg-light-surface dark:bg-dark-surface"
              >
                <div className="font-bold">{title}</div>
                <div className="text-sm text-light-textSecondary dark:text-dark-textSecondary">{sub}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </section>
  );
}
