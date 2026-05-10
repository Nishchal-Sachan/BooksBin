/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f7f5',
          100: '#dfece7',
          200: '#bfd8cf',
          300: '#92b8a9',
          400: '#5f9480',
          500: '#467a68',
          600: '#386355',
          700: '#2e5146',
          800: '#274239',
          900: '#223731',
        },
        secondary: {
          50: '#faf7f2',
          100: '#f3ebe0',
          200: '#e5d4c1',
          300: '#d4b89b',
          400: '#c19972',
          500: '#a67c56',
          600: '#8c6648',
          700: '#73523c',
          800: '#5f4435',
          900: '#4f3a2f',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        success: {
          DEFAULT: '#4d8f6f',
          foreground: '#1a3d2e',
          muted: '#e6f2eb',
        },
        error: {
          DEFAULT: '#c65a5a',
          foreground: '#5c2222',
          muted: '#fceaea',
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#f7f7f6',
          muted: '#efeeec',
        },
      },
      maxWidth: {
        app: '1320px',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '16px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(28, 25, 23, 0.05), 0 1px 3px rgba(28, 25, 23, 0.08)',
        card: '0 4px 12px rgba(28, 25, 23, 0.07), 0 2px 4px rgba(28, 25, 23, 0.04)',
        elevated: '0 16px 40px rgba(28, 25, 23, 0.1), 0 6px 14px rgba(28, 25, 23, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h1': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        'h2': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.015em', fontWeight: '600' }],
        'h3': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.625rem' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5rem' }],
        'small': ['0.8125rem', { lineHeight: '1.375rem' }],
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
