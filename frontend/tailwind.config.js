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
          50: '#eef2f7',
          100: '#d5dfe9',
          200: '#acbdd3',
          300: '#7d97b5',
          400: '#557599',
          500: '#3d5f82',
          600: '#2f4d6e',
          700: '#253d58',
          800: '#1e3247',
          900: '#182939',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
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
          DEFAULT: '#15803d',
          foreground: '#14532d',
          muted: '#dcfce7',
        },
        error: {
          DEFAULT: '#dc2626',
          foreground: '#991b1b',
          muted: '#fee2e2',
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#f7f5f2',
          muted: '#efecea',
        },
        ink: {
          DEFAULT: '#1c1917',
          muted: '#44403c',
          faint: '#78716c',
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
        soft: '0 1px 2px rgba(28, 25, 23, 0.06), 0 1px 3px rgba(28, 25, 23, 0.1)',
        card: '0 4px 16px rgba(28, 25, 23, 0.08), 0 2px 4px rgba(28, 25, 23, 0.05)',
        elevated: '0 16px 40px rgba(28, 25, 23, 0.12), 0 6px 14px rgba(28, 25, 23, 0.08)',
        nav: '0 1px 0 rgba(28, 25, 23, 0.06), 0 4px 12px rgba(28, 25, 23, 0.04)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      fontSize: {
        display: ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '400' }],
        h1: ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '400' }],
        h2: ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.015em', fontWeight: '400' }],
        h3: ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '500' }],
        body: ['1rem', { lineHeight: '1.625rem' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5rem' }],
        small: ['0.8125rem', { lineHeight: '1.375rem' }],
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
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
