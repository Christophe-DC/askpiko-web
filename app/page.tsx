'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import QRCode from 'react-qr-code';

const DOWNLOAD_URL = 'https://play.google.com/store/apps/details?id=com.askpiko.app';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Page() {
  return (
    <>
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-30 animated-gradient"
          style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          }}
        />
        <div
          className="absolute top-1/3 -right-24 h-80 w-80 rounded-full blur-3xl opacity-20 animated-gradient"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--primary))',
          }}
        />
      </div>

      {/* Intro + Video */}
      <section className="container mx-auto py-14 px-6">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(90deg, var(--primary), var(--accent))' }}
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={{ once: true }}
        >
          Diagnose your smartphone.
          <br />
          <span className="text-primary">Build trust</span> when selling.
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-light-textSecondary dark:text-dark-textSecondary max-w-3xl mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.6 } }}
          viewport={{ once: true }}
        >
          An app that checks a phone&apos;s condition in minutes and generates a shareable report. We&apos;re looking
          for a partner to fund and support the launch.
        </motion.p>

        <motion.div
          className="rounded-2xl shadow-xl border border-light-border/60 dark:border-dark-border/60 bg-light-surfaceSecondary/60 dark:bg-dark-surfaceSecondary/60 p-3 backdrop-blur glow-primary"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
          viewport={{ once: true }}
        >
          <video controls playsInline poster="/poster.jpg" className="w-full rounded-xl">
            <source src="/demo.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
        </motion.div>
      </section>

      {/* Download */}
      <section id="download" className="container mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl ring-1 ring-white/10"
        >
          <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-2">
            {/* LEFT: Headline + badges */}
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
                Download AskPiko
                <br className="hidden md:block" />
                for Android
              </h2>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {/*<a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Download on the App Store"
            className="inline-flex items-center rounded-xl bg-white/0 hover:bg-white/5 transition"
          >
            <Image
              src="/badges/app-store-badge.svg"
              alt="Download on the App Store"
              width={200}
              height={64}
              className="h-14 w-auto"
            />
          </a>*/}
                <a
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Get it on Google Play"
                  className="inline-flex items-center rounded-xl bg-white/0 hover:bg-white/5 transition"
                >
                  <Image
                    src="/badges/google-play-badge-en.png"
                    alt="Get it on Google Play"
                    width={220}
                    height={64}
                    className="h-14 w-auto"
                  />
                </a>
              </div>
            </div>

            {/* RIGHT: QR full height + caption aligned with bottom brackets */}
            <div className="relative flex items-center lg:items-end justify-center lg:justify-end min-h-[260px] sm:min-h-[320px] md:min-h-[380px]">
              <div className="relative inline-block w-full max-w-[340px] aspect-square">
                {/* QR fills parent minus padding */}
                <div className="absolute inset-0 p-3">
                  <QRCode size={512} style={{ height: '100%', width: '100%' }} value={DOWNLOAD_URL} />
                </div>

                {/* four bracket corners */}
                <span className="pointer-events-none absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-black/80 dark:border-white/80 rounded-tl" />
                <span className="pointer-events-none absolute -top-4 -right-4 w-10 h-10 border-t-2 border-r-2 border-black/80 dark:border-white/80 rounded-tr" />
                <span className="pointer-events-none absolute -bottom-4 -left-4 w-10 h-10 border-b-2 border-l-2 border-black/80 dark:border-white/80 rounded-bl" />
                <span className="pointer-events-none absolute -bottom-4 -right-4 w-10 h-10 border-b-2 border-r-2 border-black/80 dark:border-white/80 rounded-br" />

                {/* caption centered at the level of bottom brackets */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-base text-black/80 dark:text-white/80">
                  Scan to download
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact */}
      <section id="contact" className="container mx-auto px-6 pb-24">
        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={{ once: true }}
        >
          Contact us
        </motion.h2>
        <motion.p
          className="text-light-textSecondary dark:text-dark-textSecondary mb-6 max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, transition: { delay: 0.1 } }}
          viewport={{ once: true }}
        >
          Agency, operator, marketplace, or fund? Write to us and let&apos;s explore a joint launch.
        </motion.p>

        <motion.form
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const form = e.currentTarget;
            const data = new FormData(form);

            // FormData -> URLSearchParams (sans any)
            const params = new URLSearchParams();
            data.forEach((value, key) => {
              params.append(key, typeof value === 'string' ? value : value.name);
            });

            try {
              // 👉 poster vers le fichier statique pour Netlify Forms
              await fetch('/__forms.html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
              });

              form.reset(); // vider
              const msg = form.querySelector('#contact-success') as HTMLElement | null;
              if (msg) msg.classList.remove('hidden'); // afficher remerciement
            } catch {
              alert('Submission failed, please try again.');
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl border border-light-border/60 dark:border-dark-border/60 p-6 bg-light-surface/60 dark:bg-dark-surface/60 backdrop-blur"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
          viewport={{ once: true }}
        >
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>
              Don’t fill this out: <input name="bot-field" />
            </label>
          </p>

          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="border border-light-border dark:border-dark-border rounded-md px-3 py-2 bg-light-surface dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="border border-light-border dark:border-dark-border rounded-md px-3 py-2 bg-light-surface dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="border border-light-border dark:border-dark-border rounded-md px-3 py-2 bg-light-surface dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              className="relative inline-flex items-center justify-center px-6 py-2 font-semibold text-white rounded-md glow-accent overflow-hidden"
            >
              <span
                className="absolute inset-0 animated-gradient"
                style={{ background: 'linear-gradient(90deg, var(--primary), var(--accent))' }}
              />
              <span className="relative">Send</span>
            </button>
            <span className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
              We usually reply within 24–48h.
            </span>
          </div>

          {/* Message de succès (caché par défaut) */}
          <div
            id="contact-success"
            className="hidden md:col-span-2 mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-800/40 dark:bg-green-900/20 dark:text-green-300"
            aria-live="polite"
          >
            Thank you! We’ve received your message and will process it shortly.
          </div>
        </motion.form>
      </section>
    </>
  );
}
