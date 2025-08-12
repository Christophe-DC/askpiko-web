'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import ColorModeToggle from '@/components/ColorModeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-light-border/50 dark:border-dark-border/50">
      <div className="container mx-auto flex justify-between items-center h-16 px-6">
        {/* Logo à gauche */}
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        {/* Navigation à droite */}
        <div className="flex items-center gap-3">
          {/* Bouton Connexion/Inscription 
          <button
            onClick={() => alert('Login feature coming soon!')}
            className="group relative bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
          >
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
          </button>*/}

          {/* Toggle du thème */}
          {/*<ColorModeToggle />*/}
        </div>
      </div>
    </header>
  );
}
