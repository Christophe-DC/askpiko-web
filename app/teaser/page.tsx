export default function TeaserPage() {
  return (
    <section className="container mx-auto py-12 px-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Teaser video</h1>
      <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6 max-w-2xl">
        A short 15–30s video for socials.
      </p>
      <div className="rounded-2xl shadow-xl border border-light-border dark:border-dark-border bg-light-surfaceSecondary dark:bg-dark-surfaceSecondary p-3">
        <video controls playsInline poster="/teaser-poster.jpg" className="w-full rounded-xl">
          <source src="/teaser.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
