import Link from 'next/link';
import Logo from '@/components/Logo';
import ColorModeToggle from '@/components/ColorModeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-light-surface/70 dark:bg-dark-surface/70 backdrop-blur border-b border-light-border dark:border-dark-border">
      <div className="container mx-auto flex justify-between items-center h-16 px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-lg font-bold">AskPiko</span>
        </div>
        <nav className="flex gap-3 items-center">
          <Link href="/demo" className="border border-light-border dark:border-dark-border px-4 py-2 rounded-md">
            Demo
          </Link>
          <Link href="/download" className="border border-light-border dark:border-dark-border px-4 py-2 rounded-md">
            Download
          </Link>
          <Link href="/teaser" className="border border-light-border dark:border-dark-border px-4 py-2 rounded-md">
            Teaser
          </Link>
          <Link href="/contact" className="bg-primary text-white px-4 py-2 rounded-md">
            Contact
          </Link>
          <ColorModeToggle />
        </nav>
      </div>
    </header>
  );
}
