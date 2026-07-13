import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import '../styles/globals.css';

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Report Writer',
  description:
    'Desktop application for structured academic and professional reports.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} font-body bg-parchment-50 text-ink-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
