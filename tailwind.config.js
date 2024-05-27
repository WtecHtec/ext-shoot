import { blackA } from '@radix-ui/colors';
import windyRadixPalette from 'windy-radix-palette';

import palette from './radix.config';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{tsx,html}'],
  darkMode: 'media',
  corePlugins: {
    preflight: true
  },
  theme: {
    extend: {
      colors: {
        ...blackA
      }
    }
  },
  plugins: [
    windyRadixPalette({
      colors: palette
    })
  ]
};
