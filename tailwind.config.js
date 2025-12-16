/** @type {import('tailwindcss').Config} */
export default {
  // We strictly limit content to your source files to ensure no unused CSS is generated
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  
  // 1. DISABLE DEFAULT COLORS
  // By not using "extend" for colors, we disable Tailwind's default palette.
  // This forces the team to use ONLY the strict palette defined below.
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',

      // 2. BRAND PILLARS (Your official identity)
      brand: {
        red: '#ba2a33',    // Voxummah Red (Primary actions, Breaking news)
        green: '#096939',  // Ummah Green (Foundations, Trust, Culture)
      },

      // 3. NEUTRAL SCALE (Ink & Paper)
      // Optimized for high-contrast news reading.
      neutral: {
        900: '#111111', // Main Headings (Almost black, softer than #000)
        800: '#262626', // Dark UI Backgrounds / Footer
        600: '#525252', // Body Text (Comfortable reading contrast)
        400: '#A3A3A3', // Meta Data (Dates, Authors)
        200: '#E5E5E5', // Borders / Dividers
        100: '#F5F5F5', // Light Section Backgrounds
        50:  '#FAFAFA', // Subtle Alternating Rows
      },

      // 4. UI SIGNALS (Functional colors)
      // Kept separate from brand colors for accessibility clarity.
      ui: {
        error: '#DC2626',   // Standard error red
        success: '#10B981', // Standard success green
        warning: '#FBBF24', // Warning yellow
      }
    },

    // 5. TYPOGRAPHY SYSTEM
    // Defined by ROLE (Headings vs Body), not just font family name.
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      heading: ['Barlow Condensed', 'sans-serif'],
    },
    
    // 6. TYPE SCALE (The "Major Third" Scale)
    // Prevents arbitrary font sizes like text-[17px].
    fontSize: {
      xs:   ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],     // LABELS / TAGS
      sm:   ['0.875rem', { lineHeight: '1.25rem' }],                          // META / BYLINES
      base: ['1rem', { lineHeight: '1.625rem' }],                             // BODY COPY
      lg:   ['1.125rem', { lineHeight: '1.75rem' }],                          // LEAD PARAGRAPHS
      xl:   ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }], // SECTION HEADERS
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],    // CARD TITLES
      '3xl': ['2rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],   // FEATURE TITLES
      '4xl': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],     // PAGE TITLES
      '5xl': ['3.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],       // HERO DISPLAY
    },

    extend: {
      // 7. SPACING 
      // We rely on the default 4px grid (m-1 = 4px) but can lock this down later if needed.
    }
  },
  plugins: [],
};