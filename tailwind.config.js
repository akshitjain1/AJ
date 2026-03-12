/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-barlow)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        ink: '#0A0A0A',
        muted: '#71717A',
        subtle: '#F4F4F5',
        border: '#E4E4E7',
        accent: '#18181B',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'marquee-slow': 'marquee 50s linear infinite',
        'fade-up': 'fade-up 0.6s ease forwards',
      },
    },
  },
  plugins: [],
};
