'use client';

import { useState } from 'react';
import Logo from '@/components/Logo';
import ColorModeToggle from '@/components/ColorModeToggle';
import AuthModal from '@/components/AuthModal';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user, loading } = useAuth();

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-light-border/50 dark:border-dark-border/50">
        <div className="container mx-auto flex justify-between items-center h-16 px-6">
          {/* Logo à gauche */}
          <div className="flex items-center gap-3">
            <Logo />
          </div>

          {/* Navigation à droite */}
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  // Utilisateur connecté
                  <UserMenu />
                ) : (
                  // Utilisateur non connecté
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAuthModal('login')}
                      className="px-4 py-2 text-sm font-medium text-light-text dark:text-dark-text hover:text-[var(--primary)] transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => openAuthModal('signup')}
                      className="group relative bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
                    >
                      <span className="relative z-10">Sign Up</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Toggle du thème 
            <ColorModeToggle />*/}
          </div>
        </div>
      </header>

      {/* Modal d'authentification */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />
    </>
  );
}
