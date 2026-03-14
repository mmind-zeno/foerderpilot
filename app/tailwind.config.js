/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D4F6B',
          dark: '#093847',
          light: '#1a6d8f',
        },
        accent: {
          DEFAULT: '#E8530A',
          dark: '#c4440a',
          light: '#f06530',
        },
        bg: '#F8F7F4',
        surface: '#FFFFFF',
        muted: '#EAE8E4',
        border: '#D4D1CB',
        'text-base': '#1A1A1A',
        'text-muted': '#6B6860',
        'text-light': '#9B998F',
      },
      fontFamily: {
        headline: ['Fraunces', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'shimmer': 'shimmer 1.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
