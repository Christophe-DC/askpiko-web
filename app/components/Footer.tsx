'use client';

export default function Footer() {
  return (
    <footer className="border-t border-light-border/50 dark:border-dark-border/50 bg-light-surfaceSecondary/50 dark:bg-dark-surfaceSecondary/50">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center space-y-6">
          {/* Copyright et liens légaux */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-light-textSecondary dark:text-dark-textSecondary">
            <div>© {new Date().getFullYear()} AskPiko — All rights reserved</div>
            <div className="flex gap-6">
              {/*  <button
                onClick={() => alert('Legal page coming soon')}
                className="hover:text-primary transition-colors duration-300"
              >
                Legal
              </button>
              <button
                onClick={() => alert('Privacy policy coming soon')}
                className="hover:text-primary transition-colors duration-300"
              >
                Privacy
              </button>*/}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
