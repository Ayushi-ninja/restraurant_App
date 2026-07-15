/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4: use the 'content' array to point at your source files
  content: [
    './App.{js,jsx,ts,tsx}',
    './index.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ── Brand ─────────────────────────────────────────────────────────
        primary: {
          DEFAULT: '#FF5A1F',
          50: '#FFF3EE',
          100: '#FFE4D6',
          200: '#FFCAAD',
          300: '#FFA37A',
          400: '#FF7645',
          500: '#FF5A1F',
          600: '#F03D00',
          700: '#C73100',
          800: '#A22A00',
          900: '#852700',
        },
        // ── Warm Neutrals ─────────────────────────────────────────────────
        neutral: {
          50: '#FAF8F6',
          100: '#F4F0EC',
          200: '#E8E2DA',
          300: '#D4CCC2',
          400: '#B0A898',
          500: '#8C8278',
          600: '#6B6158',
          700: '#4A4239',
          800: '#2E2820',
          900: '#1A1410',
        },
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
