export default function ContactPage() {
  return (
    <section className="container mx-auto py-12 px-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact us</h1>
      <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6 max-w-2xl">
        Agency, operator, marketplace, or fund? Write to us and let's explore a joint launch.
      </p>
      <div className="flex gap-3 flex-wrap">
        <a
          className="bg-primary text-white px-4 py-2 rounded-md"
          href="mailto:da.costa.christophe.mail@gmail.com?subject=AskPiko%20Partnership&body=Hi%20Christophe,%20"
        >
          Email us
        </a>
        <a
          className="border border-light-border dark:border-dark-border px-4 py-2 rounded-md"
          href="https://cal.com/"
          target="_blank"
          rel="noreferrer"
        >
          Book a meeting
        </a>
      </div>
    </section>
  );
}
