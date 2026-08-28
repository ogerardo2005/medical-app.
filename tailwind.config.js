/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Clinical slate blue - primary brand/accent color. Mirrored as plain
        // hex in src/theme/colors.ts for use outside className strings (icon
        // `color` props, native Switch/Tabs colors) - keep both in sync.
        primary: {
          50: '#F2F6F8',
          100: '#E2EAEF',
          200: '#C4D5DF',
          300: '#9FB8C8',
          400: '#7292A8',
          500: '#4E7188',
          600: '#3E5C76',
          700: '#324A5F',
          800: '#28404F',
          900: '#1D2F3A',
          950: '#101B22',
          DEFAULT: '#3E5C76',
        },
        // Medical green - reserved for positive/success clinical signals
        // (e.g. a "normal" calculator result), not a general-purpose accent.
        medical: {
          50: '#EFF9F3',
          100: '#DAF0E3',
          200: '#B3E0C8',
          300: '#84CBA8',
          400: '#54B186',
          500: '#2E8B57',
          600: '#25714A',
          700: '#1F5D3E',
          800: '#1A4A32',
          900: '#153C29',
          950: '#0B2217',
          DEFAULT: '#2E8B57',
        },
      },
    },
  },
  plugins: [],
};
