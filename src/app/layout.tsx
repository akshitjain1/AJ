/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Akshit Jain — ML Engineer & Developer',
  description:
    'Akshit Jain is a BTech CSE (ML) student at LPU passionate about Machine Learning, problem-solving, and building impactful software solutions.',
  keywords: [
    'Akshit Jain',
    'Machine Learning',
    'ML Engineer',
    'Python Developer',
    'Portfolio',
    'LPU',
    'AI',
  ],
  authors: [{ name: 'Akshit Jain' }],
  openGraph: {
    title: 'Akshit Jain — ML Engineer & Developer',
    description: 'Machine Learning engineer building impactful AI solutions.',
    type: 'website',
  },
};

import LoadingScreen from '@/components/LoadingScreen';
import ScrollProgress from '@/components/ScrollProgress';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ScrollProgress />
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
