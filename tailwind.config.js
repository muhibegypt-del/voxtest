/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',

      brand: {
        red: '#ba2a33',       // Pulse / Action
        green: '#096939',     // Foundations / Identity
        'green-deep': '#0d6b35', // INTERACTION STATE (The requested darker shade)
      },

      neutral: {
        900: '#111111', 
        800: '#262626', 
        600: '#525252', 
        400: '#A3A3A3', 
        200: '#E5E5E5', 
        100: '#F5F5F5', 
        50:  '#FAFAFA', 
      },

      ui: {
        error: '#DC2626',   
        success: '#10B981', 
        warning: '#FBBF24', 
      }
    },
    // ... rest of config
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      heading: ['Barlow Condensed', 'sans-serif'],
    },
    fontSize: {
      xs:   ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
      sm:   ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.625rem' }],
      lg:   ['1.125rem', { lineHeight: '1.75rem' }],
      xl:   ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
      '3xl': ['2rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
      '4xl': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
      '5xl': ['3.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
    },
  },
  plugins: [],
};