/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Akshit Jain — AI Software Engineer',
  description:
    'Akshit Jain is an AI Software Engineer Intern at Centific and a final-year BTech CSE (ML) student at LPU, building intelligent systems end-to-end — models, typed APIs, and the interfaces around them.',
  keywords: [
    'Akshit Jain',
    'AI Software Engineer',
    'Machine Learning',
    'Computer Vision',
    'Python Developer',
    'Next.js',
    'FastAPI',
    'Centific',
    'Portfolio',
    'LPU',
    'AI',
  ],
  authors: [{ name: 'Akshit Jain' }],
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'Akshit Jain — AI Software Engineer',
    description: 'AI Software Engineer Intern at Centific, building intelligent systems end-to-end.',
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
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        <ScrollProgress />
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
