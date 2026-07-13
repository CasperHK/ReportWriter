import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/styles/**/*.css',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        parchment: {
          50: '#f8f2e7',
          100: '#f0e6d6',
          200: '#e6d6bf',
        },
        ink: {
          900: '#171311',
          700: '#3f342c',
          500: '#6b5a4d',
          300: '#a08d7e',
        },
        chrome: {
          900: '#231d1a',
          800: '#2f2824',
          700: '#453c35',
          300: '#cabba9',
        },
        accent: {
          700: '#8f4e26',
          600: '#ad6031',
          500: '#c8753f',
          300: '#e2af8d',
        },
      },
      boxShadow: {
        panel: '0 16px 45px rgba(23, 19, 17, 0.16)',
        paper: '0 30px 60px rgba(35, 29, 26, 0.22), 0 4px 18px rgba(35, 29, 26, 0.14)',
        ring: '0 0 0 2px rgba(173, 96, 49, 0.35)',
      },
      borderRadius: {
        panel: '1.2rem',
      },
    },
  },
  plugins: [],
};

export default config;
