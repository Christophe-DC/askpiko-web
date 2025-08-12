/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0057E1',
        accent: '#FFCF25',
        success: '#2ECC71',
        error: '#E45C5C',
        light: {
          surface: '#FFFFFF',
          text: '#2B2B2B',
          border: '#E0E0E0',
          textSecondary: '#6B7280',
          surfaceSecondary: '#F8FAFC',
        },
        dark: {
          surface: '#111418',
          text: '#F3F4F6',
          border: '#292C33',
          textSecondary: '#9CA3AF',
          surfaceSecondary: '#1F2937',
        },
      },
      fontFamily: { inter: ['Inter', 'sans-serif'] },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 2px 4px rgba(0,0,0,0.10)',
        lg: '0 4px 8px rgba(0,0,0,0.15)',
        xl: '0 8px 16px rgba(0,0,0,0.20)',
      },
    },
  },
  plugins: [],
};
