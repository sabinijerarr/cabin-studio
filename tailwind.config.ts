import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        amber: {
          DEFAULT: '#D4A853',
          light: '#E8C27A',
          dark: '#B8883A',
        },
        forest: {
          DEFAULT: '#2A3C28',
          light: '#3A5236',
          dark: '#1C2A1A',
        },
        'warm-black': {
          DEFAULT: '#1A1610',
          light: '#2A2418',
        },
        cream: {
          DEFAULT: '#F2E8D5',
          dark: '#E0D0B0',
        },
      },
      fontFamily: {
        cinzel: ['var(--font-cinzel)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'Georgia', 'serif'],
        jetbrains: ['var(--font-jetbrains)', 'monospace'],
      },
      backgroundImage: {
        'cabin-gradient': 'linear-gradient(to bottom, rgba(26,22,16,0.3) 0%, rgba(26,22,16,0.7) 100%)',
      },
    },
  },
  plugins: [],
}

export default config
