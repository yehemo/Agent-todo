import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: '#1e1b4b',
          hover: '#312e81',
          active: '#4338ca',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
