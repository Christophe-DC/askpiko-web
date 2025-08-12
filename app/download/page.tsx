export default function DownloadPage() {
  return (
    <section className="container mx-auto py-12 px-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Download the app</h1>
      <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6 max-w-2xl">
        Get AskPiko and run a full diagnostic in minutes.
      </p>
      <div className="flex gap-3">
        <a href="#" className="bg-primary text-white px-4 py-2 rounded-md">
          Google Play
        </a>
        <a href="#" className="border border-light-border dark:border-dark-border px-4 py-2 rounded-md">
          App Store
        </a>
      </div>
      <div className="mt-10 text-sm text-light-textSecondary dark:text-dark-textSecondary">
        * Placeholder links — replace with store URLs when available.
      </div>
    </section>
  );
}
