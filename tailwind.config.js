/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 1. BRAND CORE - Using CSS Variables for HSL (Rule B.12)
        brand: {
          red: 'hsl(var(--brand-red) / <alpha-value>)',
          green: 'hsl(var(--brand-green) / <alpha-value>)',
          'green-deep': 'hsl(var(--brand-green-deep) / <alpha-value>)',
          'nav-hover': '#084020', // Specific green for navbar text hover
          newsletter: 'hsl(146 40% 15% / <alpha-value>)',
        },

        // Badge semantic colors
        badge: {
          'red-bg': 'hsl(356 63% 45% / 0.1)',
          'red-text': 'hsl(356 63% 35% / <alpha-value>)',
          'neutral-bg': 'hsl(0 0% 32% / 0.1)',
          'neutral-text': 'hsl(0 0% 25% / <alpha-value>)',
          'green-bg': 'hsl(150 84% 22% / 0.1)',
          'green-text': 'hsl(150 84% 18% / <alpha-value>)',
        },

        // 2. SECTION IDENTITIES
        section: {
          analysis: 'hsl(var(--section-analysis) / <alpha-value>)',
          voices: 'hsl(var(--section-voices) / <alpha-value>)',
          media: 'hsl(var(--section-media) / <alpha-value>)',
          store: 'hsl(var(--section-store) / <alpha-value>)',
          archive: 'hsl(var(--section-archive) / <alpha-value>)',
        },

        // 3. NEUTRAL SCALE (Custom - overrides gray scale)
        neutral: {
          900: 'hsl(var(--neutral-900) / <alpha-value>)',
          800: 'hsl(var(--neutral-800) / <alpha-value>)',
          700: 'hsl(0 0% 25% / <alpha-value>)',
          600: 'hsl(var(--neutral-600) / <alpha-value>)',
          500: 'hsl(0 0% 45% / <alpha-value>)',
          400: 'hsl(var(--neutral-400) / <alpha-value>)',
          200: 'hsl(var(--neutral-200) / <alpha-value>)',
          100: 'hsl(var(--neutral-100) / <alpha-value>)',
          50: 'hsl(var(--neutral-50) / <alpha-value>)',
        },

        ui: {
          error: 'hsl(var(--ui-error) / <alpha-value>)',
          success: 'hsl(var(--ui-success) / <alpha-value>)',
          warning: 'hsl(var(--ui-warning) / <alpha-value>)',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Barlow Condensed', 'sans-serif'],
      },

      // Principle 5: Layer shadows for realistic depth (Ambient + Direct)
      boxShadow: {
        'layered': '0 2px 4px -1px rgb(0 0 0 / 0.08), 0 12px 24px -4px rgb(0 0 0 / 0.12)',
      },

      // Rule B.11: Non-Linear Spacing Scale
      spacing: {
        '0': '0',
        'px': '1px',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
        '40': '10rem',
        '48': '12rem',
        '56': '14rem',
        '64': '16rem',
      },

      // Strict Type Scale
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.625rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['2rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '5xl': ['3.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },

      // Typography plugin customization for news article styling
      typography: {
        DEFAULT: {
          css: {
            // Body text - optimized for reading
            color: '#1a1a1a',
            fontSize: '1.125rem',
            lineHeight: '1.8',
            maxWidth: '65ch',

            // Paragraphs - proper spacing for news articles
            p: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },

            // First paragraph after headings - no top margin
            'h1 + p, h2 + p, h3 + p, h4 + p': {
              marginTop: '0.75em',
            },

            // Lead paragraph styling
            'p:first-of-type': {
              fontSize: '1.25rem',
              lineHeight: '1.7',
              fontWeight: '400',
            },

            // Headings - use heading font
            h1: {
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: '700',
              fontSize: '2.5rem',
              lineHeight: '1.2',
              marginTop: '2em',
              marginBottom: '0.75em',
              letterSpacing: '-0.02em',
            },
            h2: {
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: '700',
              fontSize: '1.875rem',
              lineHeight: '1.3',
              marginTop: '2em',
              marginBottom: '0.75em',
              letterSpacing: '-0.01em',
            },
            h3: {
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: '700', // Principle 7: No 600
              fontSize: '1.5rem',
              lineHeight: '1.4',
              marginTop: '1.75em',
              marginBottom: '0.5em',
            },
            h4: {
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: '700', // Principle 7: No 600
              fontSize: '1.25rem',
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },

            // Links - brand red
            a: {
              color: 'hsl(356 63% 45%)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              textDecorationColor: 'hsl(356 63% 45% / 0.3)',
              fontWeight: '700', // Principle 7: Restrict to 400/700
              transition: 'color 0.2s ease, text-decoration-color 0.2s ease',
              '&:hover': {
                color: 'hsl(356 63% 35%)',
                textDecorationColor: 'hsl(356 63% 35%)',
              },
            },

            // Blockquotes - editorial style
            blockquote: {
              fontStyle: 'normal',
              borderLeftWidth: '4px',
              borderLeftColor: 'hsl(356 63% 45%)',
              paddingLeft: '1.5em',
              marginTop: '2em',
              marginBottom: '2em',
              fontSize: '1.25rem',
              lineHeight: '1.6',
              color: '#333',
            },
            'blockquote p:first-of-type::before': {
              content: 'none',
            },
            'blockquote p:last-of-type::after': {
              content: 'none',
            },

            // Lists - proper news formatting
            ul: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
              paddingLeft: '1.5em',
            },
            ol: {
              marginTop: '1.5em',
              marginBottom: '1.5em',
              paddingLeft: '1.5em',
            },
            li: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'li::marker': {
              color: 'hsl(356 63% 45%)',
            },

            // Images - responsive and styled
            img: {
              borderRadius: '0.5rem',
              marginTop: '2em',
              marginBottom: '2em',
            },

            // Figures and captions
            figure: {
              marginTop: '2em',
              marginBottom: '2em',
            },
            figcaption: {
              color: '#666',
              fontSize: '0.875rem',
              marginTop: '0.75em',
              textAlign: 'center',
            },

            // Code blocks
            code: {
              backgroundColor: '#f5f5f5',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontSize: '0.9em',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            pre: {
              backgroundColor: '#1a1a1a',
              borderRadius: '0.5rem',
              padding: '1.25em',
              marginTop: '2em',
              marginBottom: '2em',
            },

            // Horizontal rules
            hr: {
              borderColor: '#e5e5e5',
              marginTop: '3em',
              marginBottom: '3em',
            },

            // Strong and emphasis
            strong: {
              fontWeight: '700', // Principle 7
              color: 'inherit',
            },
            em: {
              fontStyle: 'italic',
            },
          },
        },
        // Large variant for articles
        lg: {
          css: {
            fontSize: '1.25rem',
            lineHeight: '1.75',
            p: {
              marginTop: '1.75em',
              marginBottom: '1.75em',
            },
            h2: {
              fontSize: '2.25rem',
              marginTop: '2.5em',
              marginBottom: '1em',
            },
            h3: {
              fontSize: '1.75rem',
              marginTop: '2em',
              marginBottom: '0.75em',
            },
            blockquote: {
              fontSize: '1.375rem',
              paddingLeft: '2em',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};