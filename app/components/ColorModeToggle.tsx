'use client';
export default function ColorModeToggle() {
  const toggle = () => document.documentElement.classList.toggle('dark');
  return (
    <button onClick={toggle} className="border border-light-border dark:border-dark-border px-4 py-2 rounded-md">
      Theme
    </button>
  );
}
