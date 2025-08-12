import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="container mx-auto py-20 px-6 text-center">
      <h1 className="text-5xl font-extrabold mb-4">404</h1>
      <p className="text-light-textSecondary dark:text-dark-textSecondary mb-6">
        The page you are looking for could not be found.
      </p>
      <Link href="/" className="bg-primary text-white px-4 py-2 rounded-md">
        Back to Home
      </Link>
    </section>
  );
}
