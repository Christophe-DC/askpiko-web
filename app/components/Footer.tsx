import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-light-border dark:border-dark-border mt-16">
      <div className="container mx-auto flex justify-between items-center h-20 px-6 text-sm text-light-textSecondary dark:text-dark-textSecondary">
        <div>© {new Date().getFullYear()} AskPiko — All rights reserved</div>
        <div className="flex gap-4">
          <Link href="/legal" className="hover:underline">
            Imprint
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
